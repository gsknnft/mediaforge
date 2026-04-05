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
export declare class QualityAnalyzerService {
    private static qaInstance;
    private gifAnalyzer;
    private qualityManager;
    constructor();
    getInstance(): QualityAnalyzerService;
    destroyInstance(): void;
    analyzeGif(url: string): Promise<{
        recommendedQuality: import("../types/gif.types").QualityPresetKey;
        frameCount: number;
        width: number;
        height: number;
        fps: number;
        fileSize: number;
        isPixelArt: boolean;
        hasTransparency: boolean;
        colorDepth: number;
    }>;
    cleanup(): void;
}
export declare const qualityAnalyzerService: QualityAnalyzerService;
//# sourceMappingURL=QualityAnalyzerService.d.ts.map