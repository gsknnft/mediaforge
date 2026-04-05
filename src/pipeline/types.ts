export type MediaSourceKind = "gif" | "image" | "video";

export interface TimelineFrame {
  index: number;
  timestampMs: number;
  durationMs: number;
  width: number;
  height: number;
  imageData: ImageData;
  preprocess?: TimelineFramePreprocessMeta;
}

export interface TimelineAnchorPoint {
  x: number;
  y: number;
  confidence?: number;
  label?: string;
}

export interface TimelineBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence?: number;
}

export interface TimelineFramePreprocessMeta {
  anchor?: TimelineAnchorPoint;
  subjectBox?: TimelineBoundingBox;
  alphaMask?: Uint8ClampedArray;
  qualityScore?: number;
  diagnostics?: Record<string, unknown>;
}

export interface TimelineClip {
  name: string;
  startFrame: number;
  endFrame: number;
}

export interface MediaTimeline {
  id: string;
  sourceKind: MediaSourceKind;
  fps: number;
  durationMs: number;
  width: number;
  height: number;
  frames: TimelineFrame[];
  clips: TimelineClip[];
}

export interface VideoExtractOptions {
  src: string;
  fps?: number;
  startMs?: number;
  endMs?: number;
  maxFrames?: number;
  crossOrigin?: "anonymous" | "use-credentials";
}

export interface AtlasExportOptions {
  clipName?: string;
  framePadding?: number;
  maxAtlasWidth?: number;
  maxAtlasHeight?: number;
  frameScale?: number;
  frameStride?: number;
  maxFrames?: number;
  fitMode?: "contain" | "cover" | "stretch";
  targetFrameWidth?: number;
  targetFrameHeight?: number;
  backgroundFill?: string;
  imageType?: "image/png" | "image/webp";
  imageQuality?: number;
}

export interface AtlasFrameMeta {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  durationMs: number;
  timestampMs: number;
}

export interface AtlasManifest {
  version: string;
  frameCount: number;
  atlasWidth: number;
  atlasHeight: number;
  frameWidth: number;
  frameHeight: number;
  framePadding: number;
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  clips: TimelineClip[];
  frames: AtlasFrameMeta[];
}

export interface AtlasExportResult {
  imageBlob: Blob;
  manifest: AtlasManifest;
}

export type VeraExpressionHint =
  | "normal"
  | "focused"
  | "tired"
  | "alarmed"
  | "sleeping"
  | "offline";

export type VeraClipName = "idle" | "walk" | "blink" | "react";

export interface NamedClipRange {
  name: string;
  startFrame: number;
  endFrame: number;
}

export interface NamedClipPlanOptions {
  minClipFrames?: number;
  clips?: Partial<Record<VeraClipName, Partial<NamedClipRange>>>;
}

export interface VeraShellSpriteSheetConfig {
  type: "sheet";
  url: string;
  cellWidth: number;
  cellHeight: number;
  frames: Partial<Record<VeraExpressionHint, [number, number]>>;
}

export interface VeraShellClipMeta {
  name: string;
  startFrame: number;
  endFrame: number;
  durationMs: number;
}

export interface VeraShellAtlasManifest {
  schema: "vera-shell.sprite-sheet.v1";
  timelineId: string;
  atlas: AtlasManifest;
  sprite: VeraShellSpriteSheetConfig;
  clips: VeraShellClipMeta[];
}

export interface VeraShellExportOptions extends AtlasExportOptions {
  atlasUrl: string;
  clipToExpression?: Partial<Record<VeraExpressionHint, string>>;
  pixelMatrix?: PixelMatrixExportOptions;
  preprocess?: TimelinePreprocessOptions;
}

export interface VeraShellExportResult extends AtlasExportResult {
  veraShellManifest: VeraShellAtlasManifest;
  pixelMatrix?: PixelMatrixExportResult;
  preprocess?: TimelinePreprocessReport;
}

export type TimelinePreprocessStageId =
  | "align-anchor"
  | "segment-foreground"
  | "stabilize-mask"
  | "center-canvas"
  | "custom";

export interface TimelinePreprocessStageContext {
  stageId: TimelinePreprocessStageId;
  frameIndex: number;
  frameCount: number;
  timeline: MediaTimeline;
}

export interface TimelinePreprocessStageResult {
  imageData?: ImageData;
  width?: number;
  height?: number;
  preprocess?: Partial<TimelineFramePreprocessMeta>;
}

export type TimelinePreprocessStageFn = (
  frame: TimelineFrame,
  context: TimelinePreprocessStageContext,
) =>
  | Promise<TimelinePreprocessStageResult | void>
  | TimelinePreprocessStageResult
  | void;

export interface TimelinePreprocessStage {
  id: TimelinePreprocessStageId;
  run: TimelinePreprocessStageFn;
}

export interface TimelinePreprocessOptions {
  enabled?: boolean;
  stages?: TimelinePreprocessStage[];
}

export interface TimelinePreprocessReport {
  enabled: boolean;
  stagesRun: TimelinePreprocessStageId[];
  frameCount: number;
}

export type RgbColor = [number, number, number];

export interface FlatBackgroundPreprocessOptions {
  targetWidth: number;
  targetHeight: number;
  keyColor?: RgbColor;
  keyTolerance?: number;
  alphaThreshold?: number;
  featherRadius?: number;
  keepFrameSize?: boolean;
}

export type PixelMatrixMode = "alpha-mask" | "grayscale" | "binary";
export type PixelMatrixOutputFormat = "matrix" | "bit-packed" | "both";

export interface PixelMatrixFrame {
  index: number;
  width: number;
  height: number;
  timestampMs: number;
  durationMs: number;
  pixels: number[][];
}

export interface PixelMatrixExportOptions {
  enabled?: boolean;
  mode?: PixelMatrixMode;
  outputFormat?: PixelMatrixOutputFormat;
  threshold?: number;
  frameIndexes?: number[];
  maxFrames?: number;
  frameStride?: number;
  constPrefix?: string;
  includeMetadataConst?: boolean;
}

export interface PixelMatrixPackedFrame {
  index: number;
  width: number;
  height: number;
  timestampMs: number;
  durationMs: number;
  bitLength: number;
  bytes: Uint8Array;
}

export interface PixelMatrixEmittedFile {
  fileName: string;
  content: string;
  format: PixelMatrixOutputFormat;
  clipName?: string;
  frameCount: number;
}

export interface PixelMatrixFileEmitterOptions {
  baseFileName?: string;
  splitByClip?: boolean;
  includeIndexFile?: boolean;
}

export interface PixelMatrixExportResult {
  format: PixelMatrixOutputFormat;
  constModule: string;
  frames: PixelMatrixFrame[];
  packedFrames?: PixelMatrixPackedFrame[];
  matrixModule?: string;
  packedModule?: string;
}
