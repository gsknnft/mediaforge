import { BackgroundAsset, OverlayAsset, BackgroundCategory, OverlayCategory } from '../types/asset.types';
export declare function getTimestamp(date?: string | Date): number;
export declare function buildAssetPath(assetType: string, category: string, fileName: string): string;
export declare class AssetRegistry {
    private static instance;
    private backgroundCache;
    private overlayCache;
    private environment;
    private fetchPromises;
    private initializedFromRegistry;
    private constructor();
    private initializeFromRegistry;
    getAssets(): Promise<{
        backgrounds: BackgroundAsset[];
        overlays: OverlayAsset[];
    }>;
    private getAssetId;
    private fetchUpdates;
    private fetchBackgrounds;
    private fetchOverlays;
    static getInstance(): AssetRegistry;
    getAllBackgrounds(): Promise<BackgroundAsset[]>;
    getAllOverlays(): Promise<OverlayAsset[]>;
    private fetchWithCache;
    fetchAssetMetadata(id: string): Promise<BackgroundAsset | OverlayAsset>;
    private fetchWithTimeout;
    getBackground(name: string): Promise<BackgroundAsset>;
    getOverlay(name: string): Promise<OverlayAsset>;
    getBackgroundsByCategory(category: BackgroundCategory): Promise<BackgroundAsset[]>;
    getOverlaysByCategory(category: OverlayCategory): Promise<OverlayAsset[]>;
    private isBackgroundAsset;
    private isOverlayAsset;
    clearCache(): void;
}
export declare const assetRegistry: AssetRegistry;
//# sourceMappingURL=AssetRegistry.d.ts.map