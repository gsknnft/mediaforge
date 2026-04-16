import { IImageAnalyzer, ImageAnalysis, ScanForgeImageProfile } from "@/types";
/**
 * Shared pixel analysis + ScanForge profiling logic.
 * Subclasses implement only decodeImage() and getPixelData() for their runtime.
 */
export declare abstract class BaseImageAnalyzer implements IImageAnalyzer {
    protected abstract decodeImage(buffer: ArrayBuffer): Promise<unknown>;
    protected abstract getPixelData(decoded: unknown): {
        width: number;
        height: number;
        data: Uint8ClampedArray;
    };
    analyzeImage(buffer: ArrayBuffer): Promise<ImageAnalysis>;
    /**
     * Classifies an image file in terms of its likely origin and cleanup priority.
     * Intended for use during ScanForge directory scans to flag images that are
     * safe to delete (generated/dep artifacts) vs. those that warrant preservation.
     */
    profileForScanForge(buffer: ArrayBuffer, filename: string): Promise<ScanForgeImageProfile>;
    private determineStyle;
    private inferOrigin;
    private assessDeletionRisk;
    private buildNotes;
    private detectTransparency;
    private detectPartialTransparency;
    private countVisiblePixels;
    private countUniqueColors;
    private computeSharpEdgeRatio;
    private extractDominantColors;
    private detectFireLike;
}
//# sourceMappingURL=BaseImageAnalyzer.d.ts.map