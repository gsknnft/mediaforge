import { ParsedFrame } from "gifuct-js";
import { GIFProcessor } from "../GifProcessor";
import { S3_BUCKET } from "../QuantumManager/src/config/constants";
import { BackgroundAsset, OverlayAsset } from "@/types";
import { CanvasPool } from "../runtime";

export class ProcessingService {
  private gifProcessor: GIFProcessor;
  private canvasPool: CanvasPool;
  private CONSTANTS = {
    TARGET_SIZE: 2800,
  };
  private canvasRefs: HTMLCanvasElement[];

  constructor() {
    this.gifProcessor = GIFProcessor.getInstance();
    this.canvasPool = new CanvasPool();
    this.canvasRefs = Array.from(
      { length: 4 },
      () =>
        this.canvasPool.getCanvas(
          this.CONSTANTS.TARGET_SIZE,
          this.CONSTANTS.TARGET_SIZE,
          false,
        ) as HTMLCanvasElement,
    );
  }

  async processImage(
    tokenId: number,
    background: BackgroundAsset | null,
    overlays: OverlayAsset[],
    format: "png" | "gif",
  ): Promise<Blob> {
    if (background !== null && background?.format.includes("gif")) {
      return this.processGIF(tokenId, background, overlays);
    } else {
      return this.processStatic(tokenId, background, overlays, format);
    }
  }

  private calculateGifFitDimensions(frame: ParsedFrame): {
    width: number;
    height: number;
    x: number;
    y: number;
    sourceX: number;
    sourceY: number;
    sourceWidth: number;
    sourceHeight: number;
  } {
    const { width: frameWidth, height: frameHeight } = frame.dims;
    const targetSize = this.CONSTANTS.TARGET_SIZE;
    const frameAspectRatio = frameWidth / frameHeight;

    let scaledWidth = targetSize;
    let scaledHeight = targetSize;
    let sourceX = 0,
      sourceY = 0,
      sourceWidth = frameWidth,
      sourceHeight = frameHeight;

    if (frameAspectRatio > 1) {
      // Frame is wider: crop sides
      sourceWidth = Math.round((frameHeight * targetSize) / targetSize);
      sourceX = Math.round((frameWidth - sourceWidth) / 2); // Center horizontally
    } else if (frameAspectRatio < 1) {
      // Frame is taller: crop top/bottom
      sourceHeight = Math.round((frameWidth * targetSize) / targetSize);
      sourceY = Math.round((frameHeight - sourceHeight) / 2); // Center vertically
    }

    return {
      width: scaledWidth,
      height: scaledHeight,
      x: 0, // Centered in target canvas
      y: 0,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
    };
  }

  private detectPixelArt(frame: ParsedFrame): boolean {
    if (!frame.patch || !frame.dims) return false;

    const { width, height } = frame.dims;
    const totalPixels = width * height;
    const uniqueColors = new Set<string>();
    let transparentPixelCount = 0;

    // Collect unique colors and count transparent pixels
    for (let i = 0; i < frame.patch.length; i += 4) {
      if (frame.patch[i + 3] === 0) {
        transparentPixelCount++;
        continue; // Skip fully transparent pixels
      }
      const color = `${frame.patch[i]},${frame.patch[i + 1]},${frame.patch[i + 2]}`;
      uniqueColors.add(color);
    }

    // Calculate transparency ratio and color density ratio
    const transparencyRatio = transparentPixelCount / totalPixels;
    const colorDensityRatio = uniqueColors.size / totalPixels;

    // Adjust thresholds for better detection
    const isSmallDimension = totalPixels <= 512 * 512; // Allow slightly larger dimensions
    const hasLowColorDensity = colorDensityRatio < 0.15; // Slightly relaxed threshold
    const hasHighTransparency = transparencyRatio >= 0.2; // At least 20% transparency

    return isSmallDimension && (hasLowColorDensity || hasHighTransparency);
  }

  private async processGIF(
    tokenId: number,
    background: BackgroundAsset,
    overlays: OverlayAsset[],
  ): Promise<Blob> {
    const bglessUrl = `${S3_BUCKET}/${tokenId}.png`;
    const frames = await this.gifProcessor.extractFrames(background.url);

    const isPixelArt = this.detectPixelArt(frames[0]);
    const quality = isPixelArt ? "PIXEL" : "HIGH"; // Dynamically choose quality

    return this.gifProcessor.generateGIF(frames, bglessUrl, overlays, quality, {
      optimizeFrames: !isPixelArt,
      disposeToBackground: isPixelArt,
    });
  }

  private loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error);
        reject(error);
      };
      image.src = src;
    });
  };

  private async processStatic(
    tokenId: number,
    background: BackgroundAsset | null,
    overlays: OverlayAsset[],
    format: "png" | "gif",
    index: number = 0,
  ): Promise<Blob> {
    const canvas = this.canvasRefs[index];
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (background === null && overlays === null) {
      throw new Error("No background or overlays selected");
    }
    if (!context) {
      throw new Error("Failed to get canvas context");
    }

    // 1. Draw Background
    if (background) {
      const backgroundImage = await this.loadImage(background.url);
      context.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Base Image
    const backgroundlessImage = await this.loadImage(
      `${S3_BUCKET}/${tokenId}.png`,
    );
    context.drawImage(backgroundlessImage, 0, 0, canvas.width, canvas.height);

    // 3. Draw Overlays
    if (overlays !== null) {
      for (const overlay of overlays) {
        const overlayImage = await this.loadImage(overlay.url);
        context.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
      }
    }

    // Generate Filename
    const bgName = background?.name || "no-bg";
    const overlayNames =
      (overlays ?? []).length > 0
        ? `_${overlays!.map((o) => o?.name ?? "").join("-")}`
        : "";
    const fileName = `AF${tokenId}_${bgName}${overlayNames}.${format}`;

    // Save Image
    const dataUrl = canvas.toDataURL(`image/${format}`);
    this.downloadDataUrl(dataUrl, fileName);

    // Convert dataUrl to Blob and return it
    const response = await fetch(dataUrl);
    return response.blob();
  }

  private downloadBlob = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);

    requestAnimationFrame(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 5000);
    });
  };

  private downloadDataUrl = (dataUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);

    requestAnimationFrame(() => {
      link.click();
      document.body.removeChild(link);
    });
  };
}
