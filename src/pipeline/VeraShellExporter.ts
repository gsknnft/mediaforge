import { NamedClipPlanner } from "./NamedClipPlanner";
import { PixelMatrixExporter } from "./PixelMatrixExporter";
import { PreprocessPipeline } from "./PreprocessPipeline";
import { SpriteAtlasExporter } from "./SpriteAtlasExporter";
import {
  MediaTimeline,
  TimelineFrame,
  VeraExpressionHint,
  VeraShellExportOptions,
  VeraShellExportResult,
  VeraShellSpriteSheetConfig,
} from "./types";

const DEFAULT_CLIP_TO_EXPRESSION: Record<VeraExpressionHint, string> = {
  normal: "idle",
  focused: "walk",
  tired: "walk",
  alarmed: "react",
  sleeping: "blink",
  offline: "react",
};

function frameToSheetCell(
  frameIndex: number,
  columns: number,
): [number, number] {
  return [frameIndex % columns, Math.floor(frameIndex / columns)];
}

function downsampleTimeline(
  timeline: MediaTimeline,
  stride: number,
): MediaTimeline {
  if (stride <= 1) return timeline;
  const frames: TimelineFrame[] = [];
  for (let i = 0; i < timeline.frames.length; i += stride) {
    const chunk = timeline.frames.slice(i, i + stride);
    if (!chunk.length) continue;
    const durationMs = chunk.reduce((sum, frame) => sum + frame.durationMs, 0);
    const first = chunk[0];
    frames.push({
      ...first,
      index: frames.length,
      durationMs,
    });
  }
  const maxFrame = Math.max(0, frames.length - 1);
  const clips = timeline.clips.map((clip) => {
    const startFrame = Math.min(maxFrame, Math.floor(clip.startFrame / stride));
    const endFrame = Math.min(maxFrame, Math.floor(clip.endFrame / stride));
    return {
      ...clip,
      startFrame: Math.min(startFrame, endFrame),
      endFrame: Math.max(startFrame, endFrame),
    };
  });
  return {
    ...timeline,
    id: `${timeline.id}-ds${stride}`,
    fps: timeline.fps / stride,
    frames,
    clips,
  };
}

export class VeraShellExporter {
  static async exportSpriteSheet(
    timeline: MediaTimeline,
    options: VeraShellExportOptions,
  ): Promise<VeraShellExportResult> {
    const preprocessResult = await PreprocessPipeline.run(
      timeline,
      options.preprocess,
    );
    const preprocessTimeline = preprocessResult.timeline;

    const maxFrames = options.maxFrames ?? 0;
    const frameStrideOption = options.frameStride ?? 1;
    const computedStride =
      maxFrames > 0
        ? Math.max(
            frameStrideOption,
            Math.ceil(preprocessTimeline.frames.length / maxFrames),
          )
        : frameStrideOption;
    const exportTimeline = downsampleTimeline(
      preprocessTimeline,
      computedStride,
    );

    const atlas = await SpriteAtlasExporter.exportTimeline(
      exportTimeline,
      options,
    );
    const clipPlan = NamedClipPlanner.summarize(exportTimeline);

    const clipStarts = new Map<string, number>();
    for (const clip of clipPlan) {
      clipStarts.set(clip.name, clip.startFrame);
    }

    const mapping = {
      ...DEFAULT_CLIP_TO_EXPRESSION,
      ...(options.clipToExpression ?? {}),
    };

    const frames: Partial<Record<VeraExpressionHint, [number, number]>> = {};
    for (const expression of Object.keys(mapping) as VeraExpressionHint[]) {
      const clipName = mapping[expression];
      const start = clipStarts.get(clipName) ?? 0;
      frames[expression] = frameToSheetCell(start, atlas.manifest.columns);
    }

    const spriteConfig: VeraShellSpriteSheetConfig = {
      type: "sheet",
      url: options.atlasUrl,
      cellWidth: atlas.manifest.cellWidth,
      cellHeight: atlas.manifest.cellHeight,
      frames,
    };

    const pixelMatrix = options.pixelMatrix?.enabled
      ? PixelMatrixExporter.exportTimeline(exportTimeline, options.pixelMatrix)
      : undefined;

    return {
      ...atlas,
      veraShellManifest: {
        schema: "vera-shell.sprite-sheet.v1",
        timelineId: exportTimeline.id,
        atlas: atlas.manifest,
        sprite: spriteConfig,
        clips: clipPlan.map((clip) => ({
          name: clip.name,
          startFrame: clip.startFrame,
          endFrame: clip.endFrame,
          durationMs: clip.durationMs,
        })),
      },
      pixelMatrix,
      preprocess: preprocessResult.report,
    };
  }
}
