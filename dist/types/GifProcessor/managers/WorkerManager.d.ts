import { WorkerPool } from "../../runtime";
import { ParsedFrame } from "../types/gif.types";
export interface IWorkerManager {
    processFrameInWorker(frame: ParsedFrame): Promise<ParsedFrame>;
    encodeGIFInWorker(frames: ImageBitmap[]): Promise<Blob>;
    registerWorkerTasks(): Promise<void>;
}
export declare class WorkerManager implements IWorkerManager {
    private static instance;
    private readonly workerPool;
    private isInitialized;
    private activeWorkers;
    constructor(workerPool: WorkerPool);
    static getInstance(workerPool: WorkerPool): WorkerManager;
    static destroyInstance(): void;
    initialize(): Promise<void>;
    processFrameInWorker(frame: ParsedFrame): Promise<ParsedFrame>;
    private cleanupWorker;
    cleanup(): Promise<void>;
    handleWorkerMessage(workerId: number, e: MessageEvent): void;
    encodeGIFInWorker(frames: ImageBitmap[]): Promise<Blob>;
    registerWorkerTasks(): Promise<void>;
    private dispatchToBrowserWorker;
}
//# sourceMappingURL=WorkerManager.d.ts.map