import { ParsedFrame } from "gifuct-js";
import { GIFProgressTracker, GIF_PHASES } from "../trackers/GIFProgressTracker";
import { Overlay } from "../types/asset.types";

class GIFTools {
  public readonly CONSTANTS = {
    MAX_CANVAS_SIZE: 2800,
    WORKING_SIZE: 800,
    NFT_SIZE: 2800,
    POOL_SIZE: 15,
    CANVAS_PER_SIZE: 5,
    MEMORY_LIMIT: 800 * 1024 * 1024,
    QUALITY: 1,
    BATCH_SIZE: 5,
    MEMORY_THRESHOLD: 0.8,
    SCALE_DOWN_FACTOR: 0.5,
    MAX_WORKERS: Math.ceil(navigator.hardwareConcurrency || 6),
    TARGET_SIZE: 800,
    MIN_SIZE: 400,
    DITHER: false,
    DELAY: 100,
    WORKER_PATH: "/gif.worker.js",
  } as const;

  private completedPhases: Set<string>;

  readonly QUALITY_PRESETS = {
    LOW: {
      quality: 10,
      dither: false,
      frameSkip: 2,
      colors: 128,
      colorEnhancement: {
        red: 0.8,
        green: 0.8,
        blue: 0.8,
      },
    },
    MEDIUM: {
      quality: 5,
      dither: "FloydSteinberg",
      frameSkip: 1,
      colors: 256,
      colorEnhancement: {
        red: 1.1,
        green: 1.1,
        blue: 1.1,
      },
    },
    HIGH: {
      quality: 1,
      dither: "FloydSteinberg",
      frameSkip: 0,
      colors: 256,
      preserveAlpha: true,
      smoothing: true,
    },
    FIRE: {
      quality: 1,
      dither: false,
      frameSkip: 0,
      colors: 256,
      preserveAlpha: true,
      smoothing: true,
      blendMode: "screen",
      colorEnhancement: {
        red: 1.2,
        green: 0.9,
        blue: 0.8,
        alpha: 1.2,
      },
    },
  } as const;

  constructor(private progTracker: GIFProgressTracker) {
    this.completedPhases = new Set();
  }

