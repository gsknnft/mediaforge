export type RuntimeTaskHandler<TPayload = unknown, TResult = unknown> = (payload: TPayload) => Promise<TResult> | TResult;
export interface RuntimeTaskRequest<TPayload = unknown> {
    id: string;
    taskName: string;
    payload: TPayload;
}
export interface RuntimeTaskResult<TResult = unknown> {
    id: string;
    ok: true;
    result: TResult;
}
export interface RuntimeTaskFailure {
    id: string;
    ok: false;
    error: string;
}
export type RuntimeTaskResponse<TResult = unknown> = RuntimeTaskResult<TResult> | RuntimeTaskFailure;
export declare class RuntimeTaskRegistry {
    private readonly handlers;
    register<TPayload, TResult>(taskName: string, handler: RuntimeTaskHandler<TPayload, TResult>): void;
    has(taskName: string): boolean;
    run<TPayload, TResult>(taskName: string, payload: TPayload): Promise<TResult>;
}
export declare function executeTaskRequest<TPayload, TResult>(registry: RuntimeTaskRegistry, request: unknown): Promise<RuntimeTaskResponse<TResult>>;
//# sourceMappingURL=taskProtocol.d.ts.map