import { BackgroundAsset, OverlayAsset, SpecialAsset } from '../types/asset.types';
export declare function getTimestamp(date?: string | Date): number;
export declare function buildAssetPath(assetType: string, category: string, fileName: string): string;
export declare const SpecialRegistry: Record<string, SpecialAsset>;
export declare const BackgroundRegistry: Record<string, BackgroundAsset>;
export declare const OverlayRegistry: Record<string, OverlayAsset>;
//# sourceMappingURL=SourceRegistry.d.ts.map