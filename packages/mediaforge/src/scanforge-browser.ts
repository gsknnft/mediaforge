export const MEDIAFORGE_SCANFORGE_BROWSER_CAPABILITIES = Object.freeze({
  runtimeTasks: true,
  scanforgePreprocess: true,
  pipeline: true,
  gifProcessing: false,
  decoder: false,
  assets: false,
  browserWorkerEntry: "@gsknnft/mediaforge/browser-worker",
});

export {
  BrowserTaskAdapter,
  executeTaskRequest,
  RuntimeTaskRegistry,
  WorkerPool,
  type RuntimeTaskFailure,
  type RuntimeTaskHandler,
  type RuntimeTaskRequest,
  type RuntimeTaskResponse,
  type RuntimeTaskResult,
  type WorkerPoolStats,
} from "./runtime";

export {
  alignImage,
  alignImageSet,
  generatePreview,
  registerScanForgePreprocessTasks,
  SCANFORGE_PREPROCESS_TASKS,
  splitMatrix,
  type ImageAlignSetTaskInput,
  type ImageAlignSetTaskResult,
  type ImageAlignTaskInput,
  type ImageAlignTaskResult,
  type MatrixSplitCell,
  type MatrixSplitTaskInput,
  type MatrixSplitTaskResult,
  type PreviewGenerateTaskInput,
  type PreviewGenerateTaskResult,
  type SerializableImageData,
} from "./tasks";

export {
  CutEngine,
  NamedClipPlanner,
  PixelMatrixExporter,
  PixelMatrixFileEmitter,
  SpriteAtlasExporter,
  TimelineBuilder,
  VeraShellExporter,
  VideoFrameExtractor,
  type MediaTimeline,
  type TimelineClip,
  type TimelineFrame,
  type VideoExtractOptions,
} from "./pipeline";
