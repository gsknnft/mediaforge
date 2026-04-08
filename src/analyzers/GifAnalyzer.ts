import { decompressFrames, ParsedFrame, parseGIF } from "gifuct-js";
import { PixelArtHandler } from "../handlers/PixelArtHandler";
import { GIFMetadata, ImageAnalysis } from "../types";

export interface IGifAnalyzer {
  analyzeGIF(buffer: ArrayBuffer): Promise<GIFMetadata>;
  analyzeGIFFrameDimensions(frames: ParsedFrame[]): {
    maxWidth: number;
    maxHeight: number;
    hasVariableSize: boolean;
    scaleFactors: number[];
  };
}

export class GifAnalyzer implements IGifAnalyzer {
  private static instance: GifAnalyzer | null = null;

  static getInstance(): GifAnalyzer {
    if (!this.instance) {
      this.instance = new GifAnalyzer();
    }

    return this.instance;
  }

  public destroyInstance() {
    GifAnalyzer.instance = null;
  }

  public async analyzeImageFromGif(
    buffer: ArrayBuffer,
  ): Promise<ImageAnalysis> {
    const bytes = new Uint8Array(buffer);
    const isGif =
      bytes.length >= 6 &&
      (String.fromCharCode(...bytes.slice(0, 6)) === "GIF87a" ||
        String.fromCharCode(...bytes.slice(0, 6)) === "GIF89a");

    if (isGif) {
      const metadata = await GifAnalyzer.instance.analyzeGIF(buffer);

      const uniqueColorCount = Math.max(1, 2 ** metadata.colorDepth);
      const visiblePixels = Math.max(1, metadata.width * metadata.height);
      const colorDensityRatio = uniqueColorCount / visiblePixels;

      const dominantColors =
        this.extractDominantColorsFromGifMetadata(metadata);

      return {
        isPixelArt: metadata.isPixelArt,
        isAnimated: metadata.frames > 1,
        hasTransparency: metadata.hasTransparency,
        hasPartialTransparency:
          metadata.frameExtras.frameDelays.some((delay) => delay > 0) &&
          metadata.frameExtras.frameColors.some(
            (colorSet) => colorSet.size > 0,
          ),
        uniqueColorCount,
        colorDensityRatio,
        dominantColors,
        isFireLike: dominantColors.some(
          (c) =>
            c.frequency > 0.15 &&
            c.r > c.g * 1.5 &&
            c.r > c.b * 1.5 &&
            c.r > 200,
        ),
        isHighRes: metadata.frameExtras.individualFrameSizes.some(
          (s) => s.width * s.height > 512 * 512,
        ),
        hasVariableFrameSizes: metadata.frameExtras.individualFrameSizes.some(
          (s) => s.width !== metadata.width || s.height !== metadata.height,
        ),
      };
    }

    return {
      isPixelArt: false,
      isAnimated: false,
      hasTransparency: false,
      hasPartialTransparency: false,
      uniqueColorCount: 0,
      colorDensityRatio: 0,
      isHighRes: false,
      hasVariableFrameSizes: false,
    };
  }

  public async detectPixelArtInAllFrames(
    frames: ParsedFrame[],
  ): Promise<boolean> {
    return frames.some((frame) => this.detectPixelArt(frame));
  }

