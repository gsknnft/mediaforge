import {
  AtlasExportOptions,
  AtlasExportResult,
  AtlasFrameMeta,
  AtlasManifest,
  MediaTimeline,
} from "./types";

function ceilDiv(a: number, b: number): number {
  return Math.floor((a + b - 1) / b);
}

export class SpriteAtlasExporter {
  static async exportTimeline(
    timeline: MediaTimeline,
    options: AtlasExportOptions = {},
  ): Promise<AtlasExportResult> {
    if (!timeline.frames.length) {
      throw new Error("Cannot export atlas from empty timeline");
    }

    const framePadding = options.framePadding ?? 2;
    const maxAtlasWidth = options.maxAtlasWidth ?? 4096;
    const maxAtlasHeight = options.maxAtlasHeight ?? 4096;
    const frameScale = Math.max(0.1, options.frameScale ?? 1);
    const fitMode = options.fitMode ?? "contain";
    const backgroundFill = options.backgroundFill ?? "";

    const frameWidth = Math.max(...timeline.frames.map((f) => f.width));
    const frameHeight = Math.max(...timeline.frames.map((f) => f.height));

    const scaledFrameWidth = Math.max(1, Math.round(frameWidth * frameScale));
    const scaledFrameHeight = Math.max(1, Math.round(frameHeight * frameScale));
    const targetFrameWidth = Math.max(
      1,
      Math.round(options.targetFrameWidth ?? scaledFrameWidth),
    );
    const targetFrameHeight = Math.max(
      1,
      Math.round(options.targetFrameHeight ?? scaledFrameHeight),
    );

    const cellWidth = targetFrameWidth + framePadding * 2;
    const cellHeight = targetFrameHeight + framePadding * 2;

    const columns = Math.max(1, Math.floor(maxAtlasWidth / cellWidth));
    const rows = ceilDiv(timeline.frames.length, columns);

    const atlasWidth = Math.min(maxAtlasWidth, columns * cellWidth);
    const atlasHeight = rows * cellHeight;

    if (atlasHeight > maxAtlasHeight) {
      throw new Error(
        `Atlas height ${atlasHeight}px exceeds max ${maxAtlasHeight}px. Reduce frame count or increase limits.`,
      );
    }

    const canvas = document.createElement("canvas");
    canvas.width = atlasWidth;
    canvas.height = atlasHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire canvas context for atlas export");
    }

    ctx.clearRect(0, 0, atlasWidth, atlasHeight);

    const frames: AtlasFrameMeta[] = timeline.frames.map((frame, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);

      const x = column * cellWidth + framePadding;
      const y = row * cellHeight + framePadding;

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = frame.width;
      frameCanvas.height = frame.height;
      const frameCtx = frameCanvas.getContext("2d");
      if (!frameCtx) {
        throw new Error("Failed to acquire frame canvas context");
      }

      frameCtx.putImageData(frame.imageData, 0, 0);

      if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(x, y, targetFrameWidth, targetFrameHeight);
      }

      const scaleX = (targetFrameWidth / frame.width) * frameScale;
      const scaleY = (targetFrameHeight / frame.height) * frameScale;
      const scale =
        fitMode === "cover"
          ? Math.max(scaleX, scaleY)
          : fitMode === "contain"
          ? Math.min(scaleX, scaleY)
          : 1;

      const drawWidth =
        fitMode === "stretch" ? targetFrameWidth : frame.width * scale;
      const drawHeight =
        fitMode === "stretch" ? targetFrameHeight : frame.height * scale;

      const drawX = x + (targetFrameWidth - drawWidth) / 2;
      const drawY = y + (targetFrameHeight - drawHeight) / 2;

      if (fitMode === "cover") {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, targetFrameWidth, targetFrameHeight);
        ctx.clip();
        ctx.drawImage(frameCanvas, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.drawImage(frameCanvas, drawX, drawY, drawWidth, drawHeight);
      }

      return {
        index,
        x,
        y,
        width: targetFrameWidth,
        height: targetFrameHeight,
        durationMs: frame.durationMs,
        timestampMs: frame.timestampMs,
      };
    });

    const manifest: AtlasManifest = {
      version: "1.0.0",
      frameCount: timeline.frames.length,
      atlasWidth,
      atlasHeight,
      frameWidth: targetFrameWidth,
      frameHeight: targetFrameHeight,
      framePadding,
      cellWidth,
      cellHeight,
      columns,
      rows,
      clips: options.clipName
        ? [
            {
              name: options.clipName,
              startFrame: 0,
              endFrame: timeline.frames.length - 1,
            },
          ]
        : timeline.clips,
      frames,
    };

    const imageType = options.imageType ?? "image/png";
    const imageQuality = options.imageQuality ?? 0.92;
    const imageBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to encode atlas image"));
            return;
          }
          resolve(blob);
        },
        imageType,
        imageQuality,
      );
    });

    return { imageBlob, manifest };
  }
}
