export type Environment = "development" | "staging" | "production";

export type AssetType = "images" | "models" | "animations" | "textures";
export type AssetFormat = "png" | "jpg" | "gif" | "webp" | "glb" | "gltf";
export type AssetAccess = "public" | "private" | "protected";
export type AssetStatus = "pending" | "loading" | "loaded" | "error" | "cached";

export type AssetCategory = "backgrounds" | "overlays" | "traits";
export type AssetCategories = "All" | AssetCategory;
export type specialCategory = "Frames";
export type OverlayCategories = "All" | OverlayCategory;
export type BackgroundCategories = "All" | BackgroundCategory;

export type BackgroundCategory =
  | "Animated"
  | "Static"
  | "Pixel Art"
  | "Special";

// Enhanced type definitions
export type OverlayCategory =
  | "Special Effects"
  | "Borders"
  | "Frames"
  | "Clothes"
  | "Head"
  | "Body"
  | "Eyes"
  | "Extra"
  | "Accessories"
  | "All";

export type OVCategories = OverlayCategory | "All";
export type OverlayTraits = Record<string, string[]>; // e.g., { Clothes: ['Puffer', 'DadBod'] }
export type BGCategories = BackgroundCategory | "All";

export interface ImageVals {
  name: string;
  url: string;
  value: string;
  dims?: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
  };
}

export interface EnhancedImageVals extends ImageVals {
  category?: BackgroundCategory | OverlayCategory;
  tags?: string[];
}

export interface Overlay extends EnhancedImageVals {
  attribute: string;
  disAllowedTraits: { [key: string]: string[] };
}

export interface EnhancedOverlay extends Overlay {
  compatibilityRules?: {
    required?: OverlayTraits;
    forbidden?: OverlayTraits;
  };
}

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
  url: string;
  format: AssetFormat;
  category: AssetCategory;
  fileName: string;
  path: string;
  dims?: AssetDimensions;
  size?: number;
}

export interface AssetMetadata extends AssetBase {
  type:
    | HTMLImageElement["nodeName"]
    | HTMLVideoElement["nodeName"]
    | HTMLCanvasElement["nodeName"];
  category: AssetCategory;
  source?: "registry" | "api";
  cdnUrl?: string;
  version: string;
  etag: string;
  lastModified: number;
}

export interface Asset extends AssetMetadata {
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

export interface BackgroundAsset extends Asset {
  bgCategory: BackgroundCategory;
  allowedIds?: number[];
}

export interface SpecialAsset extends Asset {
  specialCategory: string;
}

export interface OverlayAsset extends Asset {
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
