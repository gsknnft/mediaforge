import {
  RuntimeTaskRegistry,
  executeTaskRequest,
  type RuntimeTaskRequest,
} from "./taskProtocol";
import { registerScanForgePreprocessTasks } from "../tasks";

const registry = new RuntimeTaskRegistry();
registerScanForgePreprocessTasks(registry);

self.onmessage = async (event: MessageEvent<RuntimeTaskRequest>) => {
  const response = await executeTaskRequest(registry, event.data);
  self.postMessage(response);
};
