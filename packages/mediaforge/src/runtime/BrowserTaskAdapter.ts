import { RuntimeTaskRegistry, type RuntimeTaskHandler } from "./taskProtocol";
import { WorkerPool } from "./WorkerPool";

interface BrowserTaskAdapterOptions {
  pool?: WorkerPool;
  registry?: RuntimeTaskRegistry;
  workerScriptUrl?: URL | string;
}

export class BrowserTaskAdapter {
  private readonly workerScriptUrl?: URL | string;
  private readonly pendingRequests = new Map<
    string,
    {
      resolve: (value: unknown) => void;
      reject: (reason?: unknown) => void;
      timeoutId: ReturnType<typeof setTimeout>;
    }
  >();
  private nextRequestId = 0;
  private worker: Worker | null = null;

  constructor(options: BrowserTaskAdapterOptions = {}) {
    this.pool = options.pool ?? WorkerPool.getInstance();
    this.registry = options.registry ?? new RuntimeTaskRegistry();
    this.workerScriptUrl = options.workerScriptUrl;
  }

  private readonly pool: WorkerPool;
  private readonly registry: RuntimeTaskRegistry;

  public registerTask<TPayload, TResult>(
    taskName: string,
    handler: RuntimeTaskHandler<TPayload, TResult>,
  ): void {
    this.registry.register(taskName, handler);
    void this.pool.registerTask(taskName, handler);
  }

  public async runTask<TPayload, TResult>(
    taskName: string,
    payload: TPayload,
    timeoutMs = 30000,
  ): Promise<TResult> {
    if (this.registry.has(taskName)) {
      return this.pool.runTask<TPayload, TResult>(taskName, payload, timeoutMs);
    }

    if (typeof Worker !== "undefined" && this.workerScriptUrl) {
      return this.runTaskInWorker<TPayload, TResult>(
        taskName,
        payload,
        timeoutMs,
      );
    }

    return this.pool.runTask<TPayload, TResult>(taskName, payload, timeoutMs);
  }

  public get taskRegistry(): RuntimeTaskRegistry {
    return this.registry;
  }

  public terminate(): void {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error("Browser task adapter terminated"));
    }

    this.pendingRequests.clear();
    this.worker?.terminate();
    this.worker = null;
  }

  private async runTaskInWorker<TPayload, TResult>(
    taskName: string,
    payload: TPayload,
    timeoutMs: number,
  ): Promise<TResult> {
    const worker = this.ensureWorker();
    const requestId = `task-${this.nextRequestId++}`;

    return new Promise<TResult>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Task timed out: ${taskName}`));
      }, timeoutMs);

      this.pendingRequests.set(requestId, {
        resolve: (value) => resolve(value as TResult),
        reject,
        timeoutId,
      });

      worker.postMessage({
        id: requestId,
        taskName,
        payload,
      });
    });
  }

  private ensureWorker(): Worker {
    if (this.worker) {
      return this.worker;
    }

    if (!this.workerScriptUrl) {
      throw new Error(
        "BrowserTaskAdapter requires workerScriptUrl for off-main-thread execution",
      );
    }

    this.worker = new Worker(this.workerScriptUrl, { type: "module" });
    this.worker.onmessage = (event) => {
      const response = event.data as {
        id: string;
        ok: boolean;
        result?: unknown;
        error?: string;
      };
      const pending = this.pendingRequests.get(response.id);
      if (!pending) {
        return;
      }

      clearTimeout(pending.timeoutId);
      this.pendingRequests.delete(response.id);

      if (response.ok) {
        pending.resolve(response.result);
        return;
      }

      pending.reject(new Error(response.error ?? "Task failed"));
    };
    this.worker.onerror = (error) => {
      for (const pending of this.pendingRequests.values()) {
        clearTimeout(pending.timeoutId);
        pending.reject(error);
      }

      this.pendingRequests.clear();
      this.worker?.terminate();
      this.worker = null;
    };

    return this.worker;
  }
}

export const browserTaskAdapter = new BrowserTaskAdapter();
