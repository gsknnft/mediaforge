import { GifFrameDataType } from './GIFDecoder';
interface UseGifDecoderResult {
    width: number;
    height: number;
    background: number;
    frameCount: number;
    frames: GifFrameDataType[];
    delays: number[];
}
declare function useGifDecoder(input: string | Uint8Array | Blob): Promise<UseGifDecoderResult>;
declare function processGif(gifUrl: string, onFrame?: (frameData: GifFrameDataType) => void): Promise<GifFrameDataType[]>;
export { useGifDecoder, processGif, type UseGifDecoderResult, type GifFrameDataType };
//# sourceMappingURL=useGifDecoder.d.ts.map