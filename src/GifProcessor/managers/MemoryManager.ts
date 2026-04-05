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
  validateInput(
    frames: ParsedFrame[],
    bglessUrl: string,
    overlays?: OverlayAsset[],
  ): void;
  setQualityOptions(options: Partial<QualityOptions>): void;
}

class MemoryManager implements IMemoryManager {
  public static instance: IMemoryManager | null = null;
  static sessionId: string;
  private resources: Set<{ cleanup: () => void }> = new Set();
  private cache: Map<string, any>;
  static activeMetrics: Map<string, string> = new Map();
  static processingDelay = 10;
  private qualityOptions: QualityOptions;
  private workerCount: number;
  protected progTracker: GIFProgressTracker;
  private workerPool: WorkerPool;
  public currentMemoryStrategy: MemoryStrategy;
  private completedPhases: Set<string> = new Set();
  protected isProcessing;
  protected processingStartTime: number = 0;
  protected framesProcessed: number = 0;
  protected averageFrameTime: number = 0;
  protected totalFrames: number = 0;
  protected frameStartTime: number = 0;
  protected frameProcessingTimes: number[] = [];
  protected totalFramesCount: number = 0;
  protected processedFramesCount: number = 0;
  protected processedFramesCache: Map<string, ParsedFrame[]>;
  protected abort: AbortController;
  protected readonly gifWorkerPool: WorkerPool;

  constructor(
    sessionId: string,
    progTracker: GIFProgressTracker,
    poolSize: number,
    workerPool: WorkerPool,
    gifWorkerPool: WorkerPool,
    qualityOptions: QualityOptions,
    workerCount: number,
  ) {
    MemoryManager.sessionId = sessionId;
    this.progTracker = progTracker;
    this.workerCount = workerCount;
    this.cache = new Map();
    this.currentMemoryStrategy = this.MEMORY_STRATEGIES.MEDIUM;
    this.qualityOptions = qualityOptions;
    this.workerPool = workerPool;
    this.gifWorkerPool = gifWorkerPool;
    this.processedFramesCache = new Map();
    this.isProcessing = false;
    this.abort = new AbortController();
  }

  public static getInstance(
    sessionId: string,
    progTracker: GIFProgressTracker,
    poolSize: number,
    workerPool: WorkerPool,
    gifWorkerPool: WorkerPool,
    qualityOptions: QualityOptions,
    workerCount: number,
  ): IMemoryManager {
    if (!this.instance) {
      this.instance = new MemoryManager(
        sessionId,
        progTracker,
        poolSize,
        workerPool,
        gifWorkerPool,
        qualityOptions,
        workerCount,
      );
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }

  // Add to class properties
  public readonly MEMORY_STRATEGIES: Record<string, MemoryStrategy> = {
    LOW: {
      maxMemoryUsage: 512 * 1024 * 1024, // 512MB
      batchSize: 3,
      workerCount: 2,
      cleanupThreshold: 0.7,
    },
    MEDIUM: {
      maxMemoryUsage: 1024 * 1024 * 1024, // 1GB
      batchSize: 5,
      workerCount: 4,
      cleanupThreshold: 0.8,
    },
    HIGH: {
      maxMemoryUsage: 2048 * 1024 * 1024, // 2GB
      batchSize: 8,
      workerCount: 6,
      cleanupThreshold: 0.9,
    },
  };

  registerResource(cleanup: () => void) {
    const resource = { cleanup };
    this.resources.add(resource);
    return () => {
      resource.cleanup();
      this.resources.delete(resource);
    };
  }

  get(key: string) {
    return this.cache.get(key);
  }

  set(key: string, value: any) {
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  setProcessingDelay(delay: number): void {
    MemoryManager.processingDelay = delay;
  }

  // Add public method to set quality options
  public setQualityOptions(options: Partial<QualityOptions>): void {
    this.qualityOptions = {
      ...this.qualityOptions,
      ...options,
    };
    console.debug("Quality options updated:", this.qualityOptions);
  }
  // Add these new methods
  public async handleMemoryPressure(usage: number): Promise<void> {
    const totalMemory =
      (performance as unknown as { memory: { jsHeapSizeLimit: number } })
        ?.memory?.jsHeapSizeLimit || 2048 * 1024 * 1024;
    const usageRatio = usage / totalMemory;

    if (usageRatio > this.currentMemoryStrategy.cleanupThreshold) {
      // Downgrade memory strategy if needed
      if (usageRatio > 0.9) {
        this.currentMemoryStrategy = this.MEMORY_STRATEGIES.LOW;
        this.workerCount = this.currentMemoryStrategy.workerCount;
      }
    }
  }

  public async cleanup() {
    this.resources.forEach((resource) => resource.cleanup());
    this.resources.clear();
    this.isProcessing = false;
    this.abort.abort();
    this.abort = new AbortController();
    this.clear();
    this.clearCache();
    this.completedPhases.clear();
    this.progTracker.reset();
  }

  public validateInput(
    frames: ParsedFrame[],
    bglessUrl: string,
    overlays?: OverlayAsset[],
  ): void {
    if (!frames?.length) throw new Error("No frames provided");
    if (!bglessUrl) throw new Error("No background image URL provided");
    if (overlays !== undefined && !Array.isArray(overlays)) {
      throw new Error("Invalid overlays format");
    }
  }

  private async cancel() {
    this.abort.abort();
    await this.cleanup();
    this.abort = new AbortController();
  }

  private async clearCache() {
    this.processedFramesCache.clear();
  }
}

export default MemoryManager;
