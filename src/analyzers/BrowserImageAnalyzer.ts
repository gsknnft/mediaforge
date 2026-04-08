import { BaseImageAnalyzer } from "./BaseImageAnalyzer";

/**
 * Image analyzer for browser environments (Chrome extension, web worker, etc.).
 * Uses createImageBitmap + OffscreenCanvas for decoding — no Node.js APIs.
 */
export class BrowserImageAnalyzer extends BaseImageAnalyzer {
  private static instance: BrowserImageAnalyzer | null = null;

  private constructor() {
    super();
  }

  static getInstance(): BrowserImageAnalyzer {
    if (!this.instance) {
      this.instance = new BrowserImageAnalyzer();
    }
    return this.instance;
  }

  destroyInstance(): void {
    BrowserImageAnalyzer.instance = null;
  }

  // ─── Runtime: browser canvas ──────────────────────────────────────────────

  protected async decodeImage(buffer: ArrayBuffer): Promise<ImageBitmap> {
    return createImageBitmap(new Blob([buffer]));
  }

  protected getPixelData(bitmap: ImageBitmap): {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  } {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("Failed to get 2D context");
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, bitmap.width, bitmap.height);
    return { width: bitmap.width, height: bitmap.height, data: imageData.data };
  }
}
