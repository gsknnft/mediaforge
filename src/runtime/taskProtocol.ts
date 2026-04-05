export type RuntimeTaskHandler<TPayload = unknown, TResult = unknown> = (
  payload: TPayload,
) => Promise<TResult> | TResult;

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

export type RuntimeTaskResponse<TResult = unknown> =
  | RuntimeTaskResult<TResult>
  | RuntimeTaskFailure;

export class RuntimeTaskRegistry {
  private readonly handlers = new Map<string, RuntimeTaskHandler>();

  public register<TPayload, TResult>(
    taskName: string,
    handler: RuntimeTaskHandler<TPayload, TResult>,
  ): void {
    this.handlers.set(taskName, handler as RuntimeTaskHandler);
  }

  public has(taskName: string): boolean {
    return this.handlers.has(taskName);
  }

  public async run<TPayload, TResult>(
    taskName: string,
    payload: TPayload,
  ): Promise<TResult> {
    const handler = this.handlers.get(taskName);
    if (!handler) {
      throw new Error(`No runtime task registered for ${taskName}`);
    }

    return (await handler(payload)) as TResult;
  }
}

export async function executeTaskRequest<TPayload, TResult>(
  registry: RuntimeTaskRegistry,
  request: RuntimeTaskRequest<TPayload>,
): Promise<RuntimeTaskResponse<TResult>> {
  try {
    const result = await registry.run<TPayload, TResult>(
      request.taskName,
      request.payload,
    );
    return {
      id: request.id,
      ok: true,
      result,
    };
  } catch (error) {
    return {
      id: request.id,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
