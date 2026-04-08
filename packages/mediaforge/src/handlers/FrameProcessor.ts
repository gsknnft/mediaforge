import { ParsedFrame } from "gifuct-js";
import { CONSTANTS } from "../constants/gif.constants";
import {
  FrameDimensions,
  FrameSizeMetadata,
  GIFMetadata,
  ProcessedFrame,
} from "@/types";
import { PIXEL_ART_SETTINGS, PixelArtHandler } from "./PixelArtHandler";
// import ImageManager from "../managers/ImageManager";
import { GifAnalyzer } from "../analyzers/GifAnalyzer";
import { CanvasPool, WorkerPool } from "../runtime";
import ImageProcessor from "../services/ImageProcessingServicev1";

interface IFrameProcessor {
  calculateFrameSizeMetadata(metadata: GIFMetadata): FrameSizeMetadata;
  calculateGifFitDimensions(
    frameWidth: number,
    frameHeight: number,
  ): {
    width: number;
    height: number;
    x: number;
    y: number;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
  };
  calculateConsistentDimensions(frames: ParsedFrame[]): FrameDimensions;
  processFrame(
    frame: ParsedFrame,
    staticImage: HTMLCanvasElement | null,
  ): Promise<ProcessedFrame>;
  optimizeFrameDimensions(
    frame: ParsedFrame,
    metadata: GIFMetadata,
  ): FrameDimensions;
  processFrame1(
    frame: ParsedFrame,
    staticImage: HTMLCanvasElement | null,
    metadata?: GIFMetadata,
  ): Promise<ParsedFrame>;
}

export class FrameProcessor implements IFrameProcessor {
  private static instance: FrameProcessor | null = null;
  private pixelArtHandler: PixelArtHandler;
  private imageProcessor: ImageProcessor;
  private canvasPool: CanvasPool;
  private gifAnalyzer: GifAnalyzer;
  private workerPool: WorkerPool;
  private workerCount: number;

  constructor(
    pixelArtHandler: PixelArtHandler,
    imageProcessor: ImageProcessor,
    canvasPool: CanvasPool,
    gifAnalyzer: GifAnalyzer,
    workerPool: WorkerPool,
    workerCount: number,
  ) {
    this.pixelArtHandler = pixelArtHandler;
    this.imageProcessor = imageProcessor;
    this.canvasPool = canvasPool;
    this.gifAnalyzer = gifAnalyzer;
    this.workerPool = workerPool;
    this.workerCount = workerCount;
  }

