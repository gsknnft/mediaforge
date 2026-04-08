//import { StaticCanvas } from 'fabric';
//import {Phase} from '.../ProgressBar';
//import Pool from 'workerpool/types/Pool';
//import { generateGIF } from '../components/shared/composables/gif';
//import {gifProcessingFunctions} from '.../utils/myWorker';
//import {RobustWorkerPool} from '.../pools/RobustWorkerPool';

import { gifAnalyzer } from "../analyzers/GifAnalyzer";
import { QualityAnalyzer } from "../analyzers/QualityAnalyzer";
import { CONSTANTS, QUALITY_PRESETS } from "../constants/gif.constants";
import FrameProcessor from "../handlers/FrameProcessor";
import { PixelArtHandler } from "../handlers";
import {ImageManager, imageManager} from "../managers";
import MemoryManager from "../managers/MemoryManager";
import ProgressManager from "../managers/ProgressManager";
import QualityManager from "../managers/QualityManager";
import { SessionManager } from "../managers/SessionManager";
import { WorkerManager } from "../managers/WorkerManager";
import { CanvasPool, WorkerPool } from "../runtime";
import ImageProcessingService from "../services/ImageProcessingServicev1";
import { GIF_PHASES, GIFProgressTracker } from "../trackers/GIFProgressTracker";
import {
  GIFMetadata,
  GifOptions,
  OverlayAsset,
  ProcessedFrame,
  QualityOptions,
  QualityPresetKey,
} from "../types";
import { fetchWithRetry } from "../utils/RetryHandler";
import GIF from "gif.js.optimized";
import { decompressFrames, ParsedFrame, parseGIF } from "gifuct-js";

export interface IGifProcessor {
  generateGIF(
    frames: ParsedFrame[],
    bglessUrl: string,
    overlays?: OverlayAsset[],
    quality?: keyof typeof QUALITY_PRESETS,
    options?: GifOptions & Partial<QualityOptions>,
    onError?: (error: Error) => void,
  ): Promise<Blob>;
  extractFrames(gifUrl: string): Promise<ParsedFrame[]>;
  streamGIF(
    gifUrl: string,
    bglessUrl: string,
    overlays?: OverlayAsset[],
    onError?: (error: Error) => void,
  ): Promise<ReadableStream<Uint8Array>>;
}

function getHardwareConcurrency(): number {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }

  return 4;
}

class GIFProcessor implements IGifProcessor {
  private static instance: GIFProcessor | null = null;
  private static sharedWorkerPool: WorkerPool | null = null;
  private static sharedGifWorkerPool: WorkerPool | null = null;
  private static activeInstanceCount = 0;
  private sessionId: string;
  protected readonly CONSTANTS = CONSTANTS;
  protected readonly workerPath: string = CONSTANTS.WORKER_PATH;
  protected readonly workerScript?: string;
  protected imageProcessor: ImageProcessingService;
  protected imgManager: ImageManager;
  protected progTracker: GIFProgressTracker;
  protected pixelArtHandler: PixelArtHandler;
  protected workerManager: WorkerManager;
  protected qualityManager: QualityManager;
  protected memoryManager: MemoryManager;
  protected progManager: ProgressManager;
  protected frameProcessor: FrameProcessor;
  protected sessionManager: SessionManager;
  protected qualityAnalyzer: QualityAnalyzer;
  //private readonly rwp: RobustWorkerPool;
  protected readonly gifWorkerPool: WorkerPool;
  protected readonly workerPool: WorkerPool;

  protected canvas: HTMLCanvasElement;
  //private webWrkr: Worker;
  protected abort: AbortController;
  protected completedPhases: Set<string>;
  protected processedFramesCache: Map<string, ParsedFrame[]>;
  protected canvasPool: CanvasPool;
  protected workerCount: number;
  private isProcessing = false;
  protected processingStartTime: number = 0;
  protected framesProcessed: number = 0;
  protected averageFrameTime: number = 0;
  protected totalFrames: number = 0;
  protected frameStartTime: number = 0;
  protected frameProcessingTimes: number[] = [];
  protected totalFramesCount: number = 0;
  protected processedFramesCount: number = 0;
  protected phaseStartTimes: { [key: string]: number } = {};
  private streamController: ReadableStreamDefaultController<Uint8Array> | null =
    null;

