import { randomUUID } from "node:crypto";

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
      id: randomUUID(),
      taskName,
      payload,
    };
    const workerPath = this.resolveWorkerPath();

    return new Promise<TResult>((resolve, reject) => {
      const worker = new workerThreadsModule.Worker(workerPath);
      let settled = false;

      worker.once("message", (response: RuntimeTaskResponse<TResult>) => {
        settled = true;
        worker.terminate().catch(() => undefined);

        if (response.ok === true) {
          resolve(response.result);
          return;
        }

        reject(new Error(response.error));
      });

      worker.once("error", (error) => {
        settled = true;
        worker.terminate().catch(() => undefined);
        reject(error);
      });

      worker.once("exit", (code) => {
        if (!settled && code !== 0) {
          reject(new Error(`Node worker exited before responding (code ${code})`));
        }
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
