import { ParsedFrame } from "gifuct-js";
import { FrameDimensions, FrameSizeMetadata, GIFMetadata, ProcessedFrame } from "@/types";
import { PixelArtHandler } from "./PixelArtHandler";
import { GifAnalyzer } from "../analyzers/GifAnalyzer";
import { CanvasPool, WorkerPool } from "../runtime";
import ImageProcessor from "../services/ImageProcessingServicev1";
interface IFrameProcessor {
    calculateFrameSizeMetadata(metadata: GIFMetadata): FrameSizeMetadata;
    calculateGifFitDimensions(frameWidth: number, frameHeight: number): {
        width: number;
        height: number;
        x: number;
        y: number;
        sourceX: number;
        sourceY: number;
        sourceWidth: number;
        sourceHeight: number;
    };
    calculateConsistentDimensions(frames: ParsedFrame[]): FrameDimensions;
    processFrame(frame: ParsedFrame, staticImage: HTMLCanvasElement | null): Promise<ProcessedFrame>;
    optimizeFrameDimensions(frame: ParsedFrame, metadata: GIFMetadata): FrameDimensions;
    processFrame1(frame: ParsedFrame, staticImage: HTMLCanvasElement | null, metadata?: GIFMetadata): Promise<ParsedFrame>;
}
export declare class FrameProcessor implements IFrameProcessor {
    private static instance;
    private pixelArtHandler;
    private imageProcessor;
    private canvasPool;
    private gifAnalyzer;
    private workerPool;
    private workerCount;
    constructor(pixelArtHandler: PixelArtHandler, imageProcessor: ImageProcessor, canvasPool: CanvasPool, gifAnalyzer: GifAnalyzer, workerPool: WorkerPool, workerCount: number);
    static getInstance(pixelArtHandler: PixelArtHandler, imageProcessor: ImageProcessor, canvasPool: CanvasPool, gifAnalyzer: GifAnalyzer, workerPool: WorkerPool, workerCount: number): FrameProcessor;
    static destroyInstance(): void;
    calculateFrameSizeMetadata(metadata: GIFMetadata): FrameSizeMetadata;
    calculateGifFitDimensions(frameWidth: number, frameHeight: number): {
        width: number;
        height: number;
        x: number;
        y: number;
        sourceX: number;
        sourceY: number;
        sourceWidth: number;
        sourceHeight: number;
    };
    calculateConsistentDimensions(frames: ParsedFrame[]): FrameDimensions;
    processFrame(frame: ParsedFrame, staticImage: HTMLCanvasElement | null): Promise<ProcessedFrame>;
    processFrameOG(frame: ParsedFrame): Promise<ParsedFrame>;
    optimizeFrameDimensions(frame: ParsedFrame, metadata: GIFMetadata): FrameDimensions;
    processFrame1(frame: ParsedFrame, staticImage: HTMLCanvasElement | null, metadata?: GIFMetadata): Promise<ParsedFrame>;
    processHighResFrame(frame: ParsedFrame, metadata: GIFMetadata): ParsedFrame;
    processFramesInWorkers(frames: ParsedFrame[], staticImage?: HTMLCanvasElement): Promise<ProcessedFrame[]>;
}
export default FrameProcessor;
//# sourceMappingURL=FrameProcessor.d.ts.map