  protected qualityOptions: QualityOptions = {
    allowAutoDetect: true,
    memoryAware: true,
  };

  public static getInstance(poolSize?: number, script?: string): GIFProcessor {
    if (!GIFProcessor.instance) {
      GIFProcessor.instance = new GIFProcessor(poolSize, script);
    }
    return GIFProcessor.instance;
  }

  public static async destroyInstance(): Promise<void> {
    if (GIFProcessor.instance) {
      await GIFProcessor.instance.cleanup();
      GIFProcessor.instance = null;
    }
  }

  constructor(
    poolSize = Math.min(6, getHardwareConcurrency()),
    script?: string,
  ) {
    this.isProcessing = false;
    const isBrowser = typeof window !== "undefined";
    const workerScript = script ?? (isBrowser ? undefined : this.workerPath);
    this.workerScript = workerScript;
    GIFProcessor.activeInstanceCount += 1;

    this.sessionManager = new SessionManager();
    this.sessionId = this.sessionManager.createSession();
    this.workerPool =
      GIFProcessor.sharedWorkerPool ?? new WorkerPool(poolSize, workerScript);
    GIFProcessor.sharedWorkerPool = this.workerPool;

    if (typeof window !== "undefined") {
      console.debug("[GIFProcessor] Worker paths:", {
        requested: workerScript ?? "(inline)",
        current: window.location.pathname,
        full: workerScript
          ? new URL(workerScript, window.location.origin).href
          : "(inline)",
      });
    }
    /*       this.webWrkr = new Worker(this.workerPath);
      this.rwp = new RobustWorkerPool({
        minWorkers: poolSize / 2,
        maxWorkers: poolSize,
        maxQueueSize: 100,
        workerScript: this.workerPath,
        onError: (error) => {
          console.error('Worker initialization error:', error);
        }
      });

      // Verify worker initialization
      if (this.rwp) {
        fetch(this.workerPath)
          .then(response => {
            if (!response.ok) throw new Error(`Worker not found at ${this.workerPath}`);
            console.debug('Worker file verified at:', this.workerPath);
          })
          .catch(error => console.error('Worker file check failed:', error));
      } */
    this.progTracker = new GIFProgressTracker();
    this.progManager = new ProgressManager();
    this.workerManager = new WorkerManager(this.workerPool);
    this.abort = new AbortController();
    this.completedPhases = new Set();
    this.gifWorkerPool =
      GIFProcessor.sharedGifWorkerPool ??
      new WorkerPool(Math.ceil(poolSize / 2), workerScript);
    GIFProcessor.sharedGifWorkerPool = this.gifWorkerPool;
    console.debug("GifWorkerPool initialized:", this.gifWorkerPool.stats);
    this.workerCount = Math.min(getHardwareConcurrency(), poolSize); // Start with fewer workers
    this.memoryManager = new MemoryManager(
      this.sessionId,
      this.progTracker,
      poolSize,
      this.workerPool,
      this.gifWorkerPool,
      this.qualityOptions,
      this.workerCount,
    );
    this.pixelArtHandler = new PixelArtHandler();
    this.qualityManager = new QualityManager();
    this.canvasPool = new CanvasPool(
      CONSTANTS.POOL_SIZE,
      CONSTANTS.CANVAS_PER_SIZE,
      CONSTANTS.MEMORY_LIMIT,
    );

    this.imageProcessor = new ImageProcessingService(
      this.workerCount,
      this.pixelArtHandler,
      gifAnalyzer,
    );

    this.frameProcessor = new FrameProcessor(
      this.pixelArtHandler,
      this.imageProcessor,
      this.canvasPool,
      gifAnalyzer,
      this.workerPool,
      this.workerCount,
    );
    this.imgManager = new ImageManager(
      this.progManager,
      this.workerPool,
      this.canvasPool,
    );
    this.qualityAnalyzer = new QualityAnalyzer(
      this.qualityManager,
      gifAnalyzer,
    );
    this.processedFramesCache = new Map<string, ParsedFrame[]>();
    this.canvas = this.canvasPool.getCanvas(
      CONSTANTS.WORKING_SIZE,
      CONSTANTS.WORKING_SIZE,
    ) as HTMLCanvasElement;
    console.debug(
      "GIFProcessor initialized with pool size:",
      poolSize,
      "Workercount:",
      this.workerCount,
    );
    this.memoryManager.currentMemoryStrategy =
      this.memoryManager.MEMORY_STRATEGIES.MEDIUM;
  }

