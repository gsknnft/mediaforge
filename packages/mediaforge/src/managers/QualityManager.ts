import { GIFMetadata, QualityPresetKey } from "@/types";

export interface IQualityManager {
  applyImageQualitySettings(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ): void;
  selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey;
}

export class QualityManager implements IQualityManager {
  private static instance: QualityManager | null = null;
  private readonly qualityOptions: {
    forceQuality?: QualityPresetKey;
    allowAutoDetect: boolean;
  };

  constructor() {
    this.qualityOptions = {
      allowAutoDetect: true,
    };
  }

  static getInstance(): QualityManager {
    if (!this.instance) {
      this.instance = new QualityManager();
    }

    return this.instance;
  }

  public destroyInstance() {
    QualityManager.instance = null;
  }

  /**
   * ✅ Dynamically applies image quality settings based on detected GIF type.
   */
  public applyImageQualitySettings(
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  ): void {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
  }

  public selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey {
    if (this.qualityOptions.forceQuality) {
      return this.qualityOptions.forceQuality;
    }

    if (!this.qualityOptions.allowAutoDetect) {
      return "HIGH";
    }

    // Check for pixel art first
    if (metadata.isPixelArt) return "PIXEL";

    // Enhanced high-res detection
    const totalPixels = metadata.width * metadata.height;
    const avgFrameSize =
      metadata.frameExtras.individualFrameSizes.reduce(
        (sum, size) => sum + size.width * size.height,
        0,
      ) / metadata.frames;

    const isHighRes = totalPixels > 512 * 512 || avgFrameSize > 256 * 256;
    const hasHighColorDepth = metadata.colorDepth > 128;
    const hasComplexFrames = metadata.frameExtras.frameColors.some(
      (colors) => colors.size > 128,
    );

    // Detect dominant colors
    const dominantColorAnalysis = this.analyzeDominantColors(metadata);
    const hasFireCharacteristics = dominantColorAnalysis.isFireEffect;

    if (hasFireCharacteristics && metadata.frames > 1) {
      return "FIRE";
    }

    if (isHighRes) {
      if (hasHighColorDepth || hasComplexFrames) {
        return metadata.hasTransparency ? "HIGHRES" : "HIGH";
      }
      return "HIGH";
    }

    if (metadata.width * metadata.height > 1024 * 1024) {
      return metadata.hasTransparency ? "HIGHRES" : "HIGH";
    }

    // Default quality levels
    if (metadata.colorDepth < 64) return "LOW";
    if (metadata.colorDepth < 128) return "MEDIUM";

    return "HIGH";
  }

  /**
   * ✅ Determines the best quality preset for the GIF using metadata analysis.
   */
  public selectQuality(metadata: GIFMetadata): QualityPresetKey {
    if (this.qualityOptions.forceQuality) {
      return this.qualityOptions.forceQuality;
    }

    // 🔹 Extract key characteristics
    const dimensions = metadata.width * metadata.height;
    // const avgFrameSize =
    //   metadata.frameExtras.individualFrameSizes.reduce(
    //     (sum, size) => sum + size.width * size.height,
    //     0,
    //   ) / metadata.frames;

    const characteristics = {
      isHighRes: dimensions > 512 * 512,
      isVeryHighRes: dimensions > 1024 * 1024,
      hasHighColorDepth: metadata.colorDepth > 128,
      hasLimitedPalette: metadata.colorDepth < 128,
      hasSharpEdges: this.detectSharpEdges(metadata),
      hasTransparency: metadata.hasTransparency,
    };

    // 🔥 Detect fire-like motion patterns
    const dominantColors = this.analyzeDominantColors(metadata);
    const hasFireMotion = this.detectFireMotion(metadata);
    if (dominantColors.isFireEffect && hasFireMotion) {
      return "FIRE";
    }

    // 🎨 **Pixel Art Handling**
    if (metadata.isPixelArt) {
      return characteristics.isHighRes ? "HIGHRESPIXEL" : "PIXEL";
    }

    // 🖼️ **High-Resolution GIFs**
    if (characteristics.isHighRes || characteristics.isVeryHighRes) {
      if (characteristics.hasSharpEdges && characteristics.hasLimitedPalette) {
        return "HIGHRESPIXEL";
      }
      return "HIGHRES";
    }

    // 🌈 **Color-Rich & Large GIFs**
    if (characteristics.hasHighColorDepth || metadata.frames > 30) {
      return "HIGH";
    }

    return "HIGH"; // Changed default from LOW to HIGH
  }

