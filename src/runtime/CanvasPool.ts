interface CanvasMetrics {
  usage: number;
  lastUsed: number;
}

function createCanvasElement(width: number, height: number): HTMLCanvasElement {
  if (typeof document === "undefined") {
    throw new Error(
      "CanvasPool requires a DOM-like environment with document.createElement",
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export class CanvasPool {
  private static instance: CanvasPool | null = null;

  private readonly pool = new Map<string, HTMLCanvasElement[]>();
  private readonly usage = new Map<string, number>();
  private readonly metrics = new Map<string, CanvasMetrics>();

  constructor(
    private readonly maxPoolSize = 5,
    private readonly maxCanvasesPerSize = 2,
    private readonly memoryLimit = 500 * 1024 * 1024,
  ) {}

  public static getInstance(): CanvasPool {
    if (!this.instance) {
      this.instance = new CanvasPool();
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }

  public getCanvas(
    width: number,
    height: number,
    _useFabric = false,
  ): HTMLCanvasElement {
    const key = this.getKey(width, height);
    const poolForSize = this.pool.get(key);

    if (poolForSize && poolForSize.length > 0) {
      this.incrementUsage(key);
      this.updateMetrics(key);
      return poolForSize.pop() as HTMLCanvasElement;
    }

    this.incrementUsage(key);
    this.updateMetrics(key);
    return createCanvasElement(width, height);
  }

  public releaseCanvas(canvas: HTMLCanvasElement): void {
    const key = this.getKey(canvas.width, canvas.height);
    if (!this.shouldAddToPool(key)) {
      this.disposeCanvas(canvas);
      return;
    }

    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    const poolForSize = this.pool.get(key) ?? [];
    poolForSize.push(canvas);
    this.pool.set(key, poolForSize);
    this.updateMetrics(key);
  }

  public clear(): void {
    for (const canvases of this.pool.values()) {
      canvases.forEach((canvas) => this.disposeCanvas(canvas));
    }

    this.pool.clear();
    this.usage.clear();
    this.metrics.clear();
  }

  public terminate(): void {
    this.clear();
  }

  public getPoolSize(): number {
    return this.pool.size;
  }

  public getUsageStats(): Map<string, number> {
    return this.usage;
  }

  private getKey(width: number, height: number): string {
    return `${width}x${height}`;
  }

  private incrementUsage(key: string): void {
    this.usage.set(key, (this.usage.get(key) ?? 0) + 1);
  }

  private shouldAddToPool(key: string): boolean {
    const currentSize = this.pool.get(key)?.length ?? 0;
    const totalCanvases = Array.from(this.pool.values()).reduce(
      (count, canvases) => count + canvases.length,
      0,
    );

    return (
      currentSize < this.maxCanvasesPerSize &&
      totalCanvases < this.maxPoolSize &&
      this.getCurrentMemoryUsage() < this.memoryLimit
    );
  }

  private getCurrentMemoryUsage(): number {
    return Array.from(this.pool.entries()).reduce((total, [key, canvases]) => {
      const [width, height] = key.split("x").map(Number);
      return total + canvases.length * width * height * 4;
    }, 0);
  }

  private updateMetrics(key: string): void {
    const metric = this.metrics.get(key) ?? { usage: 0, lastUsed: 0 };
    metric.usage += 1;
    metric.lastUsed = Date.now();
    this.metrics.set(key, metric);
  }

  private disposeCanvas(canvas: HTMLCanvasElement): void {
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();
  }
}

export const canvasPool = CanvasPool.getInstance();
