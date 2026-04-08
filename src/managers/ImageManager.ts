import { CONSTANTS } from "../constants/gif.constants";
import { WorkerPool, CanvasPool } from "../runtime";
import { GIF_PHASES } from "../trackers/GIFProgressTracker";
import { OverlayAsset } from "../types";
import ProgressManager from "./ProgressManager";

export interface IImageManager {
  loadAndCreateStaticImage(
    bglessUrl: string,
    overlays?: OverlayAsset[],
  ): Promise<HTMLCanvasElement>;
  createStaticImage(
    bglessImage: HTMLImageElement,
    overlayImages?: {
      src: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
    }[],
  ): Promise<HTMLCanvasElement>;
  getCacheKey(gifUrl: string): string;
  optimizeGifFrame(
    frame: ImageBitmap,
    enhanceColors: boolean,
  ): HTMLCanvasElement;
  logBatchProgress(
    startIndex: number,
    currentBatchSize: number,
    totalFrames: number,
  ): void;
}

export class ImageManager implements IImageManager {
  private static instance: ImageManager | null = null;
  private progManager: ProgressManager;
  private workerPool: WorkerPool;
  private memoryUsage: any;
  protected completedPhases: Set<string>;
  private canvasPool: CanvasPool;

  constructor(
    progManager: ProgressManager,
    workerPool: WorkerPool,
    canvasPool: CanvasPool,
  ) {
    this.progManager = progManager;
    this.workerPool = workerPool;
    this.canvasPool = canvasPool;
    this.completedPhases = new Set();
  }

  public static getInstance(
    progManager: ProgressManager,
    workerPool: WorkerPool,
    canvasPool: CanvasPool,
  ): ImageManager {
    if (!this.instance) {
      this.instance = new ImageManager(progManager, workerPool, canvasPool);
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }

  async loadAndCreateStaticImage(
    bglessUrl: string,
    overlays?: OverlayAsset[],
  ): Promise<HTMLCanvasElement> {
    try {
      this.progManager.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        0,
        "Loading background image...",
        "processing",
        bglessUrl,
      );

      const bglessImage = await this.loadImage(bglessUrl);
      this.progManager.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        20,
        "Background loaded",
      );

      const canvas = document.createElement("canvas");
      canvas.width = CONSTANTS.TARGET_SIZE;
      canvas.height = CONSTANTS.TARGET_SIZE;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) throw new Error("Failed to get canvas context");

      const scale = Math.min(
        CONSTANTS.TARGET_SIZE / CONSTANTS.NFT_SIZE,
        CONSTANTS.TARGET_SIZE / CONSTANTS.NFT_SIZE,
      );

      const scaledWidth = Math.round(CONSTANTS.NFT_SIZE * scale);
      const scaledHeight = Math.round(CONSTANTS.NFT_SIZE * scale);
      const x = this.calculateCenteredPosition(
        CONSTANTS.TARGET_SIZE,
        scaledWidth,
      );
      const y = this.calculateCenteredPosition(
        CONSTANTS.TARGET_SIZE,
        scaledHeight,
      );

      ctx.drawImage(bglessImage, x, y, scaledWidth, scaledHeight);

      if (overlays?.length) {
        for (let i = 0; i < overlays.length; i++) {
          const overlay = overlays[i];
          this.progManager.updatePhase(
            GIF_PHASES.CREATE_STATIC.id,
            20 + Math.round(((i + 1) / overlays.length) * 80),
            `Loading overlay ${i + 1}/${overlays.length}`,
            "processing",
            overlay.name,
          );

          const overlayImage = await this.loadImage(overlay.url);
          ctx.drawImage(overlayImage, x, y, scaledWidth, scaledHeight);
        }
      }

