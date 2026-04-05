import { QConfig, QMetadata } from '../types/quantum.types';
export declare class QLoader {
    private cache;
    load(path: string, metadata: QMetadata): Promise<Buffer>;
}
interface QConfigs {
    [key: string]: Record<string, QConfig>;
}
export declare const Q_CONFIG: QConfigs;
export declare function getQConfig(req: any, res: any): Promise<void>;
export declare const runtime = "edge";
export default function handler(req: any, res: any): Promise<any>;
export {};
//# sourceMappingURL=assetConfig.d.ts.map