  private createGIF(
    frames: ProcessedFrame[],
    enhanceColors: boolean = false,
  ): Promise<Blob> {
    if (!frames.length) throw new Error("No frames provided");

    const gifOptions: any = {
      workers: this.workerScript ? this.workerCount : 0,
      quality: 1,
      transparent: null,
      background: null, // Keep background null
      dispose: 2, // Use dispose 2 to properly clear between frames
      dither: false,
      debug: true,
      repeat: 0,
      width: CONSTANTS.TARGET_SIZE,
      height: CONSTANTS.TARGET_SIZE,
    };
    if (this.workerScript) {
      gifOptions.workerScript = this.workerScript;
    }
    const gif = new GIF(gifOptions);

    return new Promise((resolve, reject) => {
      gif.on("progress", (progress: number) => {
        const encodingProgress = Math.round(progress * 100);
        this.progManager.updatePhase(
          GIF_PHASES.ENCODING.id,
          encodingProgress,
          `Encoding: ${encodingProgress}%`,
        );
      });

      gif.on("finished", (blob: Blob) => {
        if (!blob || !blob.size) {
          reject(new Error("Generated GIF is empty"));
          return;
        }
        console.debug("[GIF] Generation complete:", {
          size: `${Math.round(blob.size / 1024)}KB`,
          type: blob.type,
        });

        frames.forEach((frame) => frame.bitmap.close());

        // Reset progress states after successful completion
        this.progManager.resetProgress();
        this.progTracker.completePhase(GIF_PHASES.ENCODING.id);
        resolve(blob);
      });

      gif.on("error", (error: Error) => {
        console.error("[GIF] Encoding error:", error);
        this.progManager.resetProgress();
        reject(error);
      });

      const frameTasks = frames.map((frame) =>
        this.workerPool.addTask(async () => {
          const frameCanvas = document.createElement("canvas");
          frameCanvas.width = CONSTANTS.TARGET_SIZE;
          frameCanvas.height = CONSTANTS.TARGET_SIZE;
          const ctx = frameCanvas.getContext("2d", {
            alpha: true,
            willReadFrequently: true,
          });

          if (ctx) {
            // Clear canvas and set compositing
            ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
            ctx.globalCompositeOperation = "copy";

            // Draw the ImageBitmap directly
            ctx.drawImage(frame.bitmap, 0, 0);

            gif.addFrame(frameCanvas, {
              delay: frame.originalFrame.delay, // Use consistent delay
              dispose: frame.originalFrame.disposalType || 2,
              transparent: true,
            });
          }
        }),
      );

      Promise.all(frameTasks)
        .then(() => {
          // Start rendering only after all frames are queued
          console.debug("[GIF] Starting render...");
          gif.render();
        })
        .catch(reject);
    });
  }

  public async processFramesFromFrameProcessor(
    frames: ParsedFrame[],
    staticImage?: HTMLCanvasElement,
  ): Promise<ProcessedFrame[]> {
    const processedFrames = await this.frameProcessor.processFramesInWorkers(
      frames,
      staticImage,
    );
    return processedFrames;
  }