  public hasPixelArtCharacteristics(metadata: GIFMetadata): boolean {
    // Check for sharp edges and limited color palette despite high resolution
    const hasLimitedPalette = metadata.colorDepth < 128;
    const hasSharpEdges = metadata.frameExtras.frameColors.every(
      (colors) => colors.size < metadata.width * metadata.height * 0.1,
    );

    return hasLimitedPalette && hasSharpEdges;
  }

  /**
   * 🔥 **Detects rapid red/orange shifts across frames (fire animation)**
   */
  private detectFireMotion(metadata: GIFMetadata): boolean {
    let fireCharacteristics = 0;
    const frames = metadata.frameExtras.frameColors;

    for (let i = 0; i < frames.length - 1; i++) {
      const currentFrame = Array.from(frames[i]);
      const nextFrame = Array.from(frames[i + 1]);

      const redChanges = currentFrame.filter((color, index) => {
        const currentRed = (color >> 16) & 0xff;
        const nextRed = (nextFrame[index] >> 16) & 0xff;
        return Math.abs(currentRed - nextRed) > 20;
      }).length;

      if (redChanges > currentFrame.length * 0.2) {
        fireCharacteristics++;
      }
    }

    return fireCharacteristics > frames.length * 0.5;
  }

  /**
   * 🎨 **Detects if the GIF has pixel art characteristics**
   */
  public detectPixelArt(metadata: GIFMetadata): boolean {
    return metadata.colorDepth < 128 && this.detectSharpEdges(metadata);
  }

  public async detectArtType(
    metadata: GIFMetadata,
  ): Promise<"PIXEL_ART" | "HIGH_RES" | "STANDARD"> {
    if (metadata.isPixelArt) {
      return "PIXEL_ART";
    }
    if (metadata.width * metadata.height > 512 * 512) {
      return "HIGH_RES";
    }
    return "STANDARD";
  }

  /**
   * 🌈 **Analyzes dominant colors to detect fire-like effects**
   */
  private analyzeDominantColors(metadata: GIFMetadata): {
    isFireEffect: boolean;
    dominantColors: Array<{
      r: number;
      g: number;
      b: number;
      frequency: number;
    }>;
  } {
    const colorCounts = new Map<string, number>();
    let totalPixels = 0;

    metadata.frameExtras.frameColors.forEach((colors) => {
      colors.forEach((color) => {
        const r = (color >> 16) & 0xff;
        const g = (color >> 8) & 0xff;
        const b = color & 0xff;
        const key = `${r},${g},${b}`;
        colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
        totalPixels++;
      });
    });

    const dominantColors = Array.from(colorCounts.entries())
      .map(([key, count]) => {
        const [r, g, b] = key.split(",").map(Number);
        return { r, g, b, frequency: count / totalPixels };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);

    const isFireEffect = dominantColors.some(
      (color) =>
        color.frequency > 0.15 &&
        color.r > color.g * 1.5 &&
        color.r > color.b * 1.5 &&
        color.r > 200,
    );

    return { isFireEffect, dominantColors };
  }

  /**
   * 🔍 **Checks for sharp color transitions in frames (pixel art or high-res)**
   */
  private detectSharpEdges(metadata: GIFMetadata): boolean {
    return metadata.frameExtras.frameColors.some((colors) => {
      const colorArray = Array.from(colors);
      let sharpTransitions = 0;

      for (let i = 0; i < colorArray.length - 1; i++) {
        const color1 = colorArray[i];
        const color2 = colorArray[i + 1];

        const r1 = (color1 >> 16) & 0xff;
        const g1 = (color1 >> 8) & 0xff;
        const b1 = color1 & 0xff;

        const r2 = (color2 >> 16) & 0xff;
        const g2 = (color2 >> 8) & 0xff;
        const b2 = color2 & 0xff;

        if (
          Math.abs(r1 - r2) > 32 ||
          Math.abs(g1 - g2) > 32 ||
          Math.abs(b1 - b2) > 32
        ) {
          sharpTransitions++;
        }
      }

      return sharpTransitions > colorArray.length * 0.3;
    });
  }
}

export const qualityManager = QualityManager.getInstance();
export default QualityManager;