      this.progManager.updatePhase(
        GIF_PHASES.CREATE_STATIC.id,
        100,
        "Static layer complete",
      );
      return canvas;
    } catch (error) {
      console.error("Error creating static image:", error);
      throw error;
    }
  }

  getCacheKey(gifUrl: string): string {
    return gifUrl;
  }

  optimizeGifFrame(
    frame: ImageBitmap,
    enhanceColors: boolean = false,
  ): HTMLCanvasElement {
    const optimizedCanvas = document.createElement("canvas");
    optimizedCanvas.width = CONSTANTS.TARGET_SIZE;
    optimizedCanvas.height = CONSTANTS.TARGET_SIZE;

    const ctx = optimizedCanvas.getContext("2d", {
      willReadFrequently: true,
      alpha: true,
    });

    if (ctx) {
      // Base settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // Initial white background
      //ctx.fillStyle = '#FFFFFF';
      //ctx.fillRect(0, 0, optimizedCanvas.width, optimizedCanvas.height);

      // Draw frame with copy operation first
      ctx.globalCompositeOperation = "copy";
      ctx.drawImage(frame, 0, 0, optimizedCanvas.width, optimizedCanvas.height);
    }

    return optimizedCanvas;
  }

  async logBatchProgress(
    startIndex: number,
    currentBatchSize: number,
    totalFrames: number,
  ) {
    const batchStart = startIndex;
    const batchEnd = Math.min(startIndex + currentBatchSize, totalFrames);
    const stats = this.workerPool.stats;
    console.debug(`[BatchProcessor] Progress:
        Batch: ${Math.floor(startIndex / currentBatchSize) + 1}/${Math.ceil(totalFrames / currentBatchSize)}
        Workers: ${stats.activeWorkers}/${stats.maxWorkers} (${stats.availableWorkers} available)
        Memory: ${Math.round(this.memoryUsage.usedJSHeapSize / (1024 * 1024))}MB
        Frames: ${batchStart + 1}-${batchEnd}/${totalFrames}
      `);

    // Force progress update to ensure we hit 100%
    if (batchEnd === totalFrames) {
      this.progManager.updatePhase(
        GIF_PHASES.PROCESSING.id,
        100,
        "Frame processing complete",
      );
    }
  }

  loadedAssetCount = 0;

  loadWithProgress = async (
    src: string,
    totalAssets: number,
  ): Promise<HTMLImageElement> => {
    try {
      const img = await this.loadImage(src);
      this.loadedAssetCount++;
      const progress = Math.round((this.loadedAssetCount / totalAssets) * 100);
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        progress,
        `Loading asset ${this.loadedAssetCount}/${totalAssets}: ${src}`,
      );
      return img;
    } catch (error) {
      console.error("Asset loading failed:", error);
      throw error;
    } finally {
      if (this.loadedAssetCount === totalAssets) {
        this.loadedAssetCount = 0; // Reset for next use
      }
    }
  };

  async loadAsset(img: OverlayAsset[]): Promise<HTMLImageElement[]> {
    const totalAssets = img.length || 0;
    const assets = await Promise.all(
      img?.map(
        async (overlay) =>
          await this.loadWithProgress(overlay.url, totalAssets),
      ) || [],
    );
    return assets;
  }

  public async loadAssets(
    bglessUrl: string,
    overlays?: OverlayAsset[],
  ): Promise<{
    bglessImage: HTMLImageElement;
    overlayImages: HTMLImageElement[];
  }> {
    const totalAssets = (overlays?.length || 0) + 1;
    let loadedCount = 0;

    try {
      // Start loading phase
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        0,
        "Starting asset load...",
      );

      // Load background image with progress
      const bglessImage = await this.loadImage(bglessUrl);
      loadedCount++;
      const baseProgress = (loadedCount / totalAssets) * 100;
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        baseProgress,
        "Base image loaded",
        "processing",
        bglessUrl,
      );

      if (!overlays?.length) {
        this.progManager.updatePhase(
          GIF_PHASES.LOADING.id,
          100,
          "Assets loaded",
        );
        this.completedPhases.add(GIF_PHASES.LOADING.id);
        return { bglessImage, overlayImages: [] };
      }

      // Load overlays with accurate progress
      const overlayImages = await Promise.all(
        overlays.map(async (overlay, index) => {
          const img = await this.loadImage(overlay.url);
          loadedCount++;
          const progress = (loadedCount / totalAssets) * 100;
          this.progManager.updatePhase(
            GIF_PHASES.LOADING.id,
            progress,
            `Loading OverlayAsset ${index + 1}/${overlays.length}`,
            "processing",
            overlay.name,
          );
          return img;
        }),
      );

      // Mark loading complete
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        100,
        "All assets loaded",
      );
      this.completedPhases.add(GIF_PHASES.LOADING.id);
      return { bglessImage, overlayImages };
    } catch (error) {
      console.error("Asset loading failed:", error);
      this.completedPhases.delete(GIF_PHASES.LOADING.id);
      throw error;
    }
  }

  public async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error);
        reject(new Error(`Failed to load image: ${src}`));
      };
      img.src = src;
    });
  }

  public calculateCenteredPosition(
    containerSize: number,
    imageSize: number,
  ): number {
    return Math.floor((containerSize - imageSize) / 2);
  }

  public drawOverlay(
    ctx: CanvasRenderingContext2D,
    overlayImage: CanvasImageSource,
    position: { x: number; y: number },
    size?: { width: number; height: number },
  ) {
    const { x, y } = position;
    if (size) {
      const { width, height } = size;
      ctx.drawImage(overlayImage, x, y, width, height);
    } else {
      ctx.drawImage(overlayImage, x, y);
    }
  }

  public loadStaticImage = async (
    bglessUrl: string,
    overlays?: OverlayAsset[],
  ): Promise<HTMLCanvasElement> => {
    const metricsKey = `static-image-${Date.now()}`;

    try {
      // Single image case
      if (!overlays) {
        this.progManager.updatePhase(
          GIF_PHASES.LOADING.id,
          0,
          "Loading base image...",
        );
        const bglessImage = await this.loadImage(bglessUrl);
        this.progManager.updatePhase(
          GIF_PHASES.LOADING.id,
          100,
          "Base image loaded",
        );
        return this.createStaticImage(bglessImage);
      }

      // Multiple images case
      const totalAssets = overlays.length + 1;
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        0,
        "Loading assets...",
      );

      // Load base image
      const bglessImage = await this.loadImage(bglessUrl);
      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        (1 / totalAssets) * 100,
        "Base image loaded",
      );

      // Load overlays
      const overlayImages = await Promise.all(
        overlays.map(async (overlay, index) => {
          const img = await this.loadImage(overlay.url);
          const progress = ((index + 2) / totalAssets) * 100;
          this.progManager.updatePhase(
            GIF_PHASES.LOADING.id,
            progress,
            `Loading overlay ${index + 1}/${overlays.length}`,
          );
          return img;
        }),
      );

      this.progManager.updatePhase(
        GIF_PHASES.LOADING.id,
        100,
        "All assets loaded",
      );
      return this.createStaticImage(bglessImage, overlayImages);
    } catch (error) {
      console.error("Failed to load static image:", error);
      throw error;
    }
  };

  public async createStaticImage(
    bglessImage: HTMLImageElement,
    overlayImages?: {
      src: string;
      x: number;
      y: number;
      width?: number;
      height?: number;
    }[],
  ): Promise<HTMLCanvasElement> {
    if (!bglessImage) {
      throw new Error("No images provided for creating a static image.");
    }

    if (!overlayImages?.length) {
      const canvas = this.canvasPool.getCanvas(
        bglessImage.width,
        bglessImage.height,
        false,
      ) as HTMLCanvasElement;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        throw new Error("Failed to get canvas context for static image.");
      }
      ctx.drawImage(bglessImage, 0, 0, bglessImage.width, bglessImage.height);
      return canvas;
    }

    // Determine canvas dimensions
    const canvasWidth = bglessImage?.width || CONSTANTS.MAX_CANVAS_SIZE;
    const canvasHeight = bglessImage?.height || CONSTANTS.MAX_CANVAS_SIZE;

    // Acquire a canvas from the pool
    const staticCanvas = this.canvasPool.getCanvas(
      canvasWidth,
      canvasHeight,
      false,
    ) as HTMLCanvasElement;

    // Ensure the context is available
    const ctx = staticCanvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to get canvas context for static image.");
    }

    // Set the canvas dimensions
    staticCanvas.width = canvasWidth;
    staticCanvas.height = canvasHeight;

    // Preload all overlay images
    const loadedOverlays = await Promise.all(
      overlayImages.map(async (overlay) => ({
        ...overlay,
        image: await this.loadImage(overlay.src).catch((err) => {
          console.error(`Failed to load overlay image: ${overlay.src}`, err);
          return null;
        }),
      })),
    );

    // Add drawing operations to the worker pool
    await this.workerPool.addTask(async () => {
      // Draw the base image
      if (bglessImage) {
        ctx.drawImage(bglessImage, 0, 0, canvasWidth, canvasHeight);
      }

      // Draw overlays
      for (const overlay of loadedOverlays) {
        if (overlay.image) {
          this.drawOverlay(
            ctx,
            overlay.image,
            { x: overlay.x, y: overlay.y },
            overlay.width
              ? { width: overlay.width, height: overlay.height ?? canvasHeight }
              : undefined,
          );
        }
      }
    });

    return staticCanvas;
  }
}

export const imageManager = ImageManager.getInstance(
  new ProgressManager(),
  WorkerPool.getInstance(),
  CanvasPool.getInstance(),
);
