import type {
  MediaTimeline,
  TimelineClip,
  TimelineFrame,
  VideoExtractOptions,
} from "./types";

function waitForEvent(target: EventTarget, eventName: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const onResolve = () => {
      cleanup();
      resolve();
    };
    const onReject = () => {
      cleanup();
      reject(new Error(`Video event failed: ${eventName}`));
    };
    const cleanup = () => {
      target.removeEventListener(eventName, onResolve as EventListener);
      target.removeEventListener("error", onReject as EventListener);
    };

    target.addEventListener(eventName, onResolve as EventListener, {
      once: true,
    });
    target.addEventListener("error", onReject as EventListener, { once: true });
  });
}

export class VideoFrameExtractor {
  static async extractFrames(
    options: VideoExtractOptions,
    timelineId = "video-timeline",
  ): Promise<MediaTimeline> {
    const {
      src,
      fps = 12,
      startMs = 0,
      endMs,
      maxFrames = 240,
      crossOrigin = "anonymous",
    } = options;

    if (!src) {
      throw new Error("Video source is required");
    }

    const video = document.createElement("video");
    video.preload = "auto";
    video.crossOrigin = crossOrigin;
    video.muted = true;
    video.playsInline = true;
    video.src = src;

    await waitForEvent(video, "loadedmetadata");

    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      throw new Error("Failed to load video dimensions");
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire canvas context for video extraction");
    }

    const effectiveEndMs = Math.max(
      startMs,
      endMs ?? Math.floor(video.duration * 1000),
    );

    const intervalMs = Math.max(1, Math.floor(1000 / fps));
    const frames: TimelineFrame[] = [];

    let t = Math.max(0, startMs);
    while (t <= effectiveEndMs && frames.length < maxFrames) {
      video.currentTime = t / 1000;
      await waitForEvent(video, "seeked");

      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);

      frames.push({
        index: frames.length,
        timestampMs: t,
        durationMs: intervalMs,
        width,
        height,
        imageData,
      });

      t += intervalMs;
    }

    if (!frames.length) {
      throw new Error("No frames extracted from video source");
    }

    const totalDurationMs = frames.reduce(
      (sum, frame) => sum + frame.durationMs,
      0,
    );
    const clip: TimelineClip = {
      name: "full",
      startFrame: 0,
      endFrame: frames.length - 1,
    };

    return {
      id: timelineId,
      sourceKind: "video",
      fps,
      durationMs: totalDurationMs,
      width,
      height,
      frames,
      clips: [clip],
    };
  }
}