  public static getInstance(
    pixelArtHandler: PixelArtHandler,
    imageProcessor: ImageProcessor,
    canvasPool: CanvasPool,
    gifAnalyzer: GifAnalyzer,
    workerPool: WorkerPool,
    workerCount: number,
  ): FrameProcessor {
    if (!this.instance) {
      this.instance = new FrameProcessor(
        pixelArtHandler,
        imageProcessor,
        canvasPool,
        gifAnalyzer,
        workerPool,
        workerCount,
      );
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }

  calculateFrameSizeMetadata(metadata: GIFMetadata): FrameSizeMetadata {
    const { width, height, frames, isPixelArt } = metadata;
    const frameSizes = metadata.frameExtras.individualFrameSizes;

    // Calculate size bounds
    const maxWidth = Math.max(...frameSizes.map((f) => f.width));
    const maxHeight = Math.max(...frameSizes.map((f) => f.height));
    const minWidth = Math.min(...frameSizes.map((f) => f.width));
    const minHeight = Math.min(...frameSizes.map((f) => f.height));

    // Check for variable frame sizes
    const hasVariableSizes = frameSizes.some(
      (size) => size.width !== maxWidth || size.height !== maxHeight,
    );

    // Calculate aspect ratios
    const aspectRatios = frameSizes.map((frame) => frame.width / frame.height);
    const baseAspectRatio = width / height;

    // Calculate target size and scale
    let targetSize: { width: number; height: number; scale: number };

    if (isPixelArt) {
      // For pixel art: use nearest-neighbor scaling
      const maxDimension = Math.max(maxWidth, maxHeight);
      const scale = Math.floor(CONSTANTS.TARGET_SIZE / maxDimension);

      targetSize = {
        width: maxWidth * scale,
        height: maxHeight * scale,
        scale: scale,
      };
    } else {
      // For regular GIFs: smooth scaling
      const scale = CONSTANTS.TARGET_SIZE / Math.max(maxWidth, maxHeight);

      targetSize = {
        width: Math.round(maxWidth * scale),
        height: Math.round(maxHeight * scale),
        scale: scale,
      };
    }

    return {
      maxWidth,
      maxHeight,
      minWidth,
      minHeight,
      hasVariableSizes,
      aspectRatios,
      targetSize,
    };
  }

  // Add this new helper method for calculating frame fit dimensions
  calculateGifFitDimensions(
    frameWidth: number,
    frameHeight: number,
  ): {
    width: number;
    height: number;
    x: number;
    y: number;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
  } {
    const targetSize = CONSTANTS.TARGET_SIZE;
    const aspectRatio = frameWidth / frameHeight;
    const targetAspectRatio = 1; // We want a square output

    let scaledWidth, scaledHeight;
    let sourceX = 0,
      sourceY = 0;
    let sourceWidth = frameWidth,
      sourceHeight = frameHeight;

    if (aspectRatio > targetAspectRatio) {
      // Image is wider than target - crop sides
      scaledHeight = targetSize;
      scaledWidth = targetSize;

      // Calculate how much to crop from sides
      sourceHeight = frameHeight;
      sourceWidth = Math.round(frameHeight);
      sourceX = Math.round((frameWidth - sourceWidth) / 2);
    } else {
      // Image is taller than target - crop top/bottom
      scaledWidth = targetSize;
      scaledHeight = targetSize;

      // Calculate how much to crop from top/bottom
      sourceWidth = frameWidth;
      sourceHeight = Math.round(frameWidth);
      sourceY = Math.round((frameHeight - sourceHeight) / 2);
    }

    return {
      width: scaledWidth,
      height: scaledHeight,
      x: 0, // No need to center since we're filling the canvas
      y: 0,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    };
  }

  // Add this new method to determine consistent dimensions for all frames
  calculateConsistentDimensions(frames: ParsedFrame[]): FrameDimensions {
    // Find the largest dimensions among all frames
    const maxWidth = Math.max(...frames.map((f) => f.dims.width));
    const maxHeight = Math.max(...frames.map((f) => f.dims.height));

    // Calculate scale that fits largest dimensions while preserving aspect ratio
    const scale = Math.min(
      CONSTANTS.TARGET_SIZE / maxWidth,
      CONSTANTS.TARGET_SIZE / maxHeight,
    );

    // Calculate scaled dimensions
    const scaledWidth = Math.round(maxWidth * scale);
    const scaledHeight = Math.round(maxHeight * scale);

    // Calculate centering offsets
    const offsetX = Math.floor((CONSTANTS.TARGET_SIZE - scaledWidth) / 2);
    const offsetY = Math.floor((CONSTANTS.TARGET_SIZE - scaledHeight) / 2);

    return {
      width: scaledWidth,
      height: scaledHeight,
      scale,
      offsetX,
      offsetY,
    };
  }

  public async processFrame(
    frame: ParsedFrame,
    staticImage: HTMLCanvasElement | null,
  ): Promise<ProcessedFrame> {
    try {
      const isPixelArt = this.gifAnalyzer.detectPixelArt(frame);
      const { width, height } = frame.dims;

      if (isPixelArt) {
        const frameAnalysis = this.gifAnalyzer.analyzeGIFFrameDimensions([
          frame,
        ]);
        const processedFrame = this.pixelArtHandler.processPixelArtFrame(
          frame,
          frameAnalysis,
          0,
        );

        const bitmap = await createImageBitmap(
          new ImageData(
            new Uint8ClampedArray(processedFrame.patch),
            processedFrame.dims.width,
            processedFrame.dims.height,
          ),
        );

        return { bitmap, originalFrame: processedFrame };
      }

      // Get a reusable canvas
      const frameCanvas = this.canvasPool.getCanvas(
        width,
        height,
        false,
      ) as HTMLCanvasElement;
      const ctx = frameCanvas.getContext("2d", { alpha: true });

      if (!ctx) throw new Error("Failed to get canvas context");

      // Clear the entire frame canvas
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = !isPixelArt;
      ctx.imageSmoothingQuality = isPixelArt ? "low" : "high";

      // Ensure frame.patch is correctly sized before putting it in ImageData
      const frameImageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        width,
        height,
      );
      ctx.putImageData(frameImageData, 0, 0);

      // Set compositing mode
      ctx.globalCompositeOperation = "source-over";

      // Overlay static image if available
      if (staticImage) {
        ctx.drawImage(staticImage, 0, 0, width, height);
      }

      // Convert to bitmap
      const bitmap = await createImageBitmap(frameCanvas);

      return { bitmap, originalFrame: frame };
    } catch (error) {
      console.error("Error processing frame:", error);
      throw error;
    }
  }

