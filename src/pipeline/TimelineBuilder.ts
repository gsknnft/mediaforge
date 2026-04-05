import { ParsedFrame } from "gifuct-js";
import type {
  MediaTimeline,
  TimelineClip,
  TimelineFrame,
  VideoExtractOptions,
} from "./types";
import { VideoFrameExtractor } from "./VideoFrameExtractor";

function normalizePatch(
  patch: Uint8ClampedArray,
): Uint8ClampedArray<ArrayBuffer> {
  if (patch.buffer instanceof ArrayBuffer) {
    return patch as Uint8ClampedArray<ArrayBuffer>;
  }
  return new Uint8ClampedArray(patch) as Uint8ClampedArray<ArrayBuffer>;
}

function createTimeline(
  id: string,
  sourceKind: MediaTimeline["sourceKind"],
  frames: TimelineFrame[],
  width: number,
  height: number,
): MediaTimeline {
  const durationMs = frames.reduce((sum, frame) => sum + frame.durationMs, 0);
  const fps =
    frames.length > 0 && durationMs > 0
      ? Math.max(1, Math.round((frames.length * 1000) / durationMs))
      : 1;

  const clip: TimelineClip = {
    name: "full",
    startFrame: 0,
    endFrame: Math.max(0, frames.length - 1),
  };

  return {
    id,
    sourceKind,
    fps,
    durationMs,
    width,
    height,
    frames,
    clips: [clip],
  };
}

export class TimelineBuilder {
  static fromGifFrames(
    frames: ParsedFrame[],
    id = "gif-timeline",
  ): MediaTimeline {
    if (!frames.length) {
      throw new Error("No GIF frames provided");
    }

    let timestampMs = 0;
    const timelineFrames: TimelineFrame[] = frames.map((frame, index) => {
      const durationMs = Math.max(10, Number(frame.delay) || 100);
      const imageData = new ImageData(
        normalizePatch(frame.patch),
        frame.dims.width,
        frame.dims.height,
      );

      const out: TimelineFrame = {
        index,
        timestampMs,
        durationMs,
        width: frame.dims.width,
        height: frame.dims.height,
        imageData,
      };

      timestampMs += durationMs;
      return out;
    });

    const first = timelineFrames[0];
    return createTimeline(id, "gif", timelineFrames, first.width, first.height);
  }

  static async fromImageSource(
    source: CanvasImageSource,
    id = "image-timeline",
    durationMs = 1000,
  ): Promise<MediaTimeline> {
    const width =
      (source as HTMLImageElement).width || (source as HTMLCanvasElement).width;
    const height =
      (source as HTMLImageElement).height ||
      (source as HTMLCanvasElement).height;

    if (!width || !height) {
      throw new Error("Unable to derive dimensions from image source");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire 2D context for image timeline");
    }

    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);

    return createTimeline(
      id,
      "image",
      [
        {
          index: 0,
          timestampMs: 0,
          durationMs: Math.max(1, durationMs),
          width,
          height,
          imageData,
        },
      ],
      width,
      height,
    );
  }

  static async fromVideo(
    options: VideoExtractOptions,
    id = "video-timeline",
  ): Promise<MediaTimeline> {
    return VideoFrameExtractor.extractFrames(options, id);
  }
}
