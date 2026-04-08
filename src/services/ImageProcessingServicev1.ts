import { GifAnalyzer } from "../analyzers/GifAnalyzer";
import { CONSTANTS, QUALITY_PRESETS } from "../constants/gif.constants";
import { PixelArtHandler } from "../handlers/PixelArtHandler";
import {
  GIFMetadata,
  ParsedFrame,
  PixelArtMetrics,
  ProcessedFrame,
  QualityPresetExtension,
} from "../types";

interface IImageProcessingService {
  createImgBitmap(
    frames: ParsedFrame[],
    staticImage: HTMLCanvasElement,
  ): Promise<ProcessedFrame[]>;
  createCanvas(
    width: number,
    height: number,
  ): HTMLCanvasElement | OffscreenCanvas;
  getCanvasContext(
    canvas: HTMLCanvasElement | OffscreenCanvas,
  ): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
  preOptimizeGifFrame(
    frame: ParsedFrame,
    enhanceColors: boolean,
    quality: keyof typeof QUALITY_PRESETS,
  ): Promise<ParsedFrame>;
  calculateUniformDimensions(metadata: GIFMetadata): {
    width: number;
    height: number;
    scale: number;
  };
}

class ImageProcessingService implements IImageProcessingService {
  private static instance: ImageProcessingService | null = null;
  private workerCount: number;
  private pixelArtHandler: PixelArtHandler;
  private gifAnalyzer: GifAnalyzer;

  constructor(
    workerCount: number,
    pixelArtHandler: PixelArtHandler,
    gifAnalyzer: GifAnalyzer,
  ) {
    this.workerCount = workerCount;
    this.pixelArtHandler = pixelArtHandler;
    this.gifAnalyzer = gifAnalyzer;
  }

  public static getInstance(
    workerCount: number,
    pixelArtHandler: PixelArtHandler,
    gifAnalyzer: GifAnalyzer,
  ): ImageProcessingService {
    if (!this.instance) {
      this.instance = new ImageProcessingService(
        workerCount,
        pixelArtHandler,
        gifAnalyzer,
      );
    }

    return this.instance;
  }

  public destroyInstance() {
    ImageProcessingService.instance = null;
  }

  private normalizePatchForImageData(
    patch: Uint8ClampedArray,
  ): Uint8ClampedArray<ArrayBuffer> {
    if (patch.buffer instanceof ArrayBuffer) {
      return patch as Uint8ClampedArray<ArrayBuffer>;
    }
    // ImageData does not accept SharedArrayBuffer-backed views; copy to ArrayBuffer-backed view.
    return new Uint8ClampedArray(patch) as Uint8ClampedArray<ArrayBuffer>;
  }

  /**
   * Enhances the color table based on quality and enhancement settings.
   * @param colorTable - The original color table.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The enhanced color table.
   */
  private enhanceColorTable(
    colorTable: [number, number, number][],
    enhanceColors: boolean,
    quality: keyof typeof QUALITY_PRESETS,
  ): [number, number, number][] {
    const settings = QUALITY_PRESETS[quality];

    return colorTable.map((color) => {
      const [r, g, b] = color;

      if (quality === "FIRE" && enhanceColors && r > g && r > b) {
        return [Math.min(255, r * 1.2), g * 0.9, b * 0.8];
      }

      if (enhanceColors) {
        const factor = settings.colors / 256; // Normalize colors based on quality settings
        return [
          Math.min(255, r * factor),
          Math.min(255, g * factor),
          Math.min(255, b * factor),
        ];
      }

      return [r, g, b]; // Return original color if no enhancement is applied
    });
  }