  async processFrameOG(frame: ParsedFrame): Promise<ParsedFrame> {
    try {
      const isPixelArt = this.gifAnalyzer.detectPixelArt(frame);
      const { width, height } = frame.dims;
      const {
        width: scaledWidth,
        height: scaledHeight,
        x,
        y,
      } = this.calculateGifFitDimensions(width, height);

      // Create main canvas and set its dimensions
      const frameCanvas = this.imageProcessor.createCanvas(
        scaledWidth,
        scaledHeight,
      );
      const ctx = this.imageProcessor.getCanvasContext(frameCanvas);

      // Clear previous frame completely (to avoid ghosting issues)
      ctx.clearRect(0, 0, scaledWidth, scaledHeight);
      ctx.globalCompositeOperation = "source-over"; // Standard blending

      // Scale frame patch with proper alpha handling
      const tempCanvas = this.imageProcessor.createCanvas(width, height);
      const tempCtx = this.imageProcessor.getCanvasContext(tempCanvas);

      const frameImageData = new ImageData(
        new Uint8ClampedArray(frame.patch),
        width,
        height,
      );

      // Apply **Alpha Transparency Fix**
      const alphaThreshold = 220; // Prevents transparency artifacts
      for (let i = 3; i < frameImageData.data.length; i += 4) {
        if (frameImageData.data[i] < alphaThreshold) {
          frameImageData.data[i] = 0; // Make it fully transparent
        }
      }

      tempCtx.putImageData(frameImageData, 0, 0);

      // Draw onto main canvas with proper scaling
      ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight);

      // Update frame data
      const newImageData = ctx.getImageData(
        0,
        0,
        frameCanvas.width,
        frameCanvas.height,
      );

      return {
        ...frame,
        patch: newImageData.data, // Store updated pixel data
        dims: {
          width: frameCanvas.width,
          height: frameCanvas.height,
          top: 0,
          left: 0,
        },
      };
    } catch (error) {
      throw new Error(`Failed to process frame: ${error}`);
    }
  }

  optimizeFrameDimensions(
    frame: ParsedFrame,
    metadata: GIFMetadata,
  ): FrameDimensions {
    const isPixelArt = metadata.isPixelArt;
    const { width, height } = frame.dims;

    if (isPixelArt) {
      // Calculate optimal pixel size that maintains sharpness
      const pixelSize = Math.max(
        PIXEL_ART_SETTINGS.minimumPixelSize,
        Math.floor(CONSTANTS.TARGET_SIZE / Math.max(width, height)),
      );

      // Ensure we don't exceed maxScale
      const scale = Math.min(pixelSize, PIXEL_ART_SETTINGS.maxScale);

      return {
        width: width * scale,
        height: height * scale,
        scale,
        offsetX: Math.floor((CONSTANTS.TARGET_SIZE - width * scale) / 2),
        offsetY: Math.floor((CONSTANTS.TARGET_SIZE - height * scale) / 2),
      };
    }

    // For non-pixel art, use standard scaling
    const scale = Math.min(
      CONSTANTS.TARGET_SIZE / width,
      CONSTANTS.TARGET_SIZE / height,
    );

    return this.calculateConsistentDimensions([frame]);
  }

  async processFrame1(
    frame: ParsedFrame,
    staticImage: HTMLCanvasElement | null,
    metadata?: GIFMetadata,
  ): Promise<ParsedFrame> {
    if (!metadata) {
      return frame; // Fall back to existing behavior if no metadata
    }
    const {
      width: scaledWidth1,
      height: scaledHeight1,
      sourceX,
      sourceY,
    } = this.calculateGifFitDimensions(frame.dims.width, frame.dims.height);

    const sizeMetadata = this.calculateFrameSizeMetadata(metadata);
    const isPixelArt = metadata.isPixelArt;

    const frameCanvas = document.createElement("canvas");
    frameCanvas.width = sizeMetadata.targetSize.width;
    frameCanvas.height = sizeMetadata.targetSize.height;
    const ctx = frameCanvas.getContext("2d", { alpha: true });

    if (!ctx) throw new Error("Failed to get canvas context");

    // Configure canvas for pixel art if needed
    const { width, height, scale } =
      this.imageProcessor.calculateUniformDimensions(metadata);

    if (ctx) {
      // Configure for pixel art
      ctx.imageSmoothingEnabled = false;
      if (frameCanvas instanceof HTMLCanvasElement) {
        frameCanvas.style.imageRendering = "pixelated";
      }

      // Center the frame
      const x = (width - frame.dims.width * scale) / 2;
      const y = (height - frame.dims.height * scale) / 2;

      // Draw scaled frame
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = frame.dims.width;
      tempCanvas.height = frame.dims.height;
      const tempCtx = tempCanvas.getContext("2d", { alpha: true });

      if (!tempCtx) throw new Error("Failed to get temp context");

      tempCtx.putImageData(
        new ImageData(
          new Uint8ClampedArray(frame.patch),
          frame.dims.width,
          frame.dims.height,
        ),
        0,
        0,
      );

      ctx.drawImage(
        tempCanvas,
        x,
        y,
        frame.dims.width * scale,
        frame.dims.height * scale,
      );
    }

    // Clear previous frame completely
    ctx.clearRect(0, 0, frameCanvas.width, frameCanvas.height);

    // Calculate frame position to center it
    const scaledWidth = frame.dims.width * sizeMetadata.targetSize.scale;
    const scaledHeight = frame.dims.height * sizeMetadata.targetSize.scale;
    const x = (sizeMetadata.targetSize.width - scaledWidth) / 2;
    const y = (sizeMetadata.targetSize.height - scaledHeight) / 2;

    // Draw frame maintaining pixel-perfect scaling
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = frame.dims.width;
    tempCanvas.height = frame.dims.height;
    const tempCtx = tempCanvas.getContext("2d", { alpha: true });

    if (!tempCtx) throw new Error("Failed to get temp context");

    tempCtx.putImageData(
      new ImageData(
        new Uint8ClampedArray(frame.patch),
        frame.dims.width,
        frame.dims.height,
      ),
      0,
      0,
    );

    ctx.drawImage(tempCanvas, x, y, scaledWidth, scaledHeight);

    // Update frame data
    const newImageData = ctx.getImageData(
      0,
      0,
      frameCanvas.width,
      frameCanvas.height,
    );

    return {
      ...frame,
      patch: newImageData.data,
      dims: {
        width: frameCanvas.width,
        height: frameCanvas.height,
        top: 0,
        left: 0,
      },
    };
  }

  public processHighResFrame(
    frame: ParsedFrame,
    metadata: GIFMetadata,
  ): ParsedFrame {
    const { width, height } = frame.dims;

    // Create temporary canvas for alpha handling
    const alphaCanvas = document.createElement("canvas");
    alphaCanvas.width = width;
    alphaCanvas.height = height;
    const alphaCtx = alphaCanvas.getContext("2d", { alpha: true });

    if (!alphaCtx) throw new Error("Failed to get alpha context");

    // Handle transparency with precise alpha values
    const imageData = new ImageData(
      new Uint8ClampedArray(frame.patch),
      width,
      height,
    );

    // Preserve semi-transparent pixels
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0 && imageData.data[i] < 255) {
        // Keep semi-transparent pixels as-is
        continue;
      }
      // Make fully transparent pixels truly transparent
      if (imageData.data[i] === 0) {
        imageData.data[i - 3] = 0; // R
        imageData.data[i - 2] = 0; // G
        imageData.data[i - 1] = 0; // B
      }
    }

    alphaCtx.putImageData(imageData, 0, 0);

    // Scale the frame
    const { width: targetWidth, height: targetHeight } =
      this.calculateGifFitDimensions(width, height);

    const outCanvas = document.createElement("canvas");
    outCanvas.width = targetWidth;
    outCanvas.height = targetHeight;
    const outCtx = outCanvas.getContext("2d", { alpha: true });

    if (!outCtx) throw new Error("Failed to get output context");

    // Configure for high quality scaling
    outCtx.imageSmoothingEnabled = true;
    outCtx.imageSmoothingQuality = "high";

    // Draw scaled frame with proper alpha
    outCtx.drawImage(alphaCanvas, 0, 0, targetWidth, targetHeight);

    const finalData = outCtx.getImageData(0, 0, targetWidth, targetHeight);

    // Clean up
    alphaCanvas.remove();
    outCanvas.remove();

    return {
      ...frame,
      patch: finalData.data,
      dims: {
        width: targetWidth,
        height: targetHeight,
        top: 0,
        left: 0,
      },
      disposalType: 2,
    };
  }

  async processFramesInWorkers(
    frames: ParsedFrame[],
    staticImage?: HTMLCanvasElement,
  ): Promise<ProcessedFrame[]> {
    const isPixelArt = await this.gifAnalyzer.detectPixelArtInAllFrames(frames);
    const chunkSize = Math.ceil(frames.length / this.workerCount);
    const frameChunks = [];

    for (let i = 0; i < frames.length; i += chunkSize) {
      frameChunks.push(frames.slice(i, i + chunkSize));
    }

    return (
      await Promise.all(
        frameChunks.map(async (chunk) =>
          this.workerPool.addTask(() =>
            Promise.all(
              chunk.map(async (frame) =>
                this.processFrame(frame, staticImage ?? null),
              ),
            ),
          ),
        ),
      )
    ).flat();
  }
}

export default FrameProcessor;
