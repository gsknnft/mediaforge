type TaskRunner<T> = () => Promise<T> | T;

import { RuntimeTaskRegistry, type RuntimeTaskHandler } from "./taskProtocol";

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

function getDefaultConcurrency(): number {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }

  return 4;
}

export class WorkerPool {
  private static instance: WorkerPool | null = null;

  public readonly executingTasks = new Map<number, ExecutingTask<unknown>>();

  private readonly availableWorkers = new Set<number>();
  private readonly taskRegistry = new RuntimeTaskRegistry();
  private readonly queue: Array<QueuedTask<unknown>> = [];
  private initialized = false;
  private shutdownRequested = false;

  constructor(
    private readonly maxWorkers: number = Math.max(
      1,
      Math.ceil(getDefaultConcurrency()),
    ),
    readonly workerScript?: string,
  ) {}

  public static getInstance(
    maxWorkers?: number,
    workerScript?: string,
  ): WorkerPool {
    if (!this.instance) {
      this.instance = new WorkerPool(maxWorkers, workerScript);
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }

  public get stats(): WorkerPoolStats {
    return {
      activeWorkers: this.executingTasks.size,
      availableWorkers: this.availableWorkers.size,
      maxWorkers: this.maxWorkers,
      queuedTasks: this.queue.length,
    };
  }

  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    for (let workerId = 0; workerId < this.maxWorkers; workerId += 1) {
      this.availableWorkers.add(workerId);
    }

    this.shutdownRequested = false;
    this.initialized = true;
  }

  public async registerTask(
    taskName: string,
    taskFunction: RuntimeTaskHandler,
  ): Promise<void> {
    this.taskRegistry.register(taskName, taskFunction);
  }

  public hasTask(taskName: string): boolean {
    return this.taskRegistry.has(taskName);
  }

  public async runTask<TPayload, TResult>(
    taskName: string,
    payload: TPayload,
    timeout = 30000,
  ): Promise<TResult> {
    if (!this.taskRegistry.has(taskName)) {
      throw new Error(`Unknown worker task: ${taskName}`);
    }

    return this.addTask<TResult>(
      () => this.taskRegistry.run(taskName, payload),
      timeout,
    );
  }

  public async addTask<T>(task: TaskRunner<T>, timeout = 30000): Promise<T> {
    if (!this.initialized) {
      await this.initialize();
    }

    if (this.shutdownRequested) {
      throw new Error("Worker pool is shutting down");
    }

    return new Promise<T>((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
        timeoutMs: timeout,
      });
      this.processQueue();
    });
  }

  public markWorkerAvailable(workerId: number): void {
    this.availableWorkers.add(workerId);
  }

  public async terminate(force = false): Promise<void> {
    this.shutdownRequested = true;

    if (force) {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        task?.reject(new Error("Worker pool terminated"));
      }
    }

    for (const [, task] of this.executingTasks) {
      clearTimeout(task.timeoutId);
      if (force) {
        task.reject(new Error("Worker pool terminated"));
      }
    }

    this.executingTasks.clear();
    this.availableWorkers.clear();
    this.initialized = false;
  }

  private processQueue(): void {
    while (this.queue.length > 0 && this.availableWorkers.size > 0) {
      const workerId = this.availableWorkers.values().next().value as
        | number
        | undefined;
      if (workerId === undefined) {
        return;
      }

      this.availableWorkers.delete(workerId);
      const queuedTask = this.queue.shift();
      if (!queuedTask) {
        this.availableWorkers.add(workerId);
        return;
      }

      const timeoutId = setTimeout(() => {
        const executing = this.executingTasks.get(workerId);
        if (!executing) {
          return;
        }

        this.executingTasks.delete(workerId);
        executing.reject(new Error("Task timed out"));
        this.markWorkerAvailable(workerId);
        this.processQueue();
      }, queuedTask.timeoutMs);

      this.executingTasks.set(workerId, {
        ...queuedTask,
        timeoutId,
      });

      void this.executeTask(workerId, queuedTask, timeoutId);
    }
  }

  private async executeTask<T>(
    workerId: number,
    queuedTask: QueuedTask<T>,
    timeoutId: ReturnType<typeof setTimeout>,
  ): Promise<void> {
    try {
      const result = await queuedTask.task();
      clearTimeout(timeoutId);

      if (this.executingTasks.has(workerId)) {
        queuedTask.resolve(result);
      }
    } catch (error) {
      clearTimeout(timeoutId);

      if (this.executingTasks.has(workerId)) {
        queuedTask.reject(error);
      }
    } finally {
      this.executingTasks.delete(workerId);
      if (!this.shutdownRequested) {
        this.markWorkerAvailable(workerId);
        this.processQueue();
      }
    }
  }
}

export const workerPool = WorkerPool.getInstance();
