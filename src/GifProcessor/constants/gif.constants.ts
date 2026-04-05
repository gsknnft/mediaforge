import { QualityPresets, GifConstants } from '../types/gif.types';

const CONSTANTS: GifConstants = {
  MAX_CANVAS_SIZE: 2800,
  WORKING_SIZE: 800,
  NFT_SIZE: 2800,
  POOL_SIZE: 15,
  CANVAS_PER_SIZE: 5,
  MEMORY_LIMIT: 800 * 1024 * 1024,
  QUALITY: 1,
  BATCH_SIZE: 5,
  MEMORY_THRESHOLD: 0.8,
  SCALE_DOWN_FACTOR: 0.5,
  MAX_WORKERS: Math.ceil(navigator.hardwareConcurrency || 6),
  TARGET_SIZE: 800,
  MIN_SIZE: 400,
  DITHER: false,
  DELAY: 100,
  WORKER_PATH: '/gif.worker.js',
  MAX_FRAME_SIZE: 4096,
  MAX_FRAME_COUNT: 300
} as const;

const QUALITY_PRESETS: QualityPresets = {
  LOW: {
    quality: 10,
    dither: false,
    frameSkip: 2,
    colors: 128,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: true,
    blendMode: 'source-over',
    colorEnhancement: {
      red: 0.8,
      green: 0.8,
      blue: 0.8
    }
  },
  MEDIUM: {
    quality: 5,
    dither: 'FloydSteinberg',
    frameSkip: 1,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: true,
    blendMode: 'source-over',
    colorEnhancement: {
      red: 1.1,
      green: 1.1,
      blue: 1.1
    }
  },
  HIGH: {
    quality: 1,
    //dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 220, // Increased from 220 for better transparency handling
    //smoothing: true,
    //blendMode: 'source-over',
    //disposalMethod: 2, // Clear frame before drawing next
    // colorQuantization: {
    //   method: 'neuquant',
    //   colors: 256
    // },
    // transparencyMode: 'preserve',
    // frameCompositing: 'blend'
  },
  FIRE: {
    quality: 1,
    dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 220,
    smoothing: true,
    blendMode: 'screen',
    colorEnhancement: {
      red: 1.2,
      green: 0.9,
      blue: 0.8,
      alpha: 1.2
    },
  },
  PIXEL: {
    quality: 1,
    dither: false,            // No dithering to preserve clean pixel edges
    frameSkip: 0,             // Process all frames
    colors: 256,              // Preserve original colors
    preserveAlpha: true,      // Maintain transparency
    alphaThreshold: 128,      // Minimum alpha value for transparency
    smoothing: false,         // Disable anti-aliasing
    blendMode: 'copy',        // Directly copy frames without blending
    disposalMethod: 1,        // Clear to background between frames
    synchronizeFrames: true,  // Synchronize frame timings
    pixelSnapping: true,      // Align pixels to the grid
    colorQuantization: {
      method: 'octree',       // Use octree for better color accuracy
      colors: 256
    }
  },
  HIGHRES: {
    quality: 1,
    dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: true,
    blendMode: 'source-over',
    disposalMethod: 2,
    synchronizeFrames: true,
    colorQuantization: {
      method: 'neuquant',
      colors: 256
    },
    transparencyMode: 'precise',
    frameCompositing: 'replace'
  },
  HIGHRESPIXEL: {
    quality: 1,
    dither: false,
    frameSkip: 0,
    colors: 256,
    preserveAlpha: true,
    alphaThreshold: 128,
    smoothing: false,      // Keep pixel sharpness
    blendMode: 'copy',
    disposalMethod: 2,
    synchronizeFrames: true,
    pixelSnapping: true,
    colorQuantization: {
      method: 'neuquant',
      colors: 256
    },
    transparencyMode: 'precise',
    frameCompositing: 'replace'
  }
} as const;

export { CONSTANTS, QUALITY_PRESETS };