  async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = url;
    });
  }
  /**
   * Generates a new patch based on the enhanced color table and frame data.
   * @param frame - The original frame.
   * @param enhancedColorTable - The enhanced color table.
   * @returns The new patch as a Uint8ClampedArray.
   */
  generatePatch(
    frame: ParsedFrame,
    enhancedColorTable: [number, number, number][],
  ): Uint8ClampedArray {
    const patchLength = frame.patch.length;
    const newPatch = new Uint8ClampedArray(patchLength);
    for (let i = 0; i < patchLength; i += 4) {
      const pixelIndex = Math.floor(i / 4);
      const colorIndex = frame.pixels[pixelIndex] || 0;
      const color = enhancedColorTable[colorIndex] || [255, 255, 255];

      newPatch[i] = color[0]; // Red
      newPatch[i + 1] = color[1]; // Green
      newPatch[i + 2] = color[2]; // Blue
      newPatch[i + 3] = 255; // Force full opacity
    }

    return newPatch;
  }
  /**
   * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
   * @param frame - The parsed GIF frame to optimize.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The optimized frame.
   */
  preOptimizeGifFrame(
    frame: ParsedFrame,
    enhanceColors: boolean = false,
    quality: keyof typeof this.QUALITY_PRESETS = "FIRE",
  ): ParsedFrame {
    // Get quality settings
    const qualitySettings = this.QUALITY_PRESETS[quality];

    // Enhance the color table
    const enhancedColorTable = this.enhanceColorTable(
      frame.colorTable,
      enhanceColors,
      quality,
    );

    // Generate the new patch
    const newPatch = this.generatePatch(frame, enhancedColorTable);

    // Return the optimized frame
    return {
      ...frame,
      colorTable: enhancedColorTable,
      patch: newPatch,
    };
  }

  /**
   * Enhances the color table based on quality and enhancement settings.
   * @param colorTable - The original color table.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The enhanced color table.
   */
  enhanceColorTable(
    colorTable: [number, number, number][],
    enhanceColors: boolean,
    quality: keyof typeof this.QUALITY_PRESETS,
  ): [number, number, number][] {
    const settings = this.QUALITY_PRESETS[quality];

    return colorTable.map((color) => {
      // Use solid white for invalid colors to prevent transparency
      if (!color || color.length !== 3) {
        return [255, 255, 255];
      }

      const [r, g, b] = color;

      // Special handling for FIRE preset
      if (quality === "FIRE" && enhanceColors && r > g && r > b) {
        return [Math.min(255, r * 1.2), g * 0.9, b * 0.8];
      }

      // Return original color values
      return [r, g, b];
    });
  }

  async loadAndCreateStaticImage(
    bglessUrl: string,
    overlays?: Overlay[],
  ): Promise<HTMLCanvasElement> {
    try {
      this.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        0,
        "Starting static layer creation...",
      );

      // Load bgless NFT first to get dimensions
      const bglessImage = await this.loadImage(bglessUrl);
      this.updatePhase(GIF_PHASES.CREATE_STATIC.id, 20, "Background loaded");

      // Create canvas at original GIF size
      const canvas = document.createElement("canvas");
      canvas.width = this.CONSTANTS.TARGET_SIZE;
      canvas.height = this.CONSTANTS.TARGET_SIZE;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Failed to get canvas context");

      // Calculate scaling to maintain aspect ratio
      const scale = Math.min(
        this.CONSTANTS.TARGET_SIZE / this.CONSTANTS.NFT_SIZE,
        this.CONSTANTS.TARGET_SIZE / this.CONSTANTS.NFT_SIZE,
      );

      // Calculate dimensions and position for centered placement
      const scaledWidth = Math.round(this.CONSTANTS.NFT_SIZE * scale);
      const scaledHeight = Math.round(this.CONSTANTS.NFT_SIZE * scale);
      const x = this.calculateCenteredPosition(
        this.CONSTANTS.TARGET_SIZE,
        scaledWidth,
      );
      const y = this.calculateCenteredPosition(
        this.CONSTANTS.TARGET_SIZE,
        scaledHeight,
      );

      // Draw scaled and centered bgless NFT
      ctx.drawImage(bglessImage, x, y, scaledWidth, scaledHeight);

      // Handle overlays
      if (overlays?.length) {
        this.updatePhase(GIF_PHASES.CREATE_STATIC.id, 50, "Adding overlays...");

        for (let i = 0; i < overlays.length; i++) {
          const overlay = overlays[i];
          const overlayImage = await this.loadImage(overlay.url);

          // Draw each overlay at the same scale and position
          ctx.drawImage(overlayImage, x, y, scaledWidth, scaledHeight);

          this.updatePhase(
            GIF_PHASES.CREATE_STATIC.id,
            20 + Math.round(((i + 1) / overlays.length) * 80),
            `Processing overlay ${i + 1}/${overlays.length}`,
          );
        }
      }

      this.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        100,
        "Static layer complete",
      );
      return canvas;
    } catch (error) {
      console.error("Error creating static image:", error);
      throw error;
    }
  }

  public updatePhase(
    phaseId: string,
    progress: number,
    message: string,
    totalFrames?: number,
  ): void {
    this.progTracker.updateProgress(phaseId, progress, message);
    const overallProgress = Math.round(
      Object.values(GIF_PHASES).reduce((total, currentPhase) => {
        if (currentPhase.id === phaseId) {
          return total + (currentPhase.weight * progress) / 100;
        }
        if (this.completedPhases.has(currentPhase.id)) {
          return total + currentPhase.weight;
        }
        return total;
      }, 0),
    );

    this.progTracker.updateProgress(phaseId, progress, message);

    window.dispatchEvent(
      new CustomEvent("gif-phase-update", {
        detail: {
          phaseId,
          currentProgress: progress,
          overallProgress,
          message,
          timestamp: Date.now(),
          eta:
            totalFrames !== undefined &&
            (phaseId === GIF_PHASES.PROCESSING.id ||
              phaseId === GIF_PHASES.ENCODING.id)
              ? this.calculateETA(
                  Math.floor((progress / 100) * totalFrames),
                  totalFrames,
                )
              : undefined,
        },
      }),
    );

    if (progress >= 100) {
      this.progTracker.updateProgress(phaseId, 100, message);
      this.completedPhases.add(phaseId);
    }
  }

  private processingStartTime: number = 0;
  private framesProcessed: number = 0;
  private averageFrameTime: number = 0;

  // Add this method to calculate ETA
  private calculateETA(currentFrame: number, totalFrames: number): string {
    const now = Date.now();
    const elapsed = now - this.processingStartTime;
    if (currentFrame === 0) {
      this.processingStartTime = now;
      return "Calculating...";
    }

    this.framesProcessed = currentFrame;
    this.averageFrameTime = elapsed / currentFrame;

    const remainingFrames = totalFrames - currentFrame;
    const estimatedRemainingMs = remainingFrames * this.averageFrameTime;

    if (estimatedRemainingMs < 1000) {
      return "Less than a second";
    }

    const seconds = Math.round(estimatedRemainingMs / 1000);
    if (seconds < 60) {
      return `~${seconds} seconds`;
    }

    const minutes = Math.round(seconds / 60);
    return `~${minutes} minute${minutes > 1 ? "s" : ""}`;
  }
  calculateCenteredPosition(containerSize: number, imageSize: number): number {
    return Math.floor((containerSize - imageSize) / 2);
  }

  getCacheKey(gifUrl: string): string {
    return gifUrl;
  }

  validateInput(
    frames: ParsedFrame[],
    bglessUrl: string,
    overlays?: Overlay[],
  ): void {
    if (!frames?.length) throw new Error("No frames provided");
    if (!bglessUrl) throw new Error("No background image URL provided");
    if (!Array.isArray(overlays)) throw new Error("Invalid overlays format");
  }

  optimizeGifFrame(
    frame: ImageBitmap,
    enhanceColors: boolean = false,
  ): HTMLCanvasElement {
    const optimizedCanvas = document.createElement("canvas");
    optimizedCanvas.width = this.CONSTANTS.TARGET_SIZE;
    optimizedCanvas.height = this.CONSTANTS.TARGET_SIZE;

    const ctx = optimizedCanvas.getContext("2d", {
      willReadFrequently: true,
      alpha: false,
    });

    if (ctx) {
      // Base settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Initial white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, optimizedCanvas.width, optimizedCanvas.height);

      // Draw frame with copy operation first
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(frame, 0, 0, optimizedCanvas.width, optimizedCanvas.height);

      if (enhanceColors) {
        // Get frame data
        const imageData = ctx.getImageData(
          0,
          0,
          optimizedCanvas.width,
          optimizedCanvas.height,
        );
        const data = imageData.data;

        // Process colors and force opacity
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] > data[i + 1] && data[i] > data[i + 2]) {
            data[i] = Math.min(255, data[i] * 1.2);
            data[i + 1] *= 0.9;
            data[i + 2] *= 0.8;
          }
          data[i + 3] = 255;
        }

        // Apply enhanced data
        ctx.putImageData(imageData, 0, 0);
      }
    }

    return optimizedCanvas;
  }

  // Add this new helper method for calculating frame fit dimensions
  calculateGifFitDimensions(
    frameWidth: number,
    frameHeight: number,
  ): {
    width: number;
    height: number;
    x: number;
    y: number;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
  } {
    const targetSize = this.CONSTANTS.TARGET_SIZE;
    const aspectRatio = frameWidth / frameHeight;
    const targetAspectRatio = 1; // We want a square output

    let scaledWidth, scaledHeight;
    let sourceX = 0,
      sourceY = 0;
    let sourceWidth = frameWidth,
      sourceHeight = frameHeight;

    if (aspectRatio > targetAspectRatio) {
      // Image is wider than target - crop sides
      scaledHeight = targetSize;
      scaledWidth = targetSize;

      // Calculate how much to crop from sides
      sourceHeight = frameHeight;
      sourceWidth = Math.round(frameHeight);
      sourceX = Math.round((frameWidth - sourceWidth) / 2);
    } else {
      // Image is taller than target - crop top/bottom
      scaledWidth = targetSize;
      scaledHeight = targetSize;

      // Calculate how much to crop from top/bottom
      sourceWidth = frameWidth;
      sourceHeight = Math.round(frameWidth);
      sourceY = Math.round((frameHeight - sourceHeight) / 2);
    }

    return {
      width: scaledWidth,
      height: scaledHeight,
      x: 0, // No need to center since we're filling the canvas
      y: 0,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    };
  }

  private normalizeFrameData(
    data: Uint8Array | Uint8ClampedArray,
    width: number,
    height: number,
  ): Uint8ClampedArray {
    const expectedLength = width * height * 4;
    const currentLength = data.length;

    // If data is already correct length, just ensure it's Uint8ClampedArray
    if (currentLength === expectedLength) {
      return new Uint8ClampedArray(data);
    }

    console.debug(
      `Normalizing frame data: ${currentLength} -> ${expectedLength} bytes`,
    );

    // Create new array with correct size
    const normalized = new Uint8ClampedArray(expectedLength);

    // Handle RGB vs RGBA conversion
    if (currentLength === width * height * 3) {
      // Convert RGB to RGBA
      for (let i = 0, j = 0; i < currentLength; i += 3, j += 4) {
        normalized[j] = data[i]; // R
        normalized[j + 1] = data[i + 1]; // G
        normalized[j + 2] = data[i + 2]; // B
        normalized[j + 3] = 255; // A
      }
    } else {
      // For other sizes, try to preserve as much data as possible
      const pixelCount = Math.floor(currentLength / 4);
      const validLength = pixelCount * 4;

      // Copy valid pixels
      for (let i = 0; i < validLength; i++) {
        normalized[i] = data[i];
      }

      // Fill remaining pixels with transparent black
      for (let i = validLength; i < expectedLength; i += 4) {
        normalized[i] = 0; // R
        normalized[i + 1] = 0; // G
        normalized[i + 2] = 0; // B
        normalized[i + 3] = 0; // A
      }
    }

    return normalized;
  }
}

export { GIFTools };
