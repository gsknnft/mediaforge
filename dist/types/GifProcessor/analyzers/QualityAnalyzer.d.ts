import { QualityManager } from "../managers/QualityManager";
import { GifAnalyzer } from "./GifAnalyzer";
import { QualityPresetKey } from "../types/gif.types";
export declare class QualityAnalyzer {
    private qualityManager;
    private gifAnalyzer;
    constructor(qualityManager: QualityManager, gifAnalyzer: GifAnalyzer);
    getInstance(): QualityAnalyzer;
    analyzeGifQuality(gifUrl: string): Promise<{
        quality: QualityPresetKey;
        metadata: any;
    }>;
}
//# sourceMappingURL=QualityAnalyzer.d.ts.map