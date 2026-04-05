import { PixelArtHandler } from '../handlers/PixelArtHandler';
import { ParsedFrame, GIFMetadata, ProcessedFrame } from '../types/gif.types';
import { QUALITY_PRESETS } from '../constants/gif.constants';
import { GifAnalyzer } from '../analyzers/GifAnalyzer';
interface IImageProcessingService {
    createImgBitmap(frames: ParsedFrame[], staticImage: HTMLCanvasElement): Promise<ProcessedFrame[]>;
    createCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas;
    getCanvasContext(canvas: HTMLCanvasElement | OffscreenCanvas): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    preOptimizeGifFrame(frame: ParsedFrame, enhanceColors: boolean, quality: keyof typeof QUALITY_PRESETS): Promise<ParsedFrame>;
    calculateUniformDimensions(metadata: GIFMetadata): {
        width: number;
        height: number;
        scale: number;
    };
}
declare class ImageProcessingService implements IImageProcessingService {
    private static instance;
    private workerCount;
    private pixelArtHandler;
    private gifAnalyzer;
    constructor(workerCount: number, pixelArtHandler: PixelArtHandler, gifAnalyzer: GifAnalyzer);
    static getInstance(workerCount: number, pixelArtHandler: PixelArtHandler, gifAnalyzer: GifAnalyzer): ImageProcessingService;
    destroyInstance(): void;
    private normalizePatchForImageData;
    /**
     * Enhances the color table based on quality and enhancement settings.
     * @param colorTable - The original color table.
     * @param enhanceColors - Whether to enhance colors.
     * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
     * @returns The enhanced color table.
     */
    private enhanceColorTable;
    createImgBitmap(frames: ParsedFrame[], staticImage: HTMLCanvasElement): Promise<ProcessedFrame[]>;
    createCanvas(width: number, height: number): HTMLCanvasElement | OffscreenCanvas;
    getCanvasContext(canvas: HTMLCanvasElement | OffscreenCanvas): CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    private scaleFramePatch;
    private overlayStaticImage;
    /**
         * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
         * @param frame - The parsed GIF frame to optimize.
         * @param enhanceColors - Whether to enhance colors.
         * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
         * @returns The optimized frame.
         */
    preOptimizeGifFrame(frame: ParsedFrame, enhanceColors?: boolean, quality?: keyof typeof QUALITY_PRESETS): Promise<ParsedFrame>;
    calculateUniformDimensions(metadata: GIFMetadata): {
        width: number;
        height: number;
        scale: number;
    };
    /**
    * Optimizes the patch array by handling transparency with worker pools.
    */
    private optimizePatch;
    /**
     * Process a single chunk of the patch data
     */
    private processChunk;
}
export default ImageProcessingService;
//# sourceMappingURL=ImageProcessingService.d.ts.map