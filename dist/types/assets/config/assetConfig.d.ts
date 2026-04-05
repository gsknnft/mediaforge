import { AssetConfig, AssetMetadata } from '../types/asset.types';
type ApiRequestLike = {
    query: Record<string, string | string[] | undefined>;
};
type ApiResponseLike = {
    status: (code: number) => ApiResponseLike;
    json: (payload: unknown) => unknown;
    send: (payload: unknown) => unknown;
    setHeader: (name: string, value: string) => void;
};
export declare class AssetLoader {
    private cache;
    load(path: string, metadata: AssetMetadata): Promise<Buffer>;
}
interface AssetConfigs {
    [key: string]: Record<string, AssetConfig>;
}
export declare const ASSET_CONFIG: AssetConfigs;
export declare function getAssetConfig(req: ApiRequestLike, res: ApiResponseLike): Promise<void>;
export declare const runtime = "edge";
export default function handler(req: ApiRequestLike, res: ApiResponseLike): Promise<unknown>;
export {};
//# sourceMappingURL=assetConfig.d.ts.map