  public async createImgBitmap(
    frames: ParsedFrame[],
    staticImage: HTMLCanvasElement,
  ): Promise<ProcessedFrame[]> {
    // Determine if GIF is pixel art once
    const isPixelArt = await this.gifAnalyzer.detectPixelArtInAllFrames(frames);

    // Normalize frames only if pixel art
    if (isPixelArt) {
      const frameAnalysis = this.gifAnalyzer.analyzeGIFFrameDimensions(frames);
      frames = frames.map((frame, i) =>
        this.pixelArtHandler.processPixelArtFrame(frame, frameAnalysis, i),
      );
    }

    // Create buffer for previous state (used for disposal handling)
    const bufferCanvas = document.createElement("canvas");
    bufferCanvas.width = CONSTANTS.TARGET_SIZE;
    bufferCanvas.height = CONSTANTS.TARGET_SIZE;
    const bufferCtx = bufferCanvas.getContext("2d", {
      alpha: true,
      willReadFrequently: true,
    });
    if (!bufferCtx) throw new Error("Failed to get buffer context");

    return Promise.all(
      frames.map(async (frame, index) => {
        const { width, height, left, top } = frame.dims;

        // Frame-specific canvas
        const frameCanvas = document.createElement("canvas");
        frameCanvas.width = width;
        frameCanvas.height = height;
        const frameCtx = frameCanvas.getContext("2d", {
          alpha: true,
          willReadFrequently: true,
        });
        if (!frameCtx) throw new Error("Failed to get frame context");

        // Draw current frame patch
        frameCtx.putImageData(
          new ImageData(
            this.normalizePatchForImageData(frame.patch),
            width,
            height,
          ),
          0,
          0,
        );

        // Composite canvas (final output)
        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.width = CONSTANTS.TARGET_SIZE;
        compositeCanvas.height = CONSTANTS.TARGET_SIZE;
        const compositeCtx = compositeCanvas.getContext("2d", {
          alpha: true,
          willReadFrequently: true,
        });
        if (!compositeCtx) throw new Error("Failed to get composite context");

        // Manage disposal types
        if (frame.disposalType === 2) {
          compositeCtx.clearRect(
            0,
            0,
            compositeCanvas.width,
            compositeCanvas.height,
          );
        } else {
          // Use previous buffer as base
          compositeCtx.drawImage(bufferCanvas, 0, 0);
        }

        // Handle pixel art (nearest-neighbor scaling)
        if (isPixelArt) {
          compositeCtx.imageSmoothingEnabled = false;
          compositeCtx.drawImage(frameCanvas, left, top, width, height);
        } else {
          // Standard image processing (high quality scaling)
          compositeCtx.imageSmoothingEnabled = true;
          compositeCtx.imageSmoothingQuality = "high";
          compositeCtx.drawImage(frameCanvas, left, top, width, height);
        }

        // Apply static image overlay (if any)
        if (staticImage) {
          compositeCtx.globalCompositeOperation = "source-over";
          compositeCtx.drawImage(
            staticImage,
            0,
            0,
            CONSTANTS.TARGET_SIZE,
            CONSTANTS.TARGET_SIZE,
          );
        }

        // Update buffer for next frame
        bufferCtx.clearRect(0, 0, bufferCanvas.width, bufferCanvas.height);
        bufferCtx.drawImage(compositeCanvas, 0, 0);

        try {
          return {
            bitmap: await createImageBitmap(compositeCanvas),
            originalFrame: {
              ...frame,
              delay: frame.delay,
              dims: {
                width: CONSTANTS.TARGET_SIZE,
                height: CONSTANTS.TARGET_SIZE,
                top: 0,
                left: 0,
              },
            },
          };
        } finally {
          // Clean up memory
          frameCanvas.remove();
          compositeCanvas.remove();
        }
      }),
    );
  }

  public createCanvas(
    width: number,
    height: number,
  ): HTMLCanvasElement | OffscreenCanvas {
    if (typeof OffscreenCanvas !== "undefined") {
      return new OffscreenCanvas(width, height);
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  public getCanvasContext(
    canvas: HTMLCanvasElement | OffscreenCanvas,
  ): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D {
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true,
    });
    if (!ctx) throw new Error("Failed to get canvas context");
    return ctx;
  }

  private scaleFramePatch(
    frame: ParsedFrame,
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ): HTMLCanvasElement {
    // Create a temporary canvas for the original frame dimensions
    const tempCanvas = this.createCanvas(frame.dims.width, frame.dims.height);
    const tempCtx = this.getCanvasContext(tempCanvas);

    // Convert patch to ImageData and draw on the temporary canvas
    const imageData = new ImageData(
      this.normalizePatchForImageData(frame.patch),
      frame.dims.width,
      frame.dims.height,
    );
    tempCtx.putImageData(imageData, 0, 0);

    // Draw scaled content onto the main canvas context
    ctx.drawImage(
      tempCanvas,
      0,
      0,
      CONSTANTS.TARGET_SIZE,
      CONSTANTS.TARGET_SIZE,
    );

    // Convert OffscreenCanvas to HTMLCanvasElement if needed
    if (tempCanvas instanceof OffscreenCanvas) {
      const finalCanvas = document.createElement("canvas");
      finalCanvas.width = tempCanvas.width;
      finalCanvas.height = tempCanvas.height;
      const finalCtx = finalCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (finalCtx) {
        finalCtx.drawImage(tempCanvas, 0, 0);
        return finalCanvas;
      }
    }
    return tempCanvas as HTMLCanvasElement;
  }

  private overlayStaticImage(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
    staticImage: HTMLCanvasElement,
  ): void {
    ctx.globalCompositeOperation = "source-over"; // Default composite operation
    ctx.drawImage(
      staticImage,
      0,
      0,
      CONSTANTS.TARGET_SIZE,
      CONSTANTS.TARGET_SIZE,
    );
  }

