import { GifImage } from './classes/GIFDecoder';
import { OverlayAsset } from './assets/types/asset.types';
import { GIFProcessor } from './GifProcessorv2';
declare class GIFExtension extends GifImage {
    readGif: (url: string) => Promise<GifImage>;
    readGifReturnBuffer: (url: string) => Promise<Uint8Array>;
    returnGifDetails: (url: string) => Promise<GifImage>;
    readGifFromBuffer: (buffer: Uint8Array) => GifImage;
    readGifFromBlob: (blob: Blob) => Promise<GifImage>;
    processGif: (gifUrl: string, processor: GIFProcessor) => Promise<Blob | ReadableStream<Uint8Array>>;
    processGifWithProcessor: (gifUrl: string, img: string, processor: GIFProcessor, overlays?: OverlayAsset[]) => Promise<Blob | ReadableStream<Uint8Array>>;
}
declare class Giffyness extends GIFProcessor {
    private gifExtension;
    private processor;
    constructor();
    processGiffy: (gifUrl: string) => Promise<Blob | ReadableStream<Uint8Array>>;
    processGiffyWithProcessor: (gifUrl: string, img: string, overlays?: OverlayAsset[]) => Promise<Blob | ReadableStream<Uint8Array>>;
}
export { GIFExtension, Giffyness };
//# sourceMappingURL=GifExtension.d.ts.map