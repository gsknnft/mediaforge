import { ParsedFrame } from 'gifuct-js';
interface ScalingMetrics {
    maxWidth: number;
    maxHeight: number;
    baseScale: number;
    frameScales: number[];
}
export declare class PixelGifScaler {
    private targetSize;
    constructor(targetSize: number);
    calculateScaling(frames: ParsedFrame[]): ScalingMetrics;
    scaleFrame(frame: ParsedFrame, frameIndex: number, metrics: ScalingMetrics): ImageData;
}
export declare function scalePixelFrames(frames: ParsedFrame[], targetSize: number): Promise<ParsedFrame[]>;
export {};
//# sourceMappingURL=PixelGifScaler.d.ts.map