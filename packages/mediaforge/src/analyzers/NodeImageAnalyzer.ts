import { createCanvas, loadImage } from "canvas";
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

export class NodeImageAnalyzer extends BaseImageAnalyzer {
  private static instance: NodeImageAnalyzer | null = null;

  private constructor() {
    super();
  }

  static getInstance(): NodeImageAnalyzer {
    if (!this.instance) {
      this.instance = new NodeImageAnalyzer();
    }
    return this.instance;
  }

  destroyInstance(): void {
    NodeImageAnalyzer.instance = null;
  }

  // ─── Runtime: node-canvas ─────────────────────────────────────────────────

  protected async decodeImage(buffer: ArrayBuffer): Promise<CanvasDecoded> {
    // loadImage accepts a Buffer directly
    const nodeBuffer = Buffer.from(buffer);
    const image = await loadImage(nodeBuffer);

    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const imageData = ctx.getImageData(0, 0, image.width, image.height);

    return {
      width: image.width,
      height: image.height,
      data: imageData.data,
    };
  }

  protected getPixelData(decoded: CanvasDecoded): {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  } {
    // Already extracted in decodeImage — pass through
    return decoded;
  }
}
