import { MediaTimeline, TimelineClip, TimelineFrame } from "./types";

function cloneFrames(frames: TimelineFrame[]): TimelineFrame[] {
  return frames.map((frame, index) => ({
    ...frame,
    index,
  }));
}

function recalcTiming(frames: TimelineFrame[]): {
  frames: TimelineFrame[];
  durationMs: number;
  fps: number;
} {
  let timestampMs = 0;
  const normalized = frames.map((frame, index) => {
    const durationMs = Math.max(1, Math.round(frame.durationMs || 0));
    const next = {
      ...frame,
      index,
      timestampMs,
      durationMs,
    };
    timestampMs += durationMs;
    return next;
  });

  const durationMs = timestampMs;
  const fps =
    normalized.length > 0 && durationMs > 0
      ? Math.max(1, Math.round((normalized.length * 1000) / durationMs))
      : 1;

  return { frames: normalized, durationMs, fps };
}

export class CutEngine {
  static cutByFrame(
    timeline: MediaTimeline,
    startFrame: number,
    endFrameInclusive: number,
    clipName = "clip",
  ): MediaTimeline {
    if (timeline.frames.length === 0) {
      throw new Error("Cannot cut an empty timeline");
    }

    const start = Math.max(0, startFrame);
    const end = Math.min(timeline.frames.length - 1, endFrameInclusive);
    if (end < start) {
      throw new Error(
        `Invalid frame range: ${startFrame}-${endFrameInclusive}`,
      );
    }

    const slice = cloneFrames(timeline.frames.slice(start, end + 1));
    const timing = recalcTiming(slice);

    const clip: TimelineClip = {
      name: clipName,
      startFrame: 0,
      endFrame: timing.frames.length - 1,
    };

    return {
      ...timeline,
      id: `${timeline.id}:${clipName}`,
      fps: timing.fps,
      durationMs: timing.durationMs,
      frames: timing.frames,
      clips: [clip],
    };
  }

  static cutByTime(
    timeline: MediaTimeline,
    startMs: number,
    endMs: number,
    clipName = "clip",
  ): MediaTimeline {
    if (timeline.frames.length === 0) {
      throw new Error("Cannot cut an empty timeline");
    }

    const start = Math.max(0, startMs);
    const end = Math.max(start, endMs);

    const selected = timeline.frames.filter((frame) => {
      const frameStart = frame.timestampMs;
      const frameEnd = frame.timestampMs + frame.durationMs;
      return frameEnd > start && frameStart <= end;
    });

    if (selected.length === 0) {
      throw new Error(`No frames found in range ${startMs}-${endMs}ms`);
    }

    return this.cutByFrame(
      { ...timeline, frames: selected },
      0,
      selected.length - 1,
      clipName,
    );
  }

  static sampleEvery(
    timeline: MediaTimeline,
    step: number,
    clipName = "sampled",
  ): MediaTimeline {
    if (step <= 0) {
      throw new Error("step must be greater than 0");
    }

    const sampled = timeline.frames.filter((_, index) => index % step === 0);
    if (sampled.length === 0) {
      throw new Error("Sampling removed all frames");
    }

    return this.cutByFrame(
      { ...timeline, frames: sampled },
      0,
      sampled.length - 1,
      clipName,
    );
  }
}
