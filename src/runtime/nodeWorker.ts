import { parentPort } from "node:worker_threads";

import {
  RuntimeTaskRegistry,
  executeTaskRequest,
  type RuntimeTaskRequest,
} from "./taskProtocol";
import { registerScanForgePreprocessTasks } from "../tasks";

const registry = new RuntimeTaskRegistry();
registerScanForgePreprocessTasks(registry);

parentPort?.on("message", async (request: RuntimeTaskRequest) => {
  const response = await executeTaskRequest(registry, request);
  parentPort?.postMessage(response);
});
