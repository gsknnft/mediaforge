import { GifImage, read, GifFrameDataType } from './GIFDecoder';

interface UseGifDecoderResult {
    width: number;
    height: number;
    background: number;
    frameCount: number;
    frames: GifFrameDataType[];
    delays: number[];
}

async function useGifDecoder(input: string | Uint8Array | Blob): Promise<UseGifDecoderResult> {
    const data = await normalizeInput(input);
    const gif = read(data);
    
    return {
        width: gif.getWidth(),
        height: gif.getHeight(),
        background: gif.getBackgroundColor(),
        frameCount: gif.getFrameCount(),
        frames: gif.getAllFramesData(),
        delays: gif.frames.map(f => f.delay)
    };
}

async function normalizeInput(input: string | Uint8Array | Blob): Promise<Uint8Array> {
    if (typeof input === 'string') {
        const response = await fetch(input);
        if (!response.ok) throw new Error(`Failed to fetch GIF: ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        return new Uint8Array(buffer);
    }
    
    if (input instanceof Blob) {
        const buffer = await input.arrayBuffer();
        return new Uint8Array(buffer);
    }
    
    return input;
}

async function processGif(gifUrl: string, onFrame?: (frameData: GifFrameDataType) => void): Promise<GifFrameDataType[]> {
    const gifData = await useGifDecoder(gifUrl);
    return gifData.frames.map((frame, index) => {
        if (onFrame) onFrame(frame);
        return frame;
    });
}

export {
    useGifDecoder,
    processGif,
    type UseGifDecoderResult,
    type GifFrameDataType
};