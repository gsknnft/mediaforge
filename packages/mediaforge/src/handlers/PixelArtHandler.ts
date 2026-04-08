import { GifAnalyzer } from "../analyzers/GifAnalyzer";
import { CONSTANTS } from "../constants/gif.constants";
import {
  ParsedFrame,
  PixelArtMetrics,
  PixelArtSettings,
} from "@/types";

export const PIXEL_ART_SETTINGS: PixelArtSettings = {
  colorEnhancement: {
    red: 1.2,
    green: 1.2,
    blue: 1.2,
    alpha: 1.0,
  },
  blendMode: "normal",
  smoothing: false,
  pixelSnapping: true,
  colorQuantization: {
    method: "median-cut",
    colors: 256,
  },
  scalingMethod: "pixelated",
  maxScale: 4,
  preservePixelRatio: true,
  minimumPixelSize: 2,
};

export class PixelArtHandler {
  private static instance: PixelArtHandler | null = null;

  static getInstance(): PixelArtHandler {
    if (!this.instance) {
      this.instance = new PixelArtHandler();
    }

    return this.instance;
  }

  public destroyInstance() {
    PixelArtHandler.instance = null;
  }

  public detectPixelArt(frame: ParsedFrame): boolean {
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const uniqueColors = new Set<string>();
    let transparentPixelCount = 0;

    for (let i = 0; i < frame.patch.length; i += 4) {
      if (frame.patch[i + 3] === 0) {
        transparentPixelCount++;
        continue;
      }
      uniqueColors.add(
        `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`,
      );
    }

    const colorDensityRatio =
      uniqueColors.size / (totalPixels - transparentPixelCount);

    // Stricter pixel art criteria
    const isSmall = totalPixels <= 256 * 256;
    const hasLowColorDensity = colorDensityRatio <= 0.1;
    const hasSharpEdges = this.detectSharpEdges(frame);

    return isSmall && hasLowColorDensity && hasSharpEdges;
  }

