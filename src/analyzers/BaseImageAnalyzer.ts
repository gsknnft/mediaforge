import
    {
        IImageAnalyzer,
        ImageAnalysis,
        ScanForgeImageProfile,
    } from "@/types";

/**
 * Shared pixel analysis + ScanForge profiling logic.
 * Subclasses implement only decodeImage() and getPixelData() for their runtime.
 */
export abstract class BaseImageAnalyzer implements IImageAnalyzer {
  // ─── Abstract: runtime-specific decode ────────────────────────────────────

  protected abstract decodeImage(buffer: ArrayBuffer): Promise<unknown>;
  protected abstract getPixelData(decoded: unknown): {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  };

  // ─── Core Analysis ────────────────────────────────────────────────────────

  public async analyzeImage(buffer: ArrayBuffer): Promise<ImageAnalysis> {
    const decoded = await this.decodeImage(buffer);
    const { width, height, data } = this.getPixelData(decoded);

    const hasTransparency = this.detectTransparency(data);
    const hasPartialTransparency = this.detectPartialTransparency(data);
    const uniqueColorCount = this.countUniqueColors(data);
    const visiblePixels = this.countVisiblePixels(data);
    const colorDensityRatio =
      visiblePixels > 0 ? uniqueColorCount / visiblePixels : 0;
    const sharpEdgeRatio = this.computeSharpEdgeRatio(data, width, height);
    const dominantColors = this.extractDominantColors(data);
    const isHighRes = width * height > 512 * 512;
    const isPixelArt =
      width * height <= 256 * 256 &&
      uniqueColorCount <= 256 &&
      colorDensityRatio <= 0.12 &&
      sharpEdgeRatio > 0.35;

    return {
      isPixelArt,
      isAnimated: false,
      hasTransparency,
      hasPartialTransparency,
      uniqueColorCount,
      colorDensityRatio,
      sharpEdgeRatio,
      dominantColors,
      isFireLike: this.detectFireLike(dominantColors),
      isHighRes,
      hasVariableFrameSizes: false,
    };
  }

  // ─── ScanForge: Disk Cleanup Profile ──────────────────────────────────────

  /**
   * Classifies an image file in terms of its likely origin and cleanup priority.
   * Intended for use during ScanForge directory scans to flag images that are
   * safe to delete (generated/dep artifacts) vs. those that warrant preservation.
   */
  public async profileForScanForge(
    buffer: ArrayBuffer,
    filename: string,
  ): Promise<ScanForgeImageProfile> {
    const analysis = await this.analyzeImage(buffer);
    const bytes = buffer.byteLength;
    const style = this.determineStyle(analysis, filename);
    const origin = this.inferOrigin(analysis, filename, bytes);
    const deletionRisk = this.assessDeletionRisk(style, origin, analysis);

    return {
      filename,
      bytes,
      style,
      origin,
      deletionRisk,
      analysis,
      notes: this.buildNotes(style, origin, deletionRisk, analysis),
    };
  }

  // ─── Style / Origin / Risk ────────────────────────────────────────────────

  private determineStyle(
    analysis: ImageAnalysis,
    filename: string,
  ): ScanForgeImageProfile["style"] {
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";

    if (analysis.isPixelArt) return "pixel-art";

    if (
      analysis.uniqueColorCount <= 8 &&
      !analysis.hasPartialTransparency &&
      !analysis.isHighRes
    )
      return "flat-icon";

    if (
      !analysis.hasTransparency &&
      analysis.colorDensityRatio < 0.05 &&
      analysis.uniqueColorCount < 512
    )
      return "generated-export";

    if (
      analysis.uniqueColorCount > 8000 &&
      !analysis.hasTransparency &&
      ["jpg", "jpeg", "webp"].includes(ext)
    )
      return "photograph";

    if (analysis.hasPartialTransparency && analysis.sharpEdgeRatio > 0.2) {
      return "illustrated-asset";
    }

    return "unknown";
  }

  private inferOrigin(
    analysis: ImageAnalysis,
    filename: string,
    bytes: number,
  ): ScanForgeImageProfile["origin"] {
    const lower = filename.toLowerCase();

    if (bytes < 4096 && analysis.uniqueColorCount <= 16)
      return "dependency-asset";

    if (
      /\.(min|chunk|bundle|hash|contenthash)/.test(lower) ||
      /[-_]\w{8,}\.(png|jpg|webp)$/.test(lower)
    )
      return "build-artifact";

    if (/\b(placeholder|fixture|mock|test|spec|sample)\b/.test(lower)) {
      return "test-fixture";
    }

    if (analysis.hasPartialTransparency || analysis.isPixelArt)
      return "source-asset";

    return "unknown";
  }

  private assessDeletionRisk(
    style: ScanForgeImageProfile["style"],
    origin: ScanForgeImageProfile["origin"],
    analysis: ImageAnalysis,
  ): ScanForgeImageProfile["deletionRisk"] {
    if (origin === "build-artifact" || origin === "dependency-asset")
      return "low";
    if (origin === "test-fixture" && style !== "illustrated-asset")
      return "low";
    if (origin === "source-asset") return "high";
    if (analysis.hasPartialTransparency && analysis.sharpEdgeRatio > 0.3)
      return "high";
    if (style === "generated-export") return "medium";
    return "medium";
  }

  private buildNotes(
    style: ScanForgeImageProfile["style"],
    origin: ScanForgeImageProfile["origin"],
    risk: ScanForgeImageProfile["deletionRisk"],
    analysis: ImageAnalysis,
  ): string[] {
    const notes: string[] = [];
    if (risk === "high")
      notes.push("Likely hand-authored — verify before deleting");
    if (origin === "build-artifact")
      notes.push("Matches build output naming pattern");
    if (origin === "dependency-asset")
      notes.push("Tiny file consistent with npm-shipped asset");
    if (style === "pixel-art")
      notes.push("Pixel art detected — may be intentional game/UI asset");
    if (analysis.isFireLike)
      notes.push("Warm dominant palette — possibly a branded/themed asset");
    if (analysis.uniqueColorCount > 10000)
      notes.push(
        "High color complexity — likely photograph or gradient-heavy export",
      );
    return notes;
  }

  // ─── Pixel Primitives ─────────────────────────────────────────────────────

  private detectTransparency(data: Uint8ClampedArray): boolean {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] === 0) return true;
    }
    return false;
  }

  private detectPartialTransparency(data: Uint8ClampedArray): boolean {
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0 && data[i] < 255) return true;
    }
    return false;
  }

  private countVisiblePixels(data: Uint8ClampedArray): number {
    let count = 0;
    for (let i = 3; i < data.length; i += 4) {
      if (data[i] > 0) count++;
    }
    return count;
  }

  // Packs r/g/b into a single integer — faster than string-keyed Set
  private countUniqueColors(data: Uint8ClampedArray): number {
    const colors = new Set<number>();
    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      colors.add((data[i] << 16) | (data[i + 1] << 8) | data[i + 2]);
    }
    return colors.size;
  }

  private computeSharpEdgeRatio(
    data: Uint8ClampedArray,
    width: number,
    height: number,
  ): number {
    let total = 0;
    let sharp = 0;
    const threshold = 32;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = (y * width + x) * 4;
        if (data[idx + 3] === 0) continue;
        total++;

        const right = (y * width + (x + 1)) * 4;
        const down = ((y + 1) * width + x) * 4;

        const isSharp = (base: number, neighbor: number): boolean =>
          data[neighbor + 3] > 0 &&
          (Math.abs(data[base] - data[neighbor]) > threshold ||
            Math.abs(data[base + 1] - data[neighbor + 1]) > threshold ||
            Math.abs(data[base + 2] - data[neighbor + 2]) > threshold);

        if (isSharp(idx, right) || isSharp(idx, down)) sharp++;
      }
    }

    return total > 0 ? sharp / total : 0;
  }

  private extractDominantColors(
    data: Uint8ClampedArray,
  ): Array<{ r: number; g: number; b: number; frequency: number }> {
    const counts = new Map<string, number>();
    let total = 0;

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] === 0) continue;
      const key = `${Math.floor(data[i] / 16) * 16},${Math.floor(data[i + 1] / 16) * 16},${Math.floor(data[i + 2] / 16) * 16}`;
      counts.set(key, (counts.get(key) || 0) + 1);
      total++;
    }

    return Array.from(counts.entries())
      .map(([key, count]) => {
        const [r, g, b] = key.split(",").map(Number);
        return { r, g, b, frequency: total > 0 ? count / total : 0 };
      })
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  private detectFireLike(
    dominantColors: Array<{
      r: number;
      g: number;
      b: number;
      frequency: number;
    }>,
  ): boolean {
    return dominantColors.some(
      (c) =>
        c.frequency > 0.15 && c.r > c.g * 1.4 && c.r > c.b * 1.4 && c.r > 180,
    );
  }
}
