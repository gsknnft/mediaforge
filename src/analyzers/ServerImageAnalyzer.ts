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

export class ServerImageAnalyzer extends BaseImageAnalyzer {
  private static instance: ServerImageAnalyzer | null = null;

  private constructor() {
    super();
  }

  static getInstance(): ServerImageAnalyzer {
    if (!this.instance) {
      this.instance = new ServerImageAnalyzer();
    }
    return this.instance;
  }

  destroyInstance(): void {
    ServerImageAnalyzer.instance = null;
  }

  // ─── Runtime: sharp ───────────────────────────────────────────────────────

  protected async decodeImage(buffer: ArrayBuffer): Promise<SharpDecoded> {
    const nodeBuffer = Buffer.from(buffer);
    const { data, info } = await sharp(nodeBuffer)
      .ensureAlpha() // normalise to RGBA so alpha channel is always present
      .raw()
      .toBuffer({ resolveWithObject: true });

    return { data, info };
  }

  protected getPixelData(decoded: SharpDecoded): {
    width: number;
    height: number;
    data: Uint8ClampedArray;
  } {
    return {
      width: decoded.info.width,
      height: decoded.info.height,
      // sharp returns a Buffer; wrap without copy
      data: new Uint8ClampedArray(
        decoded.data.buffer,
        decoded.data.byteOffset,
        decoded.data.byteLength,
      ),
    };
  }
}