  private detectSharpEdges(frame: ParsedFrame): boolean {
    const { width, height } = frame.dims;
    let sharpEdgeCount = 0;
    let totalEdges = 0;

    // Check for sharp color transitions
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        const up = ((y - 1) * width + x) * 4;
        const down = ((y + 1) * width + x) * 4;
        const left = (y * width + (x - 1)) * 4;
        const right = (y * width + (x + 1)) * 4;

        if (frame.patch[idx + 3] > 0) {
          // Only check non-transparent pixels
          totalEdges++;
          if (
            this.isSharpTransition(frame.patch, idx, up) ||
            this.isSharpTransition(frame.patch, idx, down) ||
            this.isSharpTransition(frame.patch, idx, left) ||
            this.isSharpTransition(frame.patch, idx, right)
          ) {
            sharpEdgeCount++;
          }
        }
      }
    }

    return totalEdges > 0 && sharpEdgeCount / totalEdges > 0.4; // 40% sharp edges threshold
  }

  private isSharpTransition(
    patch: Uint8ClampedArray,
    idx1: number,
    idx2: number,
  ): boolean {
    if (patch[idx2 + 3] === 0) return false; // Skip transparent pixels

    const threshold = 32; // Color difference threshold
    return (
      Math.abs(patch[idx1] - patch[idx2]) > threshold ||
      Math.abs(patch[idx1 + 1] - patch[idx2 + 1]) > threshold ||
      Math.abs(patch[idx1 + 2] - patch[idx2 + 2]) > threshold
    );
  }

  public analyzePixelArtFrame(frame: ParsedFrame): PixelArtMetrics {
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const colorMap = new Map<string, number>();
    let transparentPixels = 0;
    let partiallyTransparentPixels = 0;

    // Scan the frame's pixel data
    for (let i = 0; i < frame.patch.length; i += 4) {
      if (frame.patch[i + 3] === 0) {
        transparentPixels++;
        continue; // Skip fully transparent pixels
      }
      if (frame.patch[i + 3] < 255) partiallyTransparentPixels++;

      const colorKey = `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`;
      colorMap.set(colorKey, (colorMap.get(colorKey) || 0) + 1);
    }

    const uniqueColors = colorMap.size;
    const visiblePixels = totalPixels - transparentPixels;
    const uniqueRatio = visiblePixels > 0 ? uniqueColors / visiblePixels : 1;

    // **Pixel Art Heuristics**
    const isSmall = width <= 256 && height <= 256;
    const hasLowColorDensity = uniqueRatio < 0.1; // Less than 10% unique colors
    const isPixelArt = isSmall && hasLowColorDensity;
    const isFire = isPixelArt ? "Pixel Art" : "FIRE";

    return {
      ...frame,
      colors: uniqueColors,
      uniqueColors,
      totalPixels,
      uniqueRatio,
      isPixelArt,
      hasTransparency: transparentPixels > 0 || partiallyTransparentPixels > 0,
      needsDisposal:
        partiallyTransparentPixels > 0 ||
        (transparentPixels > 0 && transparentPixels < totalPixels),
      disposalType: partiallyTransparentPixels > 0 ? 2 : 1,
    };
  }

  public processPixelArtFrame(
    frame: ParsedFrame,
    frameAnalysis: ReturnType<
      typeof GifAnalyzer.prototype.analyzeGIFFrameDimensions
    >,
    frameIndex: number,
  ): ParsedFrame {
    if (!frame.dims || !frame.patch) {
      throw new Error("Invalid frame data");
    }

    const { maxWidth, maxHeight, scaleFactors } = frameAnalysis;

    // Calculate base scale for entire GIF
    const baseScale = Math.max(
      1,
      Math.floor(CONSTANTS.TARGET_SIZE / Math.max(maxWidth, maxHeight)),
    );

    // Keep original frame dimensions and positions
    const originalFrameData = {
      width: frame.dims.width,
      height: frame.dims.height,
      top: frame.dims.top || 0,
      left: frame.dims.left || 0,
    };

    // Calculate scaled dimensions while maintaining aspect ratio
    const scaledDimensions = {
      width: Math.floor(originalFrameData.width * baseScale),
      height: Math.floor(originalFrameData.height * baseScale),
      targetWidth: Math.floor(maxWidth * baseScale),
      targetHeight: Math.floor(maxHeight * baseScale),
    };

    // Calculate position maintaining absolute positioning
    const position = {
      x: originalFrameData.left * baseScale,
      y: originalFrameData.top * baseScale,
    };

    // For frames without explicit positioning, center them
    if (originalFrameData.left === 0 && originalFrameData.top === 0) {
      position.x = Math.floor(
        (scaledDimensions.targetWidth - scaledDimensions.width) / 2,
      );
      position.y = Math.floor(
        (scaledDimensions.targetHeight - scaledDimensions.height) / 2,
      );
    }

    // Ensure pixel-perfect alignment
    const alignedPosition = {
      x: Math.floor(position.x / baseScale) * baseScale,
      y: Math.floor(position.y / baseScale) * baseScale,
    };

    // Create source canvas with original frame dimensions
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frame.dims.width;
    tempCanvas.height = frame.dims.height;
    const tempCtx = tempCanvas.getContext("2d", { alpha: true });
    if (!tempCtx) throw new Error("Failed to get temp context");

    // Disable smoothing for pixel art
    tempCtx.imageSmoothingEnabled = false;
    tempCtx.imageSmoothingQuality = "low";

    // Create and draw source image data
    const sourceData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      frame.dims.width,
      frame.dims.height,
    );
    tempCtx.putImageData(sourceData, 0, 0);

    // Create output canvas with scaled dimensions
    const outCanvas = document.createElement("canvas");
    outCanvas.width = scaledDimensions.targetWidth;
    outCanvas.height = scaledDimensions.targetHeight;
    const outCtx = outCanvas.getContext("2d", { alpha: true });
    if (!outCtx) throw new Error("Failed to get output context");

    // Set pixel-perfect rendering
    outCtx.imageSmoothingEnabled = false;
    outCtx.imageSmoothingQuality = "low";

    // Draw frame with precise positioning
    outCtx.drawImage(
      tempCanvas,
      0,
      0,
      originalFrameData.width,
      originalFrameData.height, // Source rect
      alignedPosition.x,
      alignedPosition.y, // Destination position
      scaledDimensions.width,
      scaledDimensions.height, // Destination size
    );

    // Get the final image data
    const finalData = outCtx.getImageData(
      0,
      0,
      scaledDimensions.targetWidth,
      scaledDimensions.targetHeight,
    );

    // Clean up
    tempCanvas.remove();
    outCanvas.remove();

    return {
      ...frame,
      patch: finalData.data,
      dims: {
        width: scaledDimensions.targetWidth,
        height: scaledDimensions.targetHeight,
        top: 0,
        left: 0,
      },
      disposalType: frame.disposalType || 2,
    };
  }
}

export const pixelArtHandler = PixelArtHandler.getInstance();
