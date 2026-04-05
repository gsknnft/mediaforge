export declare class CanvasPool {
    private readonly maxPoolSize;
    private readonly maxCanvasesPerSize;
    private readonly memoryLimit;
    private static instance;
    private readonly pool;
    private readonly usage;
    private readonly metrics;
    constructor(maxPoolSize?: number, maxCanvasesPerSize?: number, memoryLimit?: number);
    static getInstance(): CanvasPool;
    static destroyInstance(): void;
    getCanvas(width: number, height: number, _useFabric?: boolean): HTMLCanvasElement;
    releaseCanvas(canvas: HTMLCanvasElement): void;
    clear(): void;
    terminate(): void;
    getPoolSize(): number;
    getUsageStats(): Map<string, number>;
    private getKey;
    private incrementUsage;
    private shouldAddToPool;
    private getCurrentMemoryUsage;
    private updateMetrics;
    private disposeCanvas;
}
export declare const canvasPool: CanvasPool;
//# sourceMappingURL=CanvasPool.d.ts.map