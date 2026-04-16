import { WorkerPool, CanvasPool } from "../runtime";
import { OverlayAsset } from "../types";
import ProgressManager from "./ProgressManager";
export interface IImageManager {
    loadAndCreateStaticImage(bglessUrl: string, overlays?: OverlayAsset[]): Promise<HTMLCanvasElement>;
    createStaticImage(bglessImage: HTMLImageElement, overlayImages?: {
        src: string;
        x: number;
        y: number;
        width?: number;
        height?: number;
    }[]): Promise<HTMLCanvasElement>;
    getCacheKey(gifUrl: string): string;
    optimizeGifFrame(frame: ImageBitmap, enhanceColors: boolean): HTMLCanvasElement;
    logBatchProgress(startIndex: number, currentBatchSize: number, totalFrames: number): void;
}
export declare class ImageManager implements IImageManager {
    private static instance;
    private progManager;
    private workerPool;
    private memoryUsage;
    protected completedPhases: Set<string>;
    private canvasPool;
    constructor(progManager: ProgressManager, workerPool: WorkerPool, canvasPool: CanvasPool);
    static getInstance(progManager: ProgressManager, workerPool: WorkerPool, canvasPool: CanvasPool): ImageManager;
    static destroyInstance(): void;
    loadAndCreateStaticImage(bglessUrl: string, overlays?: OverlayAsset[]): Promise<HTMLCanvasElement>;
    getCacheKey(gifUrl: string): string;
    optimizeGifFrame(frame: ImageBitmap, enhanceColors?: boolean): HTMLCanvasElement;
    logBatchProgress(startIndex: number, currentBatchSize: number, totalFrames: number): Promise<void>;
    loadedAssetCount: number;
    loadWithProgress: (src: string, totalAssets: number) => Promise<HTMLImageElement>;
    loadAsset(img: OverlayAsset[]): Promise<HTMLImageElement[]>;
    loadAssets(bglessUrl: string, overlays?: OverlayAsset[]): Promise<{
        bglessImage: HTMLImageElement;
        overlayImages: HTMLImageElement[];
    }>;
    loadImage(src: string): Promise<HTMLImageElement>;
    calculateCenteredPosition(containerSize: number, imageSize: number): number;
    drawOverlay(ctx: CanvasRenderingContext2D, overlayImage: CanvasImageSource, position: {
        x: number;
        y: number;
    }, size?: {
        width: number;
        height: number;
    }): void;
    loadStaticImage: (bglessUrl: string, overlays?: OverlayAsset[]) => Promise<HTMLCanvasElement>;
    createStaticImage(bglessImage: HTMLImageElement, overlayImages?: {
        src: string;
        x: number;
        y: number;
        width?: number;
        height?: number;
    }[]): Promise<HTMLCanvasElement>;
}
export declare const imageManager: ImageManager;
//# sourceMappingURL=ImageManager.d.ts.map