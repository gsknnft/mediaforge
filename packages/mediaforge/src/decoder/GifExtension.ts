import { read } from "../decoder/utils";
import { GIFProcessor } from "../GifProcessor";
import { OverlayAsset } from "../types";
import { fetchWithRetry } from "../utils/RetryHandler";
import { decompressFrames, parseGIF } from "gifuct-js";
import { GifImage } from "./GifImage";

export class GifExtension extends GifImage {
  readGif = async (url: string): Promise<GifImage> => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return read(new Uint8Array(buffer));
  };

  readGifReturnBuffer = async (url: string): Promise<Uint8Array> => {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  };

  returnGifDetails = async (url: string): Promise<GifImage> => {
    const buffer = await this.readGifReturnBuffer(url);
    return read(buffer);
  };

  readGifFromBuffer = (buffer: Uint8Array): GifImage => {
    return read(buffer);
  };

  readGifFromBlob = async (blob: Blob): Promise<GifImage> => {
    const buffer = await blob.arrayBuffer();
    return read(new Uint8Array(buffer));
  };

  processGif = async (
    gifUrl: string,
    processor: GIFProcessor,
  ): Promise<Blob> => {
    const gifImage = async () => {
      return await this.readGifReturnBuffer(gifUrl);
    };

    const gifBuffer = await gifImage();
    const parsedGif = parseGIF(gifBuffer.buffer as ArrayBuffer);
    const frames = decompressFrames(parsedGif, true);
    return processor.generateGIF(frames, "", []);
  };

  processGifWithProcessor = async (
    gifUrl: string,
    img: string,
    processor: GIFProcessor,
    overlays?: OverlayAsset[],
  ): Promise<Blob> => {
    const fetchGif = async () => {
      const response = await fetchWithRetry(gifUrl);
      return await response.arrayBuffer();
    };
    const gifBuffer = await fetchGif();
    const parsedGif = parseGIF(gifBuffer);
    const frames = decompressFrames(parsedGif, true);
    return processor.generateGIF(frames, img, overlays);
  };
}
