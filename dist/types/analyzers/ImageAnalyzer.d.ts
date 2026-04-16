import { IImageAnalyzer, ImageAnalysis, ScanForgeImageProfile } from "../types";
export declare class ImageAnalyzer implements IImageAnalyzer {
    private static instance;
    private constructor();
    static getInstance(): ImageAnalyzer;
    destroyInstance(): void;
    analyzeImage(buffer: ArrayBuffer): Promise<ImageAnalysis>;
    /**
     * Classifies an image file in terms of its likely origin and cleanup priority.
     * Intended for use during ScanForge directory scans to flag images that are
     * safe to delete (generated/dep artifacts) vs. those that warrant preservation.
     */
    profileForScanForge(buffer: ArrayBuffer, filename: string): Promise<ScanForgeImageProfile>;
    /**
     * Style classification: what kind of image is this visually?
     */
    private determineStyle;
    /**
     * Origin inference: where did this image likely come from?
     */
    private inferOrigin;
    /**
     * Deletion risk: how safe is it to remove this during cleanup?
     */
    private assessDeletionRisk;
    private buildNotes;
    private decodeImage;
    private getPixelData;
    private detectTransparency;
    private detectPartialTransparency;
    private countVisiblePixels;
    private countUniqueColors;
    private computeSharpEdgeRatio;
    private extractDominantColors;
    private detectFireLike;
}
//# sourceMappingURL=ImageAnalyzer.d.ts.map