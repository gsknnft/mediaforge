import { BaseImageAnalyzer } from "./BaseImageAnalyzer";
/**
 * Image analyzer for browser environments (Chrome extension, web worker, etc.).
 * Uses createImageBitmap + OffscreenCanvas for decoding — no Node.js APIs.
 */
export declare class BrowserImageAnalyzer extends BaseImageAnalyzer {
    private static instance;
    private constructor();
    static getInstance(): BrowserImageAnalyzer;
    destroyInstance(): void;
    protected decodeImage(buffer: ArrayBuffer): Promise<ImageBitmap>;
    protected getPixelData(bitmap: ImageBitmap): {
        width: number;
        height: number;
        data: Uint8ClampedArray;
    };
}
//# sourceMappingURL=BrowserImageAnalyzer.d.ts.map