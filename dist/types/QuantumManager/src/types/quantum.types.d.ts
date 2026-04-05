export type Environment = 'development' | 'staging' | 'production';
export type QType = 'images' | 'models' | 'animations' | 'textures';
export type QFormat = 'png' | 'jpg' | 'gif' | 'webp' | 'glb' | 'gltf';
export type QAccess = 'public' | 'private' | 'protected';
export type QStatus = 'pending' | 'loading' | 'loaded' | 'error' | 'cached';
export type QCategory = 'backgrounds' | 'overlays' | 'traits';
export type QCat = 'background' | 'overlay';
export type QCategories = 'All' | QCategory;
export type specialCategory = 'Frames';
export type OverlayCategory = 'Special Effects' | 'Borders' | 'Clothes' | 'Head' | 'Accessories';
export type BackgroundCategory = 'Animated' | 'Static' | 'Pixel Art' | 'Special';
export type OverlayCategories = 'All' | OverlayCategory;
export type BackgroundCategories = 'All' | BackgroundCategory;
export type QEnvironmentConfig = Record<Environment, {
    baseUrl: string;
    cdnUrl?: string;
    cacheDuration: number;
    compression: boolean;
}>;
export interface QPaths {
    [key: string]: {
        [subKey: string]: string;
    };
}
export interface QDimensions {
    width: number;
    height: number;
    aspectRatio?: number;
}
export interface QValidation {
    isValid: boolean;
    message: string;
    maxSize: number;
    allowedFormats: QFormat[];
    requiredDimensions?: QDimensions;
    allowCompression: boolean;
}
export interface QBase extends HTMLImageElement {
    name: string;
    url: string;
    format: QFormat;
    type: QCat;
    category: QCategory;
    fileName: string;
    path: string;
    dims?: QDimensions;
    size?: number;
}
export interface QMetadata {
    id: string;
    name: string;
    format: QFormat;
    type: QCat;
    category: QCategory;
    path: string;
    url: string;
    fileName: string;
    source?: 'registry' | 'api';
    cdnUrl?: string;
    version: string;
    etag: string;
    lastModified: number;
}
export interface QConfig extends QMetadata {
    access: QAccess;
    validation?: QValidation;
    status?: QStatus;
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
export interface QBackgrounds {
    [key: string]: QBackground;
}
export interface QBackground extends QConfig {
    bgCategory: BackgroundCategory;
    allowedIds?: number[];
}
export interface QSpecial extends QConfig {
    specialCategory: string;
}
export interface QOverlay extends QConfig {
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
    validation?: Partial<QValidation>;
    environment?: Environment;
}
export interface QError extends Error {
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
export interface QAPIResponse extends APIResponse {
    data?: {
        asset: Buffer;
        metadata: QMetadata;
    };
}
export interface QLoadRequest {
    id: string;
    type: QType;
    category: string;
    options?: LoaderOptions;
}
//# sourceMappingURL=quantum.types.d.ts.map