import { GIFMetadata, QualityPresetKey } from "../types/gif.types";
import MemoryManager from "./MemoryManager";
export interface IQualityManager {
    applyImageQualitySettings(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey;
}
export declare class QualityManager implements IQualityManager {
    private static instance;
    private readonly memoryManager;
    private readonly qualityOptions;
    constructor(memoryManager: MemoryManager);
    static getInstance(memoryManager: MemoryManager): QualityManager;
    static destroyInstance(): void;
    applyImageQualitySettings(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
    selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey;
    private hasPixelArtCharacteristics;
    private analyzeDominantColors;
}
export default QualityManager;
//# sourceMappingURL=QualityManagerv2.d.ts.map