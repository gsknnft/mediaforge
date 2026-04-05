import { Environment, QValidation, QType } from '../types/quantum.types';
export declare const ENVIRONMENT: Environment;
export declare const API_CONFIG: {
    baseUrl: string;
    endpoints: {
        backgrounds: string;
        overlays: string;
        metadata: string;
        validate: string;
        categories: string;
        fields: string;
        quantum: string;
        signal: string;
        aiStyle: string;
    };
    headers: {
        'Content-Type': string;
        'X-Q-Version': string;
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
export declare const BASE_Q_PATH: string;
export declare const Q_PATHS: {
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
export declare const Q_VALIDATION: Record<QType, QValidation>;
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
    readonly getQ: (id: string) => string;
    readonly getMetadata: (id: string) => string;
    readonly validateQ: (id: string) => string;
    readonly getFields: (id: string) => string;
    readonly getState: (id: string) => string;
    readonly qAnalyze: (id: string) => string;
    readonly getBackgrounds: (category?: string) => string;
    readonly getOverlays: (category?: string) => string;
};
export declare const SUPPORTED_FORMATS: {
    images: string[];
    models: string[];
    animations: string[];
    textures: string[];
    data: string[];
};
//# sourceMappingURL=asset.config.d.ts.map