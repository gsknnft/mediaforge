import { AssetMetadata, LoaderOptions, Environment, AssetError } from '../types/asset.types';
export declare class AssetLoader {
    static cache: Map<string, {
        data: Buffer;
        metadata: AssetMetadata;
    }>;
    static environment: Environment;
    static loadingQueue: Set<string>;
    constructor(environment?: Environment);
    static createAssetError(message: string, assetId: string, code: string): AssetError;
    static load(assetPath: string, metadata: AssetMetadata, options?: LoaderOptions): Promise<Buffer>;
    static fetchWithRetry(url: string, metadata: AssetMetadata, options: LoaderOptions): Promise<Response>;
    static getCachedAsset(key: string, metadata: AssetMetadata): Buffer | null;
    static clearCache(): void;
}
export declare const assetLoader: AssetLoader;
//# sourceMappingURL=AssetLoader.d.ts.map