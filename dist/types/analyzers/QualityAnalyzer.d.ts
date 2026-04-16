import { QualityManager } from "../managers/QualityManager";
import { QualityPresetKey } from "../types";
import { GifAnalyzer } from "./GifAnalyzer";
export declare class QualityAnalyzer {
    private static instance;
    private qualityManager;
    private gifAnalyzer;
    constructor(qualityManager: QualityManager, gifAnalyzer: GifAnalyzer);
    static getInstance(): QualityAnalyzer;
    destroyInstance(): void;
    analyzeGifQuality(gifUrl: string): Promise<{
        quality: QualityPresetKey;
        metadata: any;
    }>;
}
//# sourceMappingURL=QualityAnalyzer.d.ts.map