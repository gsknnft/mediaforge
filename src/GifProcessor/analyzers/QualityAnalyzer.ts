import { QualityManager } from "../managers/QualityManager";
import { GifAnalyzer } from "./GifAnalyzer";
import { QualityPresetKey } from "../types/gif.types";

export class QualityAnalyzer {
    private qualityManager: QualityManager;
    private gifAnalyzer: GifAnalyzer;

    constructor(qualityManager: QualityManager, gifAnalyzer: GifAnalyzer) {
        this.qualityManager = qualityManager;
        this.gifAnalyzer = gifAnalyzer;
    }

    public getInstance(): QualityAnalyzer {
        return new QualityAnalyzer(new QualityManager(), GifAnalyzer.getInstance());
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
                metadata
            };
        } catch (error) {
            console.error("Error analyzing GIF quality:", error);
            throw error;
        }
    }
}