  public extractDominantColorsFromGifMetadata(metadata: GIFMetadata) {
    const colorFrequencyMap: Record<string, number> = {};
    metadata.frameExtras.frameColors.forEach((colorSet) => {
      colorSet.forEach((color) => {
        const key = color.toString();
        colorFrequencyMap[key] = (colorFrequencyMap[key] || 0) + 1;
      });
    });

    const totalColors = Object.values(colorFrequencyMap).reduce(
      (sum, freq) => sum + freq,
      0,
    );
    const dominantColors = Object.entries(colorFrequencyMap)
      .map(([key, frequency]) => {
        const [r, g, b] = key.split(",").map(Number);
        return { r, g, b, frequency: frequency / totalColors };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5); // Get top 5 dominant colors

    return dominantColors;
  }

  /**
   * ✅ Enhanced Pixel Art Detection using color density and edge transitions.
   */
  public detectPixelArt(frame: ParsedFrame): boolean {
    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const uniqueColors = new Set<string>();
    let transparentPixels = 0;

    for (let i = 0; i < frame.patch.length; i += 4) {
      const r = frame.patch[i];
      const g = frame.patch[i + 1];
      const b = frame.patch[i + 2];
      const a = frame.patch[i + 3];

      if (a === 0) {
        transparentPixels++;
        continue;
      }

      uniqueColors.add(`${r},${g},${b}`);
    }

    const visiblePixels = totalPixels - transparentPixels;
    const colorDensityRatio = uniqueColors.size / visiblePixels;

    const isSmallEnough = totalPixels <= 256 * 256;
    const hasLowColorDensity = colorDensityRatio <= 0.15;
    const usesLimitedPalette = uniqueColors.size <= 256;

    return isSmallEnough && (hasLowColorDensity || usesLimitedPalette);
  }

  public async analyzeGIF(buffer: ArrayBuffer): Promise<GIFMetadata> {
    const gif = parseGIF(buffer);
    const frames = decompressFrames(gif, true);

    // Check if it's high-res first
    const isHighRes = frames.some(
      (frame) => frame.dims.width * frame.dims.height > 512 * 512,
    );

    let isPixelArt = false;
    isPixelArt = frames.some((frame) => this.detectPixelArt(frame));

    let hasTransparency = false;
    let totalUniqueColors = new Set<string>();

    // Enhanced metadata analysis
    const frameMetrics = frames.map((frame) => {
      const metrics = PixelArtHandler.prototype.analyzePixelArtFrame(frame);
      hasTransparency = hasTransparency || metrics.hasTransparency;

      // Track color information
      for (let i = 0; i < frame.patch.length; i += 4) {
        if (frame.patch[i + 3] > 0) {
          // Only count non-transparent pixels
          totalUniqueColors.add(
            `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`,
          );
        }
      }

      return metrics;
    });

    // Enhanced frame analysis
    const frameExtras = {
      frameDelays: frames.map((f) => f.delay),
      individualFrameSizes: frames.map((f) => ({
        width: f.dims.width,
        height: f.dims.height,
      })),
      frameDisposal: frames.map((f) => f.disposalType || 0),
      transparentIndex: frames.map((f) => f.transparentIndex || -1),
      framePatch: frames.map((f) => new Set(Array.from(f.patch))),
      frameColors: frames.map((f) => {
        const colors = new Set<number>();
        for (let i = 0; i < f.patch.length; i += 4) {
          if (f.patch[i + 3] > 0) {
            // Only include non-transparent pixels
            colors.add(
              (f.patch[i] << 16) | (f.patch[i + 1] << 8) | f.patch[i + 2],
            );
          }
        }
        return colors;
      }),
      framePixels: frames.map((f) => f.pixels || []),
      transparencyThresholds: frameMetrics.map((m) =>
        m.needsDisposal ? 220 : 128,
      ),
      isHighRes,
      averageAlpha: frames.map((frame) => {
        let alphaSum = 0;
        let pixelCount = 0;
        for (let i = 3; i < frame.patch.length; i += 4) {
          if (frame.patch[i] > 0) {
            alphaSum += frame.patch[i];
            pixelCount++;
          }
        }
        return pixelCount > 0 ? alphaSum / pixelCount : 255;
      }),
    };

    // Extract GIF-specific metadata
    const gifExtras = {
      gifSignature: gif.header.signature,
      gifVersion: gif.header.version,
      backgroundColorIndex: gif.lsd.backgroundColorIndex,
      sort: Boolean(gif.lsd.gct.sort),
      globalColorTable: gif.gct || [],
      globalPalette: gif.lsd.gct.size,
      resolution: gif.lsd.gct.resolution,
      pixelAspectRatio: gif.lsd.pixelAspectRatio,
      globalPaletteDepth: gif.gct ? Math.ceil(Math.log2(gif.gct.length)) : 0,
    };

    // Return complete metadata object
    return {
      width: gif.lsd.width,
      height: gif.lsd.height,
      frames: frames.length,
      isPixelArt,
      hasTransparency,
      colorDepth: Math.ceil(Math.log2(totalUniqueColors.size)),
      frameExtras,
      gifExtras,
    };
  }

  //public analyzeFrameDimensions(frames: ParsedFrame[]): FrameSizeMetadata {
  public analyzeGIFFrameDimensions(frames: ParsedFrame[]): {
    maxWidth: number;
    maxHeight: number;
    hasVariableSize: boolean;
    scaleFactors: number[];
  } {
    const dimensions = frames.map((f) => ({
      width: f.dims.width,
      height: f.dims.height,
    }));

    const maxWidth = Math.max(...dimensions.map((d) => d.width));
    const maxHeight = Math.max(...dimensions.map((d) => d.height));

    // Check if frames have different sizes
    const hasVariableSize = dimensions.some(
      (d) => d.width !== maxWidth || d.height !== maxHeight,
    );

    // Calculate optimal scale factors for each frame
    const scaleFactors = dimensions.map((d) => {
      const widthScale = maxWidth / d.width;
      const heightScale = maxHeight / d.height;
      return Math.min(widthScale, heightScale);
    });

    return { maxWidth, maxHeight, hasVariableSize, scaleFactors };
  }
}

export const gifAnalyzer = GifAnalyzer.getInstance();
