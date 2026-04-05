import { ParsedFrame, ParsedGif, ParsedFrameWithoutPatch, Frame } from 'gifuct-js';

type GIFTYPES = ['LOW', 'MEDIUM', 'HIGH', 'FIRE', 'PIXEL', 'HIGHRES', 'HIGHRESPIXEL'];
type QualityPresetKey = 'LOW' | 'MEDIUM' | 'HIGH' | 'FIRE' | 'PIXEL' | 'HIGHRES' | 'HIGHRESPIXEL';
type QualityPresets = Record<QualityPresetKey, QualityPresetExtension>;

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
  alphaThreshold?: number,
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
  disposalMethod?: number, // Clear frame before drawing next
  synchronizeFrames?: boolean,
  pixelSnapping?: boolean,
  colorQuantization?: {
    method: string,
    colors: number
  }
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
      individualFrameSizes: {width: number, height: number}[];
      frameDisposal: number[];
      transparentIndex: number[];
      framePatch: Set<number>[];
      frameColors: Set<number>[];
      framePixels: number[][],
    }
    gifExtras: {
      gifSignature: string;
      gifVersion: string;
      backgroundColorIndex: number;
      sort: boolean,
      globalColorTable: number[][];
      globalPalette: number;
      resolution: number;
      pixelAspectRatio: number;
      globalPaletteDepth: number;
    }
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
    interface PixelArtMetrics extends ParsedFrame{
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
  scalingMethod: 'nearest-neighbor' | 'pixelated' | 'crisp-edges';
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
    FrameSizeMetadata
};
