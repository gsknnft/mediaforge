import { read, GifImage } from './classes/GIFDecoder';
import { parseGIF, decompressFrames } from 'gifuct-js';
import { OverlayAsset } from './assets/types/asset.types';
import { RetryHandler, fetchWithRetry } from './utils/RetryHandler';
import {GIFProcessor} from './GifProcessorv2';

class GIFExtension extends GifImage {
      
    readGif = async (url: string): Promise<GifImage> => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return read(new Uint8Array(buffer));
    }

    readGifReturnBuffer = async (url: string): Promise<Uint8Array> => {
        const response = await fetch(url);
        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
    }

    returnGifDetails = async (url: string): Promise<GifImage> => {
        const buffer = await this.readGifReturnBuffer(url);
        return read(buffer);
    }

    readGifFromBuffer = (buffer: Uint8Array): GifImage => {
        return read(buffer);
    }

    readGifFromBlob = async (blob: Blob): Promise<GifImage> => {
        const buffer = await blob.arrayBuffer();
        return read(new Uint8Array(buffer));
    }

    processGif = async (gifUrl: string, processor: GIFProcessor): Promise<Blob | ReadableStream<Uint8Array>> => {
        const gifImage = async () => {
            return await this.readGifReturnBuffer(gifUrl);
        }

        const gifBuffer = await gifImage();
        const parsedGif = parseGIF(gifBuffer.buffer as ArrayBuffer);
        const frames = decompressFrames(parsedGif, true);
        return processor.generateGIF(frames, '', []);
    }

    processGifWithProcessor = async (gifUrl: string, img: string, processor: GIFProcessor, overlays?: OverlayAsset[]): Promise<Blob | ReadableStream<Uint8Array>> => {
        const fetchGif = async () => {
            const response = await fetchWithRetry(gifUrl);
            return await response.arrayBuffer();
        }
        const gifBuffer = await fetchGif();
        const parsedGif = parseGIF(gifBuffer);
        const frames = decompressFrames(parsedGif, true);
        return processor.generateGIF(frames, img, overlays);
    }
}


class Giffyness extends GIFProcessor {
    private gifExtension: GIFExtension;
    private processor: GIFProcessor;

    constructor() {
        super();
        this.gifExtension = new GIFExtension();
        this.processor = new GIFProcessor();
    }

    processGiffy = async (gifUrl: string): Promise<Blob | ReadableStream<Uint8Array>> => {
        return await this.gifExtension.processGif(gifUrl, this.processor);
    }

    processGiffyWithProcessor = async (gifUrl: string, img: string, overlays?: OverlayAsset[]): Promise<Blob | ReadableStream<Uint8Array>> => {
        return await this.gifExtension.processGifWithProcessor(gifUrl, img, this.processor, overlays);
    }


}

export { GIFExtension, Giffyness };