import { ParsedFrame } from "gifuct-js";
import { GIFMetadata, ImageAnalysis } from "../types";
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
    analyzeImageFromGif(buffer: ArrayBuffer): Promise<ImageAnalysis>;
    detectPixelArtInAllFrames(frames: ParsedFrame[]): Promise<boolean>;
    extractDominantColorsFromGifMetadata(metadata: GIFMetadata): {
        r: number;
        g: number;
        b: number;
        frequency: number;
    }[];
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