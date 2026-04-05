declare class RetryHandler {
    protected retries: number;
    protected delay: number;
    protected backoffFactor: number;
    constructor(retries?: number, delay?: number, backoffFactor?: number);
    execute<T>(fn: () => Promise<T>): Promise<T>;
    protected delayExecution(ms: number): Promise<void>;
}
declare class EnhancedRetryHandler extends RetryHandler {
    private jitterFactor;
    constructor(retries?: number, delay?: number, backoffFactor?: number, jitterFactor?: number);
    private applyJitter;
    execute<T>(fn: () => Promise<T>): Promise<T>;
}
declare function fetchWithRetry(url: string, options?: RequestInit, retries?: number, delay?: number): Promise<Response>;
export { RetryHandler, EnhancedRetryHandler, fetchWithRetry, };
//# sourceMappingURL=RetryHandler.d.ts.map