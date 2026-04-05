import { GIFMetadata } from "../types/gif.types";
import { ParsedFrame } from "gifuct-js";
export interface IGifAnalyzer {
    analyzeGIF(buffer: ArrayBuffer): Promise<GIFMetadata>;
    analyzeGIFFrameDimensions(frames: ParsedFrame[]): {
        maxWidth: number;
        maxHeight: number;
        hasVariableSize: boolean;
        scaleFactors: number[];
    };
}
export declare class GifAnalyzer implements IGifAnalyzer {
    private static instance;
    static getInstance(): GifAnalyzer;
    destroyInstance(): void;
    detectPixelArtInAllFrames(frames: ParsedFrame[]): Promise<boolean>;
    /**
     * ✅ Enhanced Pixel Art Detection using color density and edge transitions.
     */
    detectPixelArt(frame: ParsedFrame): boolean;
    analyzeGIF(buffer: ArrayBuffer): Promise<GIFMetadata>;
    analyzeGIFFrameDimensions(frames: ParsedFrame[]): {
        maxWidth: number;
        maxHeight: number;
        hasVariableSize: boolean;
        scaleFactors: number[];
    };
}
export declare const gifAnalyzer: GifAnalyzer;
//# sourceMappingURL=GifAnalyzer.d.ts.map