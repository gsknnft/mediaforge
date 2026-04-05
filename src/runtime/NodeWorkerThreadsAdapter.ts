import type { RuntimeTaskRequest, RuntimeTaskResponse } from "./taskProtocol";

export class NodeWorkerThreadsAdapter {
  constructor(private readonly workerPath?: string) {}

  public async runTask<TPayload, TResult>(
    taskName: string,
    payload: TPayload,
  ): Promise<TResult> {
    const workerThreadsModule =
      (await import("node:worker_threads")) as typeof import("node:worker_threads");

    const request: RuntimeTaskRequest<TPayload> = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      taskName,
      payload,
    };
    const workerPath = this.resolveWorkerPath();

    return new Promise<TResult>((resolve, reject) => {
      const worker = new workerThreadsModule.Worker(workerPath);

      worker.once("message", (response: RuntimeTaskResponse<TResult>) => {
        worker.terminate().catch(() => undefined);

        if (response.ok === true) {
          resolve(response.result);
          return;
        }

        reject(new Error(response.error));
      });

      worker.once("error", (error) => {
        worker.terminate().catch(() => undefined);
        reject(error);
      });

      worker.postMessage(request);
    });
  }

  private resolveWorkerPath(): string {
    if (this.workerPath) {
      return this.workerPath;
    }

    throw new Error(
      "NodeWorkerThreadsAdapter requires an explicit workerPath. Use the built ./node-worker entry output when wiring the adapter.",
    );
  }
}
