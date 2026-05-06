// Server-safe node entry — deliberately does NOT re-export core.ts because
// core pulls in the browser pipeline (React hooks, canvas pipelines, etc.)
// which explodes in a plain Node.js / Express context.

// Analyzers
export { ServerImageAnalyzer } from "./analyzers/ServerImageAnalyzer";
export { GifAnalyzer } from "./analyzers/GifAnalyzer";
export { QualityAnalyzer } from "./analyzers/QualityAnalyzer";
export { NodeImageAnalyzer } from "./analyzers/NodeImageAnalyzer";
export { BaseImageAnalyzer } from "./analyzers/BaseImageAnalyzer";

// Managers
export { QualityManager } from "./managers/QualityManager";
export { ArtManager } from "./managers/ArtManager";
export { imageManager, ImageManager } from "./managers/ImageManager";
export { ProgressManager } from "./managers/ProgressManager";
export { WorkerManager } from "./managers/WorkerManager";

// Types
export * from "./types";

// Runtime
export { NodeWorkerThreadsAdapter } from "./runtime/NodeWorkerThreadsAdapter";

// ScanForge Studio contract
export {
  buildScanForgeProviderRunSheet,
  createMemoryScanForgeStudioProvider,
  planScanForgeArtifactRetention,
  registerScanForgeStudioProviderTasks,
  SCANFORGE_STUDIO_TASKS,
  type ScanForgeArtifact,
  type ScanForgeGenerateInput,
  type ScanForgeGenerateOptions,
  type ScanForgeInputAsset,
  type ScanForgeJobStatus,
  type ScanForgeProviderId,
  type ScanForgeProviderRunSheet,
  type ScanForgeRetentionPlanEntry,
  type ScanForgeStudioJob,
  type ScanForgeStudioProvider,
  type ScanForgeStudioResult,
  type ScanForgeTopologyMetrics,
} from "./scanforgeStudio";