  /**
   * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
   * @param frame - The parsed GIF frame to optimize.
   * @param enhanceColors - Whether to enhance colors.
   * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
   * @returns The optimized frame.
   */
  public async preOptimizeGifFrame(
    frame: ParsedFrame,
    enhanceColors: boolean = false,
    quality: keyof typeof QUALITY_PRESETS = "HIGH",
  ): Promise<ParsedFrame> {
    const metrics = PixelArtHandler.prototype.analyzePixelArtFrame(frame);

    if (metrics.isPixelArt) {
      return {
        ...frame,
        patch: frame.patch, // Keep original patch data
        disposalType: metrics.disposalType,
        delay: frame.delay,
      };
    }

    // Analyze frame characteristics
    const settings = { ...QUALITY_PRESETS[quality] };

    // Adjust settings based on transparency
    if (metrics.hasTransparency) {
      settings.preserveAlpha = true;
      settings.alphaThreshold = metrics.needsDisposal ? 220 : 128;
      settings.disposalMethod = metrics.needsDisposal ? 2 : 1;
    }

    const optimizedPatch = await this.optimizePatch(
      frame.patch,
      frame.transparentIndex,
      quality,
      metrics,
    );

    if (!enhanceColors || !frame.colorTable) {
      return { ...frame, patch: optimizedPatch };
    }

    const enhancedColorTable = this.enhanceColorTable(
      frame.colorTable,
      enhanceColors,
      quality,
    );

    return {
      ...frame,
      colorTable: enhancedColorTable,
      patch: optimizedPatch,
      disposalType: frame.disposalType
        ? frame.disposalType
        : settings?.disposalMethod
          ? settings.disposalMethod
          : 2,
    };
  }

  public calculateUniformDimensions(metadata: GIFMetadata): {
    width: number;
    height: number;
    scale: number;
  } {
    const frameSizes = metadata.frameExtras.individualFrameSizes;
    const maxWidth = Math.max(...frameSizes.map((s) => s.width));
    const maxHeight = Math.max(...frameSizes.map((s) => s.height));

    // Calculate scale that fits largest dimensions
    const scale = Math.min(
      CONSTANTS.TARGET_SIZE / maxWidth,
      CONSTANTS.TARGET_SIZE / maxHeight,
    );

    return {
      width: Math.round(maxWidth * scale),
      height: Math.round(maxHeight * scale),
      scale,
    };
  }

  /**
   * Optimizes the patch array by handling transparency with worker pools.
   */
  private async optimizePatch(
    patch: Uint8ClampedArray,
    transparentIndex: number,
    quality: keyof typeof QUALITY_PRESETS,
    metrics: PixelArtMetrics,
  ): Promise<ImageDataArray> {
    const settings = QUALITY_PRESETS[quality];

    // Ensure chunk size is properly calculated
    const chunkSize = Math.ceil(patch.length / (this.workerCount * 4)) * 4; // Keep chunk sizes aligned to 4-byte pixels
    const chunks: Uint8ClampedArray[] = [];

    for (let i = 0; i < patch.length; i += chunkSize) {
      chunks.push(patch.subarray(i, Math.min(i + chunkSize, patch.length)));
    }

    // Process chunks in parallel
    const processedChunks = await Promise.all(
      chunks.map((chunk) =>
        this.processChunk(chunk, transparentIndex, settings, metrics),
      ),
    );

    // Combine processed chunks
    const newPatch = new Uint8ClampedArray(patch.length);
    let offset = 0;
    for (const chunk of processedChunks) {
      newPatch.set(chunk, offset);
      offset += chunk.length;
    }

    return newPatch;
  }

  /**
   * Process a single chunk of the patch data
   */
  private processChunk(
    chunk: Uint8ClampedArray,
    transparentIndex: number,
    settings: QualityPresetExtension,
    metrics: PixelArtMetrics,
  ): Uint8ClampedArray {
    const newChunk = new Uint8ClampedArray(chunk.length);

    if (metrics.isPixelArt) {
      // 🏎 **Fast Path for Pixel Art (Exact Copy)**
      newChunk.set(chunk);
      return newChunk;
    }

    const alphaThreshold = 220;
    const { colorEnhancement } = settings;

    for (let i = 0; i < chunk.length; i += 4) {
      const alpha = chunk[i + 3]; // Alpha Channel
      const r = chunk[i];
      const g = chunk[i + 1];
      const b = chunk[i + 2];

      // 🔍 **Fix: Correct Transparency Handling**
      if (alpha < alphaThreshold || transparentIndex === r) {
        newChunk[i] = 0;
        newChunk[i + 1] = 0;
        newChunk[i + 2] = 0;
        newChunk[i + 3] = 0; // Full transparency
      } else {
        // 🎨 **Apply Color Enhancements**
        newChunk[i] = Math.min(255, r * (colorEnhancement?.red ?? 1));
        newChunk[i + 1] = Math.min(255, g * (colorEnhancement?.green ?? 1));
        newChunk[i + 2] = Math.min(255, b * (colorEnhancement?.blue ?? 1));
        newChunk[i + 3] = 255; // Ensure full opacity
      }
    }

    return newChunk;
  }
}

export default ImageProcessingService;
