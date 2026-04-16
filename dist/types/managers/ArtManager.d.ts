import { AssetMetadata } from "../types/asset.types";
import { QualityPresetKey } from "../types";
export interface IArtManager {
    selectOptimalQuality(metadata: AssetMetadata): QualityPresetKey;
}
export declare class ArtManager implements IArtManager {
    private static instance;
    private readonly qualityOptions;
    constructor();
    extractCharacteristics(metadata: AssetMetadata): {
        name: string;
        format: import("../types/asset.types").AssetFormat;
        type: string;
        width: number;
        height: number;
        isMap: boolean;
        loading: "eager" | "lazy";
        naturalHeight: number;
        naturalWidth: number;
        sizes: string;
        useMap: string;
        x: number;
        y: number;
    };
    selectOptimalQuality(metadata: AssetMetadata): QualityPresetKey;
    static getInstance(): ArtManager;
    static destroyInstance(): void;
}
export default ArtManager;
//# sourceMappingURL=ArtManager.d.ts.map