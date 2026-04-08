// File: @/types/index.ts
import {
  ParsedFrame,
  ParsedGif,
  ParsedFrameWithoutPatch,
  Frame,
} from "gifuct-js";

export type Environment = "development" | "staging" | "production";

export interface VisualSummaryV1 {
  schemaVersion: "1.0";
  sourceImage: {
    width: number;
    height: number;
    aspectRatio: number;
    alphaCoverage: number | null;
    occupiedBounds: [number, number, number, number] | null;
  };
  palette: {
    dominantColor: string | null;
    accentColor: string | null;
    optionalTopColors?: string[] | null;
  };
  structure: {
    occupancyRows?: number[] | null;
    silhouetteComplexity?: number | null;
    symmetryHints?: string[] | null;
    edgeDensity?: number | null;
  };
  segmentation: {
    segmentCount?: number | null;
    largestSegmentRatio?: number | null;
    depthProxyStats?: {
      mean: number;
      variance: number;
    } | null;
  };
  featureHints: {
    tags: string[];
  };
  confidence: Record<string, number | null>;
  provenance: Record<string, string>;
}

type GIFTYPES = [
  "LOW",
  "MEDIUM",
  "HIGH",
  "FIRE",
  "PIXEL",
  "HIGHRES",
  "HIGHRESPIXEL",
];
type QualityPresetKey =
  | "LOW"
  | "MEDIUM"
  | "HIGH"
  | "FIRE"
  | "PIXEL"
  | "HIGHRES"
  | "HIGHRESPIXEL";
type QualityPresets = Record<QualityPresetKey, QualityPresetExtension>;

export type AssetType = "images" | "models" | "animations" | "textures";
export type AssetFormat = "png" | "jpg" | "gif" | "webp" | "glb" | "gltf";
export type AssetAccess = "public" | "private" | "protected";
export type AssetStatus = "pending" | "loading" | "loaded" | "error" | "cached";

export type AssetCategory = "backgrounds" | "overlays" | "traits";
export type AssetCat = "background" | "overlay" | "avatar" | "special" | AssetCategory;
export type AssetCategories = "All" | AssetCategory;
export type specialCategory = "Frames";
export type OverlayCategory =
  | "Special Effects"
  | "Borders"
  | "Clothes"
  | "Head"
  | "Accessories";
export type BackgroundCategory =
  | "Animated"
  | "Static"
  | "Pixel Art"
  | "Special";
export type OverlayCategories = "All" | OverlayCategory;
export type BackgroundCategories = "All" | BackgroundCategory;

export type AssetEnvironmentConfig = Record<
  Environment,
  {
    baseUrl: string;
    cdnUrl?: string;
    cacheDuration: number;
    compression: boolean;
  }
>;

export interface AssetPaths {
  [key: string]: {
    [subKey: string]: string;
  };
}

export interface AssetDimensions {
  width: number;
  height: number;
  aspectRatio?: number;
}

export interface AssetValidation {
  isValid: boolean;
  message: string;
  maxSize: number;
  allowedFormats: AssetFormat[];
  requiredDimensions?: AssetDimensions;
  allowCompression: boolean;
}

export interface AssetBase extends HTMLImageElement {
  name: string;
  url: string;
  format: AssetFormat;
  type: AssetCat;
  category: AssetCategory;
  fileName: string;
  path: string;
  dims?: AssetDimensions;
  size?: number;
}

export interface AssetMetadata {
  id: string;
  name: string;
  format: AssetFormat;
  type: AssetCat;
  category: AssetCategory;
  path: string;
  url: string;
  fileName: string;
  source?: "registry" | "api";
  cdnUrl?: string;
  version: string;
  etag: string;
  lastModified: number;
}

export interface AssetConfig extends AssetMetadata {
  access: AssetAccess;
  validation?: AssetValidation;
  status?: AssetStatus;
  tags?: string[];
  hash?: string;
  environment?: Environment;
  cacheDuration?: number;
  maxSize?: number;
  allowedFormats?: string[];
  compress?: boolean;
  allowedTokenIds?: number[];
  blendMode?: string;
  opacity?: number;
  disallowedTokenIds?: number[]; // Specific tokens that cannot use this asset
}

export interface BackgroundAssets {
  [key: string]: BackgroundAsset;
}

export interface BackgroundAsset extends AssetConfig {
  bgCategory: BackgroundCategory;
  allowedIds?: number[];
}

export interface SpecialAsset extends AssetConfig {
  specialCategory: string;
}

export interface OverlayAsset extends AssetConfig {
  overlayCategory: OverlayCategory;
  attribute: string;
  disAllowedTraits: { [key: string]: string[] };
  traits: { [key: string]: string[] };
}

export interface LoaderOptions {
  cache?: boolean;
  priority?: "high" | "medium" | "low";
  timeout?: number;
  retries?: number;
  validation?: Partial<AssetValidation>;
  environment?: Environment;
}

export interface AssetError extends Error {
  code: string;
  context: {
    assetId: string;
    environment: Environment;
    attempt: number;
    timestamp: number;
  };
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AssetAPIResponse extends APIResponse {
  data?: {
    asset: Buffer;
    metadata: AssetMetadata;
  };
}

export interface AssetLoadRequest {
  id: string;
  type: AssetType;
  category: string;
  options?: LoaderOptions;
}

export interface GifFrameData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  delay: number;
  disposalMethod: number;
  transparencyIndex: number | null;
}

interface GifConstants {
  MAX_CANVAS_SIZE: number;
  WORKING_SIZE: number;
  NFT_SIZE: number;
  POOL_SIZE: number;
  CANVAS_PER_SIZE: number;
  MEMORY_LIMIT: number;
  QUALITY: number;
  BATCH_SIZE: number;
  MEMORY_THRESHOLD: number;
  SCALE_DOWN_FACTOR: number;
  MAX_WORKERS: number;
  TARGET_SIZE: number;
  MIN_SIZE: number;
  DITHER: boolean;
  DELAY: number;
  WORKER_PATH: string;
  MAX_FRAME_SIZE: number;
  MAX_FRAME_COUNT: number;
}

