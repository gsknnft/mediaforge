import { GifFrameDataType } from "../decoder/GifImage";
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
export { processGif, useGifDecoder, type GifFrameDataType, type UseGifDecoderResult, };
//# sourceMappingURL=useGifDecoder.d.ts.map