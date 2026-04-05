import { GifAnalyzer } from '../analyzers/GifAnalyzer';
import { QualityManager } from '../managers/QualityManager';
import { GIFMetadata } from '../types/gif.types';


export interface AnalysisDetails {
    frameCount: number;
    dimensions: {
      width: number;
      height: number;
    };
    fps: number;
    fileSize: number;
    isPixelArt: boolean;
    hasTransparency: boolean;
    colorDepth: number;
  }

export class QualityAnalyzerService {
  private static qaInstance: QualityAnalyzerService | null = null;
  private gifAnalyzer: GifAnalyzer;
  private qualityManager: QualityManager;

  constructor() {
    this.gifAnalyzer = GifAnalyzer.getInstance();
    this.qualityManager = new QualityManager();
  }

  public getInstance(): QualityAnalyzerService {
    if (!QualityAnalyzerService.qaInstance) {
      QualityAnalyzerService.qaInstance = new QualityAnalyzerService();
    }
    return QualityAnalyzerService.qaInstance;
  }

  public destroyInstance() {
    this.gifAnalyzer.destroyInstance();
    QualityAnalyzerService.qaInstance = null;
  }

  public async analyzeGif(url: string) {
    try {
      // Fetch GIF data
      const response = await fetch(url);
      const buffer = await response.arrayBuffer();

      // Analyze GIF metadata
      const metadata: GIFMetadata = await this.gifAnalyzer.analyzeGIF(buffer);
      
      // Get quality recommendation
      const recommendedQuality = this.qualityManager.selectOptimalQuality(metadata);

      return {
        recommendedQuality,
        frameCount: metadata.frames,
        width: metadata.width,
        height: metadata.height,
        fps: Math.round(1000 / Math.max(...metadata.frameExtras.frameDelays)),
        fileSize: buffer.byteLength,
        isPixelArt: metadata.isPixelArt,
        hasTransparency: metadata.hasTransparency,
        colorDepth: metadata.colorDepth
      };
    } catch (error) {
      console.error('Error analyzing GIF:', error);
      throw new Error('Failed to analyze GIF');
    }
  }

  public cleanup() {
    this.gifAnalyzer.destroyInstance();
  }
}

export const qualityAnalyzerService = new QualityAnalyzerService().getInstance();