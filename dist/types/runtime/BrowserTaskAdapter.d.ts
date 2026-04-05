import { RuntimeTaskRegistry, type RuntimeTaskHandler } from "./taskProtocol";
import { WorkerPool } from "./WorkerPool";
interface BrowserTaskAdapterOptions {
    pool?: WorkerPool;
    registry?: RuntimeTaskRegistry;
    workerScriptUrl?: URL | string;
}
export declare class BrowserTaskAdapter {
    private readonly workerScriptUrl?;
    private readonly pendingRequests;
    private nextRequestId;
    private worker;
    constructor(options?: BrowserTaskAdapterOptions);
    private readonly pool;
    private readonly registry;
    registerTask<TPayload, TResult>(taskName: string, handler: RuntimeTaskHandler<TPayload, TResult>): void;
    runTask<TPayload, TResult>(taskName: string, payload: TPayload, timeoutMs?: number): Promise<TResult>;
    get taskRegistry(): RuntimeTaskRegistry;
    terminate(): void;
    private runTaskInWorker;
    private ensureWorker;
}
export declare const browserTaskAdapter: BrowserTaskAdapter;
export {};
//# sourceMappingURL=BrowserTaskAdapter.d.ts.map