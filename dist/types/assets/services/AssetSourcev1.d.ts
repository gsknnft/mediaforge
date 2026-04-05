import { BackgroundAsset, OverlayAsset } from "../types/asset.types";
import { AssetConfig, AssetMetadata } from "../types/asset.types";
export declare const ASSETS: {
    backgrounds: Record<string, BackgroundAsset>;
    overlays: Record<string, OverlayAsset>;
};
export declare class AssetLoader {
    private cache;
    load(path: string, metadata: AssetMetadata): Promise<Buffer>;
}
interface AssetConfigs {
    [key: string]: Record<string, AssetConfig>;
}
export declare const ASSET_CONFIG: AssetConfigs;
export declare function getAssetConfig(req: any, res: any): Promise<void>;
export declare const runtime = "edge";
export default function handler(req: any, res: any): Promise<any>;
export declare const AssetsArrays: {
    backgrounds: BackgroundAsset[];
    overlays: OverlayAsset[];
};
export {};
//# sourceMappingURL=AssetSourcev1.d.ts.map