import { AssetMetadata } from '@/types/asset.types';
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
export declare const runtime = "edge";
export default function handler(req: ApiRequestLike, res: ApiResponseLike): Promise<unknown>;
export {};
//# sourceMappingURL=assetConfig.d.ts.map