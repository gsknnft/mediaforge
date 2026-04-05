import { WorkerPool } from "../../runtime";
import { CONSTANTS } from "../constants/gif.constants";
import { ParsedFrame } from "../types/gif.types";

const PROCESS_FRAME_TASK = "gif.process-frame";
const ENCODE_GIF_TASK = "gif.encode";

export interface IWorkerManager {
  processFrameInWorker(frame: ParsedFrame): Promise<ParsedFrame>;
  encodeGIFInWorker(frames: ImageBitmap[]): Promise<Blob>;
  registerWorkerTasks(): Promise<void>;
}

export class WorkerManager implements IWorkerManager {
  private static instance: WorkerManager | null = null;
  private readonly workerPool: WorkerPool;
  private isInitialized: boolean = false;
  private activeWorkers: Set<Worker> = new Set();

  constructor(workerPool: WorkerPool) {
    this.workerPool = workerPool;
  }

  public static getInstance(workerPool: WorkerPool): WorkerManager {
    if (!this.instance) {
      this.instance = new WorkerManager(workerPool);
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance?.cleanup();
    this.instance = null;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    await this.workerPool.initialize();
    await this.registerWorkerTasks();
    this.isInitialized = true;
  }

  public async processFrameInWorker(frame: ParsedFrame): Promise<ParsedFrame> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.workerPool.runTask(PROCESS_FRAME_TASK, frame, 30000);
  }

  private cleanupWorker(worker: Worker): void {
    this.activeWorkers.delete(worker);
    worker.terminate();
  }

  public async cleanup(): Promise<void> {
    // Cleanup active workers
    this.activeWorkers.forEach((worker) => {
      worker.terminate();
    });
    this.activeWorkers.clear();

    // Reset state
    this.isInitialized = false;
  }

  handleWorkerMessage(workerId: number, e: MessageEvent) {
    const task = this.workerPool.executingTasks.get(workerId);
    if (!task) return;

    clearTimeout(task.timeoutId); // Clear timeout if task finishes
    this.workerPool.executingTasks.delete(workerId);
    this.workerPool.markWorkerAvailable(workerId);

    if (e.data.type === "success") {
      task.resolve(e.data.result);
    } else if (e.data.type === "error") {
      task.reject(new Error(e.data.error));
    }
  }

  public async encodeGIFInWorker(frames: ImageBitmap[]): Promise<Blob> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    return this.workerPool.runTask(ENCODE_GIF_TASK, frames, 30000);
  }

  public async registerWorkerTasks(): Promise<void> {
    if (!this.workerPool.hasTask(PROCESS_FRAME_TASK)) {
      await this.workerPool.registerTask(
        PROCESS_FRAME_TASK,
        async (frame: ParsedFrame) => {
          return this.dispatchToBrowserWorker<ParsedFrame>({
            type: "processFrame",
            frame,
          });
        },
      );
    }

    if (!this.workerPool.hasTask(ENCODE_GIF_TASK)) {
      await this.workerPool.registerTask(
        ENCODE_GIF_TASK,
        async (frames: ImageBitmap[]) => {
          return this.dispatchToBrowserWorker<Blob>(frames);
        },
      );
    }
  }

  private async dispatchToBrowserWorker<TResult>(
    payload: unknown,
  ): Promise<TResult> {
    return new Promise<TResult>((resolve, reject) => {
      const worker = new Worker(CONSTANTS.WORKER_PATH);
      this.activeWorkers.add(worker);

      worker.onmessage = (event) => {
        resolve(event.data as TResult);
        this.cleanupWorker(worker);
      };

      worker.onerror = (error) => {
        reject(error);
        this.cleanupWorker(worker);
      };

      worker.postMessage(payload);
    });
  }
}
