import assert from "node:assert/strict";
import test from "node:test";

import {
  RuntimeTaskRegistry,
  executeTaskRequest,
} from "../../src/runtime/taskProtocol";

test("executeTaskRequest runs registered tasks", async () => {
  const registry = new RuntimeTaskRegistry();
  registry.register(
    "math.add",
    ({ left, right }: { left: number; right: number }) => {
      return left + right;
    },
  );

  const response = await executeTaskRequest<
    { left: number; right: number },
    number
  >(registry, {
    id: "req-1",
    taskName: "math.add",
    payload: { left: 2, right: 3 },
  });

  assert.deepEqual(response, {
    id: "req-1",
    ok: true,
    result: 5,
  });
});

test("executeTaskRequest rejects malformed requests with a stable fallback id", async () => {
  const response = await executeTaskRequest(
    new RuntimeTaskRegistry(),
    "bad-request",
  );

  assert.equal(response.id, "invalid-request");
  assert.equal(response.ok, false);
  assert.match(response.error, /must be an object/i);
});

test("executeTaskRequest preserves request id when the request shape is invalid", async () => {
  const response = await executeTaskRequest(new RuntimeTaskRegistry(), {
    id: "req-2",
    payload: {},
  });

  assert.equal(response.id, "req-2");
  assert.equal(response.ok, false);
  assert.match(response.error, /taskName must be a non-empty string/i);
});

test("executeTaskRequest rejects object-shaped requests that omit payload", async () => {
  const response = await executeTaskRequest(new RuntimeTaskRegistry(), {
    id: "req-3",
    taskName: "math.add",
  });

  assert.equal(response.id, "req-3");
  assert.equal(response.ok, false);
  assert.match(response.error, /payload must be present/i);
});

test("RuntimeTaskRegistry rejects duplicate registrations", () => {
  const registry = new RuntimeTaskRegistry();
  const handler = () => "ok";

  registry.register("duplicate.task", handler);

  assert.throws(() => registry.register("duplicate.task", handler), {
    message: "Runtime task duplicate.task is already registered",
  });
});
