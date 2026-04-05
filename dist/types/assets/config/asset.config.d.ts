import { Environment, AssetValidation, AssetType } from '../types/asset.types';
export declare const ENVIRONMENT: Environment;
export declare const API_CONFIG: {
    baseUrl: string;
    endpoints: {
        backgrounds: string;
        overlays: string;
        metadata: string;
        validate: string;
        categories: string;
    };
    headers: {
        'Content-Type': string;
        'X-Asset-Version': string;
    };
};
export declare const ASSET_ENV_CONFIG: {
    development: {
        apiUrl: string;
        assetUrl: string;
        cacheDuration: number;
    };
    staging: {
        apiUrl: string;
        assetUrl: string;
        cacheDuration: number;
    };
    production: {
        apiUrl: string;
        assetUrl: string;
        cacheDuration: number;
    };
};
export declare const BASE_ASSET_PATH: string;
export declare const ASSET_PATHS: {
    backgrounds: {
        animated: string;
        static: string;
        pixel: string;
    };
    special: string;
    overlays: {
        head: string;
        clothes: string;
        special: string;
        frames: string;
        traits: string;
        accessories: string;
    };
};
export declare const CACHE_CONFIG: {
    defaultDuration: number;
    overlayDuration: number;
    gifDuration: number;
    imageDuration: number;
};
export declare const ASSET_VALIDATION: Record<AssetType, AssetValidation>;
export declare const LOADER_CONFIG: {
    defaultTimeout: number;
    maxRetries: number;
    retryDelay: number;
    defaultPriority: "medium";
    chunkSize: number;
    maxConcurrentLoads: number;
    cacheDuration: number;
};
export declare const API_ENDPOINTS: {
    readonly getAsset: (id: string) => string;
    readonly getMetadata: (id: string) => string;
    readonly validateAsset: (id: string) => string;
    readonly getBackgrounds: (category?: string) => string;
    readonly getOverlays: (category?: string) => string;
};
export declare const SUPPORTED_FORMATS: {
    images: string[];
    models: string[];
    animations: string[];
    textures: string[];
};
//# sourceMappingURL=asset.config.d.ts.map