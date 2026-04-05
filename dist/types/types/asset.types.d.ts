export type Environment = 'development' | 'staging' | 'production';
export type AssetType = 'images' | 'models' | 'animations' | 'textures';
export type AssetFormat = 'png' | 'jpg' | 'gif' | 'webp' | 'glb' | 'gltf';
export type AssetAccess = 'public' | 'private' | 'protected';
export type AssetStatus = 'pending' | 'loading' | 'loaded' | 'error' | 'cached';
export type AssetCategory = 'backgrounds' | 'overlays' | 'traits';
export type AssetCat = 'background' | 'overlay';
export type AssetCategories = 'All' | AssetCategory;
export type specialCategory = 'Frames';
export type OverlayCategory = 'Special Effects' | 'Borders' | 'Clothes' | 'Head' | 'Accessories';
export type BackgroundCategory = 'Animated' | 'Static' | 'Pixel Art' | 'Special';
export type OverlayCategories = 'All' | OverlayCategory;
export type BackgroundCategories = 'All' | BackgroundCategory;
export type AssetEnvironmentConfig = Record<Environment, {
    baseUrl: string;
    cdnUrl?: string;
    cacheDuration: number;
    compression: boolean;
}>;
export interface AssetPaths {
    [key: string]: {
        [subKey: string]: string;
    };
}
export interface AssetDimensions {
    width: number;
    height: number;
    aspectRatio?: number;
}
export interface AssetValidation {
    isValid: boolean;
    message: string;
    maxSize: number;
    allowedFormats: AssetFormat[];
    requiredDimensions?: AssetDimensions;
    allowCompression: boolean;
}
export interface AssetBase extends HTMLImageElement {
    name: string;
    url: string;
    format: AssetFormat;
    type: AssetCat;
    category: AssetCategory;
    fileName: string;
    path: string;
    dims?: AssetDimensions;
    size?: number;
}
export interface AssetMetadata {
    id: string;
    name: string;
    format: AssetFormat;
    type: AssetCat;
    category: AssetCategory;
    path: string;
    url: string;
    fileName: string;
    source?: 'registry' | 'api';
    cdnUrl?: string;
    version: string;
    etag: string;
    lastModified: number;
}
export interface AssetConfig extends AssetMetadata {
    access: AssetAccess;
    validation?: AssetValidation;
    status?: AssetStatus;
    tags?: string[];
    hash?: string;
    environment?: Environment;
    cacheDuration?: number;
    maxSize?: number;
    allowedFormats?: string[];
    compress?: boolean;
    allowedTokenIds?: number[];
    blendMode?: string;
    opacity?: number;
    disallowedTokenIds?: number[];
}
export interface BackgroundAssets {
    [key: string]: BackgroundAsset;
}
export interface BackgroundAsset extends AssetConfig {
    bgCategory: BackgroundCategory;
    allowedIds?: number[];
}
export interface SpecialAsset extends AssetConfig {
    specialCategory: string;
}
export interface OverlayAsset extends AssetConfig {
    overlayCategory: OverlayCategory;
    attribute: string;
    disAllowedTraits: {
        [key: string]: string[];
    };
    traits: {
        [key: string]: string[];
    };
}
export interface LoaderOptions {
    cache?: boolean;
    priority?: 'high' | 'medium' | 'low';
    timeout?: number;
    retries?: number;
    validation?: Partial<AssetValidation>;
    environment?: Environment;
}
export interface AssetError extends Error {
    code: string;
    context: {
        assetId: string;
        environment: Environment;
        attempt: number;
        timestamp: number;
    };
}
export interface APIResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        code: string;
        message: string;
        details?: any;
    };
}
export interface AssetAPIResponse extends APIResponse {
    data?: {
        asset: Buffer;
        metadata: AssetMetadata;
    };
}
export interface AssetLoadRequest {
    id: string;
    type: AssetType;
    category: string;
    options?: LoaderOptions;
}
//# sourceMappingURL=asset.types.d.ts.map