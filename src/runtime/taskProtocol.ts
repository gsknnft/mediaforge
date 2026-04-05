export type RuntimeTaskHandler<TPayload = unknown, TResult = unknown> = (
  payload: TPayload,
) => Promise<TResult> | TResult;

const INVALID_REQUEST_ID = "invalid-request";

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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getRequestId(request: unknown): string {
  if (isRecord(request) && isNonEmptyString(request.id)) {
    return request.id;
  }

  return INVALID_REQUEST_ID;
}

function assertValidTaskRequest<TPayload>(
  request: unknown,
): asserts request is RuntimeTaskRequest<TPayload> {
  if (!isRecord(request)) {
    throw new Error("Runtime task request must be an object");
  }

  if (!isNonEmptyString(request.id)) {
    throw new Error("Runtime task request id must be a non-empty string");
  }

  if (!isNonEmptyString(request.taskName)) {
    throw new Error("Runtime task request taskName must be a non-empty string");
  }

  if (!("payload" in request)) {
    throw new Error("Runtime task request payload must be present");
  }
}

export class RuntimeTaskRegistry {
  private readonly handlers = new Map<string, RuntimeTaskHandler>();

  public register<TPayload, TResult>(
    taskName: string,
    handler: RuntimeTaskHandler<TPayload, TResult>,
  ): void {
    if (!isNonEmptyString(taskName)) {
      throw new Error("Runtime task name must be a non-empty string");
    }

    if (typeof handler !== "function") {
      throw new Error(
        `Runtime task handler for ${taskName} must be a function`,
      );
    }

    if (this.handlers.has(taskName)) {
      throw new Error(`Runtime task ${taskName} is already registered`);
    }

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
  request: unknown,
): Promise<RuntimeTaskResponse<TResult>> {
  try {
    assertValidTaskRequest<TPayload>(request);
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
      id: getRequestId(request),
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
