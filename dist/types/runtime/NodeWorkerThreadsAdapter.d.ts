export declare class NodeWorkerThreadsAdapter {
    private readonly workerPath?;
    constructor(workerPath?: string);
    runTask<TPayload, TResult>(taskName: string, payload: TPayload): Promise<TResult>;
    private resolveWorkerPath;
}
//# sourceMappingURL=NodeWorkerThreadsAdapter.d.ts.map