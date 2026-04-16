import sharp from "sharp";
import { BaseImageAnalyzer } from "./BaseImageAnalyzer";
/**
 * Image analyzer for server-side use (e.g. Express, Fastify, standalone scripts).
 * Uses `sharp` for decoding — no browser APIs required.
 *
 * Requires: npm install sharp
 */
interface SharpDecoded {
    data: Buffer;
    info: sharp.OutputInfo;
}
export declare class ServerImageAnalyzer extends BaseImageAnalyzer {
    private static instance;
    private constructor();
    static getInstance(): ServerImageAnalyzer;
    destroyInstance(): void;
    protected decodeImage(buffer: ArrayBuffer): Promise<SharpDecoded>;
    protected getPixelData(decoded: SharpDecoded): {
        width: number;
        height: number;
        data: Uint8ClampedArray;
    };
}
export {};
//# sourceMappingURL=ServerImageAnalyzer.d.ts.map