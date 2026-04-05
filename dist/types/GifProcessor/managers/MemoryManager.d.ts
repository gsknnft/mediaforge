import { WorkerPool } from "../../runtime";
import { ParsedFrame } from "gifuct-js";
import { OverlayAsset } from "../../assets/types/asset.types";
import { GIFProgressTracker } from "../services/GIFProgressTracker";
import { MemoryStrategy, QualityOptions } from "../types/gif.types";
interface IMemoryManager {
    get(key: string): any;
    set(key: string, value: any): void;
    clear(): void;
    setProcessingDelay(delay: number): void;
    handleMemoryPressure(usage: number): Promise<void>;
    cleanup(): Promise<void>;
    validateInput(frames: ParsedFrame[], bglessUrl: string, overlays?: OverlayAsset[]): void;
    setQualityOptions(options: Partial<QualityOptions>): void;
}
declare class MemoryManager implements IMemoryManager {
    static instance: IMemoryManager | null;
    static sessionId: string;
    private resources;
    private cache;
    static activeMetrics: Map<string, string>;
    static processingDelay: number;
    private qualityOptions;
    private workerCount;
    protected progTracker: GIFProgressTracker;
    private workerPool;
    currentMemoryStrategy: MemoryStrategy;
    private completedPhases;
    protected isProcessing: any;
    protected processingStartTime: number;
    protected framesProcessed: number;
    protected averageFrameTime: number;
    protected totalFrames: number;
    protected frameStartTime: number;
    protected frameProcessingTimes: number[];
    protected totalFramesCount: number;
    protected processedFramesCount: number;
    protected processedFramesCache: Map<string, ParsedFrame[]>;
    protected abort: AbortController;
    protected readonly gifWorkerPool: WorkerPool;
    constructor(sessionId: string, progTracker: GIFProgressTracker, poolSize: number, workerPool: WorkerPool, gifWorkerPool: WorkerPool, qualityOptions: QualityOptions, workerCount: number);
    static getInstance(sessionId: string, progTracker: GIFProgressTracker, poolSize: number, workerPool: WorkerPool, gifWorkerPool: WorkerPool, qualityOptions: QualityOptions, workerCount: number): IMemoryManager;
    static destroyInstance(): void;
    readonly MEMORY_STRATEGIES: Record<string, MemoryStrategy>;
    registerResource(cleanup: () => void): () => void;
    get(key: string): any;
    set(key: string, value: any): void;
    clear(): void;
    setProcessingDelay(delay: number): void;
    setQualityOptions(options: Partial<QualityOptions>): void;
    handleMemoryPressure(usage: number): Promise<void>;
    cleanup(): Promise<void>;
    validateInput(frames: ParsedFrame[], bglessUrl: string, overlays?: OverlayAsset[]): void;
    private cancel;
    private clearCache;
}
export default MemoryManager;
//# sourceMappingURL=MemoryManager.d.ts.map