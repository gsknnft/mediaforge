import { QualityManager } from "../managers/QualityManager";
import { QualityPresetKey } from "../types";
import { GifAnalyzer } from "./GifAnalyzer";

export class QualityAnalyzer {
  private static instance: QualityAnalyzer | null = null;
  private qualityManager: QualityManager;
  private gifAnalyzer: GifAnalyzer;

  constructor(qualityManager: QualityManager, gifAnalyzer: GifAnalyzer) {
    this.qualityManager = qualityManager;
    this.gifAnalyzer = gifAnalyzer;
  }

  static getInstance(): QualityAnalyzer {
    if (!this.instance) {
      this.instance = new QualityAnalyzer(
        new QualityManager(),
        GifAnalyzer.getInstance(),
      );
    }

    return this.instance;
  }

  public destroyInstance() {
    QualityAnalyzer.instance = null;
  }

  public async analyzeGifQuality(gifUrl: string): Promise<{
    quality: QualityPresetKey;
    metadata: any;
  }> {
    try {
      const response = await fetch(gifUrl);
      const buffer = await response.arrayBuffer();
      const metadata = await this.gifAnalyzer.analyzeGIF(buffer);
      const quality = this.qualityManager.selectOptimalQuality(metadata);

      return {
        quality,
        metadata,
      };
    } catch (error) {
      console.error("Error analyzing GIF quality:", error);
      throw error;
    }
  }
}