  public async streamGIF(
    gifUrl: string,
    bglessUrl: string,
    overlays?: OverlayAsset[],
    onError?: (error: Error) => void,
  ): Promise<ReadableStream<Uint8Array>> {
    if (this.isProcessing)
      return Promise.reject(new Error("GIF processing already in progress"));
    this.isProcessing = true;

    try {
      // Step 1: Analyze GIF first
      const { frames, metadata, quality } = await this.analyzeGIF(gifUrl);

      this.memoryManager.validateInput(frames, bglessUrl, overlays);

      const { readable, writable } = new TransformStream<Uint8Array>();
      const writer = writable.getWriter();

      (async () => {
        try {
          const optimizedFrames: ParsedFrame[] = [];
          let processedFrames: ProcessedFrame[];

          const staticImage = await this.imgManager.loadAndCreateStaticImage(
            bglessUrl,
            overlays,
          );

          const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(frames);

          if (metadata.isPixelArt || frameAnalysis.hasVariableSize) {
            // Handle pixel art or variable size frames
            const normalizedFrames = frames.map((frame, i) =>
              this.pixelArtHandler.processPixelArtFrame(
                frame,
                frameAnalysis,
                i,
              ),
            );

            const optimizedFrames = await Promise.all(
              normalizedFrames.map(async (frame) =>
                this.frameProcessor.processFrameOG(
                  await this.imageProcessor.preOptimizeGifFrame(
                    frame,
                    true,
                    "PIXEL",
                  ),
                ),
              ),
            );

            processedFrames = await this.imageProcessor.createImgBitmap(
              optimizedFrames,
              staticImage,
            );
          } else {
            // Handle regular GIFs with consistent frame sizes
            const optimizedFrames = await Promise.all(
              frames.map(async (frame) =>
                this.frameProcessor.processFrameOG(
                  await this.imageProcessor.preOptimizeGifFrame(
                    frame,
                    true,
                    quality || "HIGH",
                  ),
                ),
              ),
            );

            processedFrames = await this.imageProcessor.createImgBitmap(
              optimizedFrames,
              staticImage,
            );
          }

          // Write frame progress update to stream
          writer.write(
            new TextEncoder().encode(
              JSON.stringify({
                status: "Processing frame",
                frameIndex: optimizedFrames.length,
              }) + "\n",
            ),
          );

          this.progManager.updatePhase(
            GIF_PHASES.PROCESSING.id,
            100,
            "Frame processing complete",
          );

          // Stream GIF encoding output
          await this.createGIFStream(processedFrames, writer);

          //writer.close();
        } catch (error) {
          console.error("GIF streaming failed:", error);
          writer.abort(error);
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      })();

      return readable;
    } catch (error) {
      console.error("GIF streaming initialization failed:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  private async createGIFStream(
    frames: ProcessedFrame[],
    writer: WritableStreamDefaultWriter<Uint8Array>,
    previewSize: { width: number; height: number } = {
      width: 400,
      height: 300,
    },
  ): Promise<void> {
    let frameCanvas: HTMLCanvasElement | null = null;
    let ctx: CanvasRenderingContext2D | null = null;
    const originalFrames = frames.map((frame) => frame.originalFrame);
    const imgBitmapFrames = frames.map((frame) => frame.bitmap);
    try {
      const frameAnalysis =
        gifAnalyzer.analyzeGIFFrameDimensions(originalFrames);

      const firstFrame = frames[0];
      if (!firstFrame?.bitmap) {
        throw new Error("No valid frames to process");
      }

      // Calculate scaled dimensions to fit preview container
      const scale = Math.min(
        previewSize.width / frameAnalysis.maxWidth,
        previewSize.height / frameAnalysis.maxHeight,
      );

      const targetWidth = Math.round(firstFrame.bitmap.width * scale);
      const targetHeight = Math.round(firstFrame.bitmap.height * scale);

      // Center position calculations
      const xOffset = Math.floor((previewSize.width - targetWidth) / 2);
      const yOffset = Math.floor((previewSize.height - targetHeight) / 2);

      // Initialize GIF encoder with container dimensions
      const encoderOptions: any = {
        workers: this.workerScript ? this.workerCount : 0,
        quality: 10,
        width: previewSize.width,
        height: previewSize.height,
        transparent: true,
        background: null,
        dispose: 2,
      };
      if (this.workerScript) {
        encoderOptions.workerScript = this.workerScript;
      }
      const gifEncoder = new GIF(encoderOptions);

      // Create preview canvas with container dimensions
      frameCanvas = document.createElement("canvas");
      frameCanvas.width = previewSize.width;
      frameCanvas.height = previewSize.height;

      ctx = frameCanvas.getContext("2d", {
        alpha: true,
        willReadFrequently: true,
      });

      if (!ctx) throw new Error("Failed to get canvas context");

      // Process each frame
      for (let i = 0; i < frames.length; i++) {
        const frame = frames[i];
        if (!frame.bitmap) continue;

        // Clear entire canvas including padding
        ctx.clearRect(0, 0, previewSize.width, previewSize.height);

        // Draw frame centered and scaled
        ctx.drawImage(
          frame.bitmap,
          xOffset,
          yOffset,
          targetWidth,
          targetHeight,
        );

        // Add frame to GIF
        gifEncoder.addFrame(ctx, {
          copy: true,
          delay: frame.originalFrame?.delay || 100,
          dispose: frame.originalFrame?.disposalType || 2,
        });

        // Report progress with actual dimensions
        writer.write(
          new TextEncoder().encode(
            JSON.stringify({
              type: "progress",
              frameIndex: i + 1,
              total: frames.length,
              dimensions: {
                width: targetWidth,
                height: targetHeight,
                containerWidth: previewSize.width,
                containerHeight: previewSize.height,
                xOffset,
                yOffset,
              },
            }) + "\n",
          ),
        );
      }
      // Handle completion
      return new Promise((resolve, reject) => {
        gifEncoder.on("finished", async (blob: Blob) => {
          try {
            const url = URL.createObjectURL(blob);
            await writer.write(
              new TextEncoder().encode(
                JSON.stringify({
                  type: "complete",
                  url,
                  dimensions: { width: targetWidth, height: targetHeight },
                }) + "\n",
              ),
            );
            await writer.close();
            resolve();
          } catch (error) {
            reject(error);
          }
        });

        gifEncoder.on("error", reject);
        gifEncoder.render();
      });
    } catch (error) {
      console.error("GIF stream error:", error);
      writer.abort(error as Error);
      throw error;
    } finally {
      if (frameCanvas && ctx) {
        ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
        frameCanvas.width = 0;
        frameCanvas.height = 0;
      }
      frames.forEach((frame) => {
        if (frame.bitmap) {
          frame.bitmap.close();
        }
      });
    }
  }

  public async generateGIF(
    frames: ParsedFrame[],
    bglessUrl: string,
    overlays?: OverlayAsset[],
    quality?: keyof typeof QUALITY_PRESETS,
    options: GifOptions & Partial<QualityOptions> = {},
    onError?: (error: Error) => void,
  ): Promise<Blob> {
    // Update quality options if provided
    if (options.forceQuality || options.allowAutoDetect !== undefined) {
      this.memoryManager.setQualityOptions(options);
    }

    this.totalFramesCount = frames.length;
    this.processedFramesCount = 0;

    try {
      this.memoryManager.validateInput(frames, bglessUrl, overlays);

      const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(frames);
      const isPixelArt = await gifAnalyzer.detectPixelArtInAllFrames(frames);

      if (!quality) {
        const hasLargeFrames =
          frameAnalysis.maxWidth > CONSTANTS.TARGET_SIZE ||
          frameAnalysis.maxHeight > CONSTANTS.TARGET_SIZE;

        if (isPixelArt) {
          quality =
            hasLargeFrames || frameAnalysis.hasVariableSize
              ? "HIGHRESPIXEL"
              : "PIXEL";
        } else {
          quality =
            hasLargeFrames || frameAnalysis.hasVariableSize
              ? "HIGHRES"
              : "HIGH";
        }
      }
      const settings = QUALITY_PRESETS[quality];
      if (options.optimizeFrames) {
        settings.disposalMethod = 1;
        settings.synchronizeFrames = true;
        settings.blendMode = "copy";
      }
      console.debug("Selected quality settings:", settings);
      let processedFrames: ProcessedFrame[];
      const staticImage = await this.imgManager.loadAndCreateStaticImage(
        bglessUrl,
        overlays,
      );

      if (isPixelArt || frameAnalysis.hasVariableSize) {
        // Handle pixel art or variable size frames
        const normalizedFrames = frames.map((frame, i) =>
          this.pixelArtHandler.processPixelArtFrame(frame, frameAnalysis, i),
        );

        //const normFrames = await this.processFramesInWorkers(normalizedFrames);

        const optimizedFrames = await Promise.all(
          normalizedFrames.map(async (frame) =>
            this.frameProcessor.processFrameOG(
              await this.imageProcessor.preOptimizeGifFrame(
                frame,
                true,
                "PIXEL",
              ),
            ),
          ),
        );

        processedFrames = await this.imageProcessor.createImgBitmap(
          optimizedFrames,
          staticImage,
        );
      } else {
        // Handle regular GIFs with consistent frame sizes
        const optimizedFrames = await Promise.all(
          frames.map(async (frame) =>
            this.frameProcessor.processFrameOG(
              await this.imageProcessor.preOptimizeGifFrame(
                frame,
                true,
                quality || "HIGH",
              ),
            ),
          ),
        );
        // const optFrames = await this.processFramesInWorkers(optimizedFrames);

        processedFrames = await this.imageProcessor.createImgBitmap(
          optimizedFrames,
          staticImage,
        );
      }

      // Create static image and finish processing
      const blob = await this.createGIF(processedFrames, false);

      // Ensure all phases are marked as complete
      Object.values(GIF_PHASES).forEach((phase) => {
        if (!this.completedPhases.has(phase.id)) {
          this.progManager.updatePhase(phase.id, 100, `${phase.name} complete`);
        }
      });

      this.progManager.resetProgress();
      this.memoryManager.clear();

      return blob;
    } catch (error) {
      console.error("GIF generation failed:", error);
      onError?.(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  public async extractFrames(gifUrl: string): Promise<ParsedFrame[]> {
    try {
      const cacheKey = this.imgManager.getCacheKey(gifUrl);
      if (this.processedFramesCache.has(cacheKey)) {
        console.debug("Using cached frames for:", gifUrl);
        return this.processedFramesCache.get(cacheKey)!;
      }

      this.progManager.updatePhase(
        GIF_PHASES.EXTRACTING.id,
        0,
        "Starting frame extraction...",
      );
      const response = await fetchWithRetry(gifUrl);
      const buffer = await response.arrayBuffer();

      // Analyze GIF first
      const metadata = await gifAnalyzer.analyzeGIF(buffer);
      console.debug("GIF Analysis:", metadata);

      this.progManager.updatePhase(
        GIF_PHASES.EXTRACTING.id,
        20,
        "Decompressing frames...",
      );
      const rawFrames = decompressFrames(parseGIF(buffer), true);

      // Apply optimal settings based on metadata
      const qualityPreset = this.qualityManager.selectOptimalQuality(metadata);
      console.debug("Selected quality preset:", qualityPreset);

      // Cache the frames with metadata
      this.processedFramesCache.set(cacheKey, rawFrames);

      this.progManager.updatePhase(
        GIF_PHASES.EXTRACTING.id,
        100,
        "Frame extraction complete",
      );
      return rawFrames;
    } catch (error) {
      console.error("Frame extraction failed:", error);
      throw error;
    }
  }

  public async analyzeGIF(gifUrl: string): Promise<{
    metadata: GIFMetadata;
    quality: QualityPresetKey;
    frames: ParsedFrame[];
  }> {
    try {
      const response = await fetchWithRetry(gifUrl);
      const buffer = await response.arrayBuffer();

      const { quality, metadata } =
        await this.qualityAnalyzer.analyzeGifQuality(gifUrl);
      console.debug("[GIF Analysis]", metadata, "Quality:", quality);

      const rawFrames = decompressFrames(parseGIF(buffer), true);
      return { metadata, quality, frames: rawFrames };
    } catch (error) {
      console.error("GIF analysis failed:", error);
      throw error;
    }
  }
  private readonly CHUNK_SIZE = 5; // Process frames in smaller chunks
  private readonly MEMORY_LIMIT = 500 * 1024 * 1024; // 500MB limit

  private async processFramesInChunks(
    frames: ParsedFrame[],
  ): Promise<ParsedFrame[]> {
    const processedFrames: ParsedFrame[] = [];

    for (let i = 0; i < frames.length; i += this.CHUNK_SIZE) {
      const chunk = frames.slice(i, i + this.CHUNK_SIZE);
      const processedChunk = await Promise.all(
        chunk.map((frame) => this.frameProcessor.processFrameOG(frame)),
      );
      processedFrames.push(...processedChunk);

      // Force cleanup between chunks
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    return processedFrames;
  }

  async processFramesInWorkers(
    frames: ParsedFrame[],
  ): Promise<ProcessedFrame[]> {
    const frameAnalysis = gifAnalyzer.analyzeGIFFrameDimensions(frames);

    // Normalize frames first
    const normalizedFrames = frames.map((frame) =>
      this.pixelArtHandler.processPixelArtFrame(frame, frameAnalysis, 0),
    );

    const chunkSize = Math.ceil(normalizedFrames.length / this.workerCount);
    const frameChunks = [];

    for (let i = 0; i < normalizedFrames.length; i += chunkSize) {
      frameChunks.push(normalizedFrames.slice(i, i + chunkSize));
    }

    return (
      await Promise.all(
        frameChunks.map(async (chunk) => {
          return this.workerPool.addTask(async () => {
            return Promise.all(
              chunk.map(async (frame) =>
                this.frameProcessor.processFrame(
                  await this.imageProcessor.preOptimizeGifFrame(
                    frame,
                    true,
                    "HIGH",
                  ),
                  null,
                ),
              ),
            );
          });
        }),
      )
    ).flat();
  }

  cleanup() {
    this.isProcessing = false;
    // Clean up any active metrics
    this.completedPhases.clear();
    this.processedFramesCache.clear();
    this.progManager.resetProgress();
    this.memoryManager.cleanup?.();
    //this.canvasPool.terminate();
    if (this.sessionId) {
      this.sessionManager.endSession(this.sessionId);
    }

    this.sessionManager.cleanup();

    GIFProcessor.activeInstanceCount = Math.max(
      0,
      GIFProcessor.activeInstanceCount - 1,
    );
    if (GIFProcessor.activeInstanceCount === 0) {
      this.workerPool.terminate?.(true);
      this.gifWorkerPool.terminate?.(true);
      GIFProcessor.sharedWorkerPool = null;
      GIFProcessor.sharedGifWorkerPool = null;
    }
  }
}

export function getGifProcessor(
  poolSize?: number,
  script?: string,
): GIFProcessor {
  return GIFProcessor.getInstance(poolSize, script);
}

export { GIFProcessor };

// public async generateGIF2(
//   frames: ParsedFrame[],
//   bglessUrl: string,
//   overlays?: OverlayAsset[],
//   quality?: keyof typeof QUALITY_PRESETS,
//   options: GifOptions & Partial<QualityOptions> = {},
//   onError?: (error: Error) => void
// ): Promise<Blob> {
//   if (!quality) quality = 'HIGH';
//   this.totalFramesCount = frames.length;
//   this.processedFramesCount = 0;

//   try {
//     this.memoryManager.validateInput(frames, bglessUrl, overlays);

//     const staticImage = await this.imgManager.loadAndCreateStaticImage(bglessUrl, overlays);
//     const processedFrames = await this.processFramesInWorkers(frames);

//     // Now, we optimize and convert frames to ImageBitmaps
//     const optimizedFrames = await this.imageProcessor.createImgBitmap(processedFrames, staticImage);

//     // Generate GIF
//     const blob = await this.createGIF(optimizedFrames);

//     // Reset Progress
//     this.progManager.resetProgress();
//     this.memoryManager.cleanup();
//     return blob;
//   } catch (error) {
//     console.error('GIF generation failed:', error);
//     onError?.(error instanceof Error ? error : new Error(String(error)));
//     throw error;
//   }
// }
