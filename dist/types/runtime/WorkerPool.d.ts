type TaskRunner<T> = () => Promise<T> | T;
import { type RuntimeTaskHandler } from "./taskProtocol";
interface QueuedTask<T> {
    task: TaskRunner<T>;
    resolve: (value: T) => void;
    reject: (reason?: unknown) => void;
    timeoutMs: number;
}
interface ExecutingTask<T> extends QueuedTask<T> {
    timeoutId: ReturnType<typeof setTimeout>;
}
export interface WorkerPoolStats {
    activeWorkers: number;
    availableWorkers: number;
    maxWorkers: number;
    queuedTasks: number;
}
export declare class WorkerPool {
    private readonly maxWorkers;
    readonly workerScript?: string;
    private static instance;
    readonly executingTasks: Map<number, ExecutingTask<unknown>>;
    private readonly availableWorkers;
    private readonly taskRegistry;
    private readonly queue;
    private initialized;
    private shutdownRequested;
    constructor(maxWorkers?: number, workerScript?: string);
    static getInstance(maxWorkers?: number, workerScript?: string): WorkerPool;
    static destroyInstance(): void;
    get stats(): WorkerPoolStats;
    initialize(): Promise<void>;
    registerTask(taskName: string, taskFunction: RuntimeTaskHandler): Promise<void>;
    hasTask(taskName: string): boolean;
    runTask<TPayload, TResult>(taskName: string, payload: TPayload, timeout?: number): Promise<TResult>;
    addTask<T>(task: TaskRunner<T>, timeout?: number): Promise<T>;
    markWorkerAvailable(workerId: number): void;
    terminate(force?: boolean): Promise<void>;
    private processQueue;
    private executeTask;
}
export declare const workerPool: WorkerPool;
export {};
//# sourceMappingURL=WorkerPool.d.ts.map