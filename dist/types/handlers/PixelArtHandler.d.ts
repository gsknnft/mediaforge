import { GifAnalyzer } from "../analyzers/GifAnalyzer";
import { ParsedFrame, PixelArtMetrics, PixelArtSettings } from "@/types";
export declare const PIXEL_ART_SETTINGS: PixelArtSettings;
export declare class PixelArtHandler {
    private static instance;
    static getInstance(): PixelArtHandler;
    destroyInstance(): void;
    detectPixelArt(frame: ParsedFrame): boolean;
    private detectSharpEdges;
    private isSharpTransition;
    analyzePixelArtFrame(frame: ParsedFrame): PixelArtMetrics;
    processPixelArtFrame(frame: ParsedFrame, frameAnalysis: ReturnType<typeof GifAnalyzer.prototype.analyzeGIFFrameDimensions>, frameIndex: number): ParsedFrame;
}
export declare const pixelArtHandler: PixelArtHandler;
//# sourceMappingURL=PixelArtHandler.d.ts.map