import { CutEngine } from "./CutEngine";
import {
  MediaTimeline,
  NamedClipPlanOptions,
  NamedClipRange,
  VeraClipName,
} from "./types";

const DEFAULT_ORDER: VeraClipName[] = ["idle", "walk", "blink", "react"];
const DEFAULT_RATIOS: Record<VeraClipName, [number, number]> = {
  idle: [0, 0.35],
  walk: [0.35, 0.7],
  blink: [0.7, 0.85],
  react: [0.85, 1],
};

function clampFrame(frame: number, maxFrame: number): number {
  return Math.max(0, Math.min(maxFrame, frame));
}

function durationForClip(
  timeline: MediaTimeline,
  range: NamedClipRange,
): number {
  let total = 0;
  for (let i = range.startFrame; i <= range.endFrame; i += 1) {
    total += timeline.frames[i]?.durationMs ?? 0;
  }
  return total;
}

export class NamedClipPlanner {
  static plan(
    timeline: MediaTimeline,
    options: NamedClipPlanOptions = {},
  ): NamedClipRange[] {
    if (!timeline.frames.length) {
      throw new Error("Cannot plan clips for an empty timeline");
    }

    const maxFrame = timeline.frames.length - 1;
    const minClipFrames = Math.max(1, options.minClipFrames ?? 1);

    return DEFAULT_ORDER.map((name) => {
      const override = options.clips?.[name];
      if (
        override?.startFrame !== undefined ||
        override?.endFrame !== undefined
      ) {
        const start = clampFrame(override.startFrame ?? 0, maxFrame);
        const end = clampFrame(
          override.endFrame ?? Math.max(start, start + minClipFrames - 1),
          maxFrame,
        );
        return {
          name,
          startFrame: Math.min(start, end),
          endFrame: Math.max(start, end),
        };
      }

      const [startRatio, endRatio] = DEFAULT_RATIOS[name];
      const startFrame = clampFrame(
        Math.floor(startRatio * timeline.frames.length),
        maxFrame,
      );
      const endFrame = clampFrame(
        Math.max(
          startFrame + minClipFrames - 1,
          Math.ceil(endRatio * timeline.frames.length) - 1,
        ),
        maxFrame,
      );

      return {
        name,
        startFrame,
        endFrame,
      };
    });
  }

  static split(
    timeline: MediaTimeline,
    options: NamedClipPlanOptions = {},
  ): Record<string, MediaTimeline> {
    const plan = this.plan(timeline, options);
    const result: Record<string, MediaTimeline> = {};

    for (const clip of plan) {
      result[clip.name] = CutEngine.cutByFrame(
        timeline,
        clip.startFrame,
        clip.endFrame,
        clip.name,
      );
    }

    return result;
  }

  static summarize(
    timeline: MediaTimeline,
    options: NamedClipPlanOptions = {},
  ): Array<NamedClipRange & { durationMs: number }> {
    return this.plan(timeline, options).map((clip) => ({
      ...clip,
      durationMs: durationForClip(timeline, clip),
    }));
  }
}
