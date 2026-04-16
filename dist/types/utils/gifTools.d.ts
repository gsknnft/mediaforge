import { ParsedFrame } from "gifuct-js";
import { GIFProgressTracker } from "../trackers/GIFProgressTracker";
import { Overlay } from "../types/asset.types";
declare class GIFTools {
    private progTracker;
    readonly CONSTANTS: {
        readonly MAX_CANVAS_SIZE: 2800;
        readonly WORKING_SIZE: 800;
        readonly NFT_SIZE: 2800;
        readonly POOL_SIZE: 15;
        readonly CANVAS_PER_SIZE: 5;
        readonly MEMORY_LIMIT: number;
        readonly QUALITY: 1;
        readonly BATCH_SIZE: 5;
        readonly MEMORY_THRESHOLD: 0.8;
        readonly SCALE_DOWN_FACTOR: 0.5;
        readonly MAX_WORKERS: number;
        readonly TARGET_SIZE: 800;
        readonly MIN_SIZE: 400;
        readonly DITHER: false;
        readonly DELAY: 100;
        readonly WORKER_PATH: "/gif.worker.js";
    };
    private completedPhases;
    readonly QUALITY_PRESETS: {
        readonly LOW: {
            readonly quality: 10;
            readonly dither: false;
            readonly frameSkip: 2;
            readonly colors: 128;
            readonly colorEnhancement: {
                readonly red: 0.8;
                readonly green: 0.8;
                readonly blue: 0.8;
            };
        };
        readonly MEDIUM: {
            readonly quality: 5;
            readonly dither: "FloydSteinberg";
            readonly frameSkip: 1;
            readonly colors: 256;
            readonly colorEnhancement: {
                readonly red: 1.1;
                readonly green: 1.1;
                readonly blue: 1.1;
            };
        };
        readonly HIGH: {
            readonly quality: 1;
            readonly dither: "FloydSteinberg";
            readonly frameSkip: 0;
            readonly colors: 256;
            readonly preserveAlpha: true;
            readonly smoothing: true;
        };
        readonly FIRE: {
            readonly quality: 1;
            readonly dither: false;
            readonly frameSkip: 0;
            readonly colors: 256;
            readonly preserveAlpha: true;
            readonly smoothing: true;
            readonly blendMode: "screen";
            readonly colorEnhancement: {
                readonly red: 1.2;
                readonly green: 0.9;
                readonly blue: 0.8;
                readonly alpha: 1.2;
            };
        };
    };
    constructor(progTracker: GIFProgressTracker);
    loadImage(url: string): Promise<HTMLImageElement>;
    /**
     * Generates a new patch based on the enhanced color table and frame data.
     * @param frame - The original frame.
     * @param enhancedColorTable - The enhanced color table.
     * @returns The new patch as a Uint8ClampedArray.
     */
    generatePatch(frame: ParsedFrame, enhancedColorTable: [number, number, number][]): Uint8ClampedArray;
    /**
     * Pre-optimizes a GIF frame by enhancing its color table and updating its patch.
     * @param frame - The parsed GIF frame to optimize.
     * @param enhanceColors - Whether to enhance colors.
     * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
     * @returns The optimized frame.
     */
    preOptimizeGifFrame(frame: ParsedFrame, enhanceColors?: boolean, quality?: keyof typeof this.QUALITY_PRESETS): ParsedFrame;
    /**
     * Enhances the color table based on quality and enhancement settings.
     * @param colorTable - The original color table.
     * @param enhanceColors - Whether to enhance colors.
     * @param quality - The quality preset (e.g., 'LOW', 'MEDIUM', 'HIGH', 'FIRE').
     * @returns The enhanced color table.
     */
    enhanceColorTable(colorTable: [number, number, number][], enhanceColors: boolean, quality: keyof typeof this.QUALITY_PRESETS): [number, number, number][];
    loadAndCreateStaticImage(bglessUrl: string, overlays?: Overlay[]): Promise<HTMLCanvasElement>;
    updatePhase(phaseId: string, progress: number, message: string, totalFrames?: number): void;
    private processingStartTime;
    private framesProcessed;
    private averageFrameTime;
    private calculateETA;
    calculateCenteredPosition(containerSize: number, imageSize: number): number;
    getCacheKey(gifUrl: string): string;
    validateInput(frames: ParsedFrame[], bglessUrl: string, overlays?: Overlay[]): void;
    optimizeGifFrame(frame: ImageBitmap, enhanceColors?: boolean): HTMLCanvasElement;
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
    private normalizeFrameData;
}
export { GIFTools };
//# sourceMappingURL=gifTools.d.ts.map