interface QualityPreset {
  quality: number;
  dither?: boolean | string;
  frameSkip: number;
  colors: number;
  preserveAlpha?: boolean;
  alphaThreshold?: number;
  smoothing?: boolean;
  blendMode?: string;
  colorEnhancement?: {
    red?: number;
    green?: number;
    blue?: number;
    alpha?: number;
  };
}

interface QualityPresetExtension extends QualityPreset {
  transparencyMode?: string;
  frameCompositing?: string;
  preserveTransparency?: boolean;
  disposalMethod?: number; // Clear frame before drawing next
  synchronizeFrames?: boolean;
  pixelSnapping?: boolean;
  colorQuantization?: {
    method: string;
    colors: number;
  };
}

interface GIFMetadata {
  width: number;
  height: number;
  frames: number;
  isPixelArt: boolean;
  hasTransparency: boolean;
  colorDepth: number;
  frameExtras: {
    frameDelays: number[];
    individualFrameSizes: { width: number; height: number }[];
    frameDisposal: number[];
    transparentIndex: number[];
    framePatch: Set<number>[];
    frameColors: Set<number>[];
    framePixels: number[][];
  };
  gifExtras: {
    gifSignature: string;
    gifVersion: string;
    backgroundColorIndex: number;
    sort: boolean;
    globalColorTable: number[][];
    globalPalette: number;
    resolution: number;
    pixelAspectRatio: number;
    globalPaletteDepth: number;
  };
}

interface GifOptions extends Record<string, any> {
  optimizeFrames?: boolean;
  disposeToBackground?: boolean;
  useLocalPalette?: boolean;
}

interface ProcessedFrame {
  bitmap: ImageBitmap;
  originalFrame: ParsedFrame;
}
// Add these helper methods near the top of the class
interface PixelArtMetrics extends ParsedFrame {
  colors: number;
  uniqueColors: number;
  totalPixels: number;
  uniqueRatio: number;
  disposalType: number;
  isPixelArt: boolean;
  hasTransparency: boolean;
  needsDisposal: boolean;
}

// Add this new interface near the top
interface FrameDimensions {
  width: number;
  height: number;
  scale: number;
  offsetX: number;
  offsetY: number;
}

interface PixelArtSettings {
  colorEnhancement: {
    red: number;
    green: number;
    blue: number;
    alpha: number;
  };
  blendMode: string;
  smoothing: boolean;
  pixelSnapping: boolean;
  colorQuantization: {
    method: string;
    colors: number;
  };
  scalingMethod: "nearest-neighbor" | "pixelated" | "crisp-edges";
  maxScale: number;
  preservePixelRatio: boolean;
  minimumPixelSize: number;
}

// Add these new interfaces
interface MemoryStrategy {
  maxMemoryUsage: number;
  batchSize: number;
  workerCount: number;
  cleanupThreshold: number;
}

interface QualityOptions {
  forceQuality?: QualityPresetKey;
  allowAutoDetect: boolean;
  memoryAware: boolean;
}

interface FrameSizeMetadata {
  maxWidth: number;
  maxHeight: number;
  minWidth: number;
  minHeight: number;
  hasVariableSizes: boolean;
  aspectRatios: number[];
  targetSize: {
    width: number;
    height: number;
    scale: number;
  };
}

export interface IImageAnalyzer {
  analyzeImage(buffer: ArrayBuffer): Promise<ImageAnalysis>;
  profileForScanForge(
    buffer: ArrayBuffer,
    filename: string,
  ): Promise<ScanForgeImageProfile>;
}

export type ScanForgeImageProfile = {
  filename: string;
  bytes: number;
  style:
    | "pixel-art"
    | "flat-icon"
    | "generated-export"
    | "photograph"
    | "illustrated-asset"
    | "unknown";
  origin:
    | "dependency-asset"
    | "build-artifact"
    | "test-fixture"
    | "source-asset"
    | "unknown";
  deletionRisk: "low" | "medium" | "high";
  analysis: ImageAnalysis;
  notes: string[];
};

export type ConfidenceAnalytics = {
  originConfidence: number;
  styleConfidence: number;
  riskConfidence: number;
};

export type ImageAnalysis = {
  isPixelArt: boolean;
  isAnimated: boolean;
  hasTransparency: boolean;
  hasPartialTransparency: boolean;
  uniqueColorCount: number;
  colorDensityRatio: number;
  sharpEdgeRatio?: number;
  dominantColors?: Array<{
    r: number;
    g: number;
    b: number;
    frequency: number;
  }>;
  isFireLike?: boolean;
  isHighRes: boolean;
  hasVariableFrameSizes?: boolean;

  scanforgeQa?: {
    consistentScale?: boolean;
    consistentCenter?: boolean;
    consistentAlpha?: boolean;
    overlapScore?: number;
    confidenceAnalytics?: ConfidenceAnalytics;
  };
};
export type {
  // Gifuct types Centralized Export
  ParsedFrame,
  ParsedGif,
  ParsedFrameWithoutPatch,
  Frame,

  // GifProcessor types
  QualityPreset,
  QualityPresetExtension,
  QualityPresetKey,
  QualityPresets,
  GifOptions,
  GifConstants,
  GIFTYPES,
  GIFMetadata,
  ProcessedFrame,
  PixelArtMetrics,
  FrameDimensions,
  PixelArtSettings,
  MemoryStrategy,
  QualityOptions,
  FrameSizeMetadata,
};
