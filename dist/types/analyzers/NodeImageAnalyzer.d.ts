import { BaseImageAnalyzer } from "./BaseImageAnalyzer";
/**
 * Image analyzer for Node.js environments without sharp available —
 * CLI tools, worker threads, test runners, or anywhere you want
 * a pure-JS decode path without native binaries beyond node-canvas.
 *
 * Requires: npm install canvas
 *
 * Note: node-canvas has native deps (libcairo, libpango, etc.).
 * If you have sharp available, prefer ServerImageAnalyzer — it's faster
 * and handles more formats (AVIF, HEIF, etc.).
 */
interface CanvasDecoded {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}
export declare class NodeImageAnalyzer extends BaseImageAnalyzer {
    private static instance;
    private constructor();
    static getInstance(): NodeImageAnalyzer;
    destroyInstance(): void;
    protected decodeImage(buffer: ArrayBuffer): Promise<CanvasDecoded>;
    protected getPixelData(decoded: CanvasDecoded): {
        width: number;
        height: number;
        data: Uint8ClampedArray;
    };
}
export {};
//# sourceMappingURL=NodeImageAnalyzer.d.ts.map