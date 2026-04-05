import { AssetRegistry } from '../services/AssetRegistry';
import { AssetLoader } from '../services/AssetLoader';
import { OverlayAsset, BackgroundAsset, AssetCat, AssetCategories } from '../../../assets/types/asset.types';
interface UseAssetSystemProps {
    category: AssetCategories;
    tag?: string;
    type: AssetCat | AssetCategories;
    assetName?: string;
}
interface AssetSystemOutput {
    assets: {
        backgrounds: BackgroundAsset[];
        overlays: OverlayAsset[];
    };
    currentAsset: Buffer<ArrayBufferLike> | null;
    loading: boolean;
    error: Error | null;
    registry: AssetRegistry;
    loader: AssetLoader;
}
export declare const useAssetSystem: ({ category, tag, type, assetName }: UseAssetSystemProps) => AssetSystemOutput;
export {};
//# sourceMappingURL=useAssetSystem.d.ts.map