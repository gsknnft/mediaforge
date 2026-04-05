import { BackgroundAsset, OverlayAsset } from "../../assets/types/asset.types";
export declare class ProcessingService {
    private gifProcessor;
    private canvasPool;
    private CONSTANTS;
    private canvasRefs;
    constructor();
    processImage(tokenId: number, background: BackgroundAsset | null, overlays: OverlayAsset[], format: "png" | "gif"): Promise<Blob>;
    private calculateGifFitDimensions;
    private detectPixelArt;
    private processGIF;
    private loadImage;
    private processStatic;
    private downloadBlob;
    private downloadDataUrl;
}
//# sourceMappingURL=ProcessingService.d.ts.map