import { GIFMetadata, QualityPresetKey } from "../types/gif.types";
export interface IQualityManager {
    applyImageQualitySettings(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey;
}
export declare class QualityManager implements IQualityManager {
    private static instance;
    private readonly qualityOptions;
    constructor();
    static getInstance(): QualityManager;
    destroyInstance(): void;
    /**
     * ✅ Dynamically applies image quality settings based on detected GIF type.
     */
    applyImageQualitySettings(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    /**
     * ✅ Determines the best quality preset for the GIF using metadata analysis.
     */
    selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey;
    /**
     * 🔥 **Detects rapid red/orange shifts across frames (fire animation)**
     */
    private detectFireMotion;
    /**
     * 🎨 **Detects if the GIF has pixel art characteristics**
     */
    private detectPixelArt;
    /**
     * 🌈 **Analyzes dominant colors to detect fire-like effects**
     */
    private analyzeDominantColors;
    /**
     * 🔍 **Checks for sharp color transitions in frames (pixel art or high-res)**
     */
    private detectSharpEdges;
}
export declare const qualityManager: QualityManager;
export default QualityManager;
//# sourceMappingURL=QualityManager.d.ts.map