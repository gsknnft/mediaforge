export { AssetLoader, getAssetLoader } from "./assets/services/AssetLoader";
export {
  AssetRegistry,
  getAssetRegistry,
} from "./assets/services/AssetRegistry";
export const MEDIAFORGE_BROWSER_CAPABILITIES = Object.freeze({
  assets: true,
  decoder: true,
  gifExtensions: true,
  gifProcessing: true,
  pipeline: true,
  runtimeTasks: true,
  scanforgePreprocess: true,
  utils: true,
  browserWorkerEntry: "@gsknnft/mediaforge/browser-worker",
});

export * from "./types";

export {
  BitReader,
  CodeTable,
  GifExtension,
  GifFrame,
  GifImage,
  read,
  useGifDecoder,
} from "./decoder";

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

export { GIFExtension, Giffyness } from "./GifExtension";
export { getGifProcessor, GIFProcessor } from "./GifProcessor";
export type { IGifProcessor } from "./GifProcessor";
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

export {
  autoCompressGIF,
  compressGIFWithSettings,
  downloadBlob,
  fileDataToImage,
  PixelGifScaler,
  RetryHandler,
  selectFileAndCompress,
} from "./utils";
