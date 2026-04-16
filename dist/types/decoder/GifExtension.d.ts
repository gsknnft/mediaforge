import { GIFProcessor } from "../GifProcessor";
import { OverlayAsset } from "../types";
import { GifImage } from "./GifImage";
export declare class GifExtension extends GifImage {
    readGif: (url: string) => Promise<GifImage>;
    readGifReturnBuffer: (url: string) => Promise<Uint8Array>;
    returnGifDetails: (url: string) => Promise<GifImage>;
    readGifFromBuffer: (buffer: Uint8Array) => GifImage;
    readGifFromBlob: (blob: Blob) => Promise<GifImage>;
    processGif: (gifUrl: string, processor: GIFProcessor) => Promise<Blob>;
    processGifWithProcessor: (gifUrl: string, img: string, processor: GIFProcessor, overlays?: OverlayAsset[]) => Promise<Blob>;
}
//# sourceMappingURL=GifExtension.d.ts.map