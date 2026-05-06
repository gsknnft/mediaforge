/**
 * SpriteValidator — validation and promotion rules for vera-shell sprite strips.
 *
 * Before exporting a timeline as a final sprite sheet, run validate() to catch:
 *   - Too few frames (incomplete animation)
 *   - Inconsistent frame sizes (mismatched source video)
 *   - Scale drift between frames (camera zoom leaked through)
 *   - Poor quality frames (blank / near-blank alpha mask)
 *
 * Source reference: LayrKits/Sprite-Pipeline SKILL.md (validate before promote)
 */

import { KLING_FRAME_RANGE, SPRITE_CELL_SIZE } from "./KlingContract";
import type { MediaTimeline, TimelineFrame } from "./types";

// ── Result types ───────────────────────────────────────────────────────────────

export type SpriteValidationLevel = "error" | "warning" | "info";

export interface SpriteValidationIssue {
  level: SpriteValidationLevel;
  code: string;
  message: string;
  frameIndex?: number;
}

export interface SpriteValidationResult {
  /** True if there are no errors (warnings are allowed). */
  valid: boolean;
  issues: SpriteValidationIssue[];
  stats: {
    frameCount: number;
    frameWidth: number;
    frameHeight: number;
    /** Fraction of frames with alpha mask data available. */
    alphaCoverage: number;
    /** Estimated subject coverage — avg non-zero alpha pixels / total pixels. */
    avgSubjectCoverage: number;
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function alphaCoverageOfFrame(frame: TimelineFrame): number {
  const mask = frame.preprocess?.alphaMask;
  if (!mask) return 1; // no mask = assume full coverage (raw unprocessed frame)
  const total = mask.length;
  if (total === 0) return 0;
  let nonZero = 0;
  for (let i = 0; i < total; i++) {
    if (mask[i] > 0) nonZero++;
  }
  return nonZero / total;
}

function imageDataVariance(imageData: ImageData): number {
  // Cheap per-channel variance estimate on a 1-in-8 sample for speed.
  const { data } = imageData;
  const n = Math.floor(data.length / 4);
  const sample = Math.max(1, Math.floor(n / 64));
  let sum = 0;
  let sumSq = 0;
  let count = 0;
  for (let i = 0; i < n; i += sample) {
    const luma = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
    sum += luma;
    sumSq += luma * luma;
    count++;
  }
  if (count === 0) return 0;
  const mean = sum / count;
  return sumSq / count - mean * mean;
}

// ── Validator ─────────────────────────────────────────────────────────────────

export interface SpriteValidateOptions {
  /** Expected output cell size. @default 256 */
  cellSize?: number;
  /** Minimum acceptable frame count. @default KLING_FRAME_RANGE.min */
  minFrames?: number;
  /** Maximum acceptable frame count. @default KLING_FRAME_RANGE.max */
  maxFrames?: number;
  /**
   * Minimum non-zero alpha fraction per frame (after green screen removal).
   * Frames below this are flagged as near-blank.
   * @default 0.02  (2% of pixels must be subject)
   */
  minSubjectCoverage?: number;
  /**
   * Maximum allowed subject coverage deviation between frames.
   * Large deviations indicate camera zoom / character pop.
   * @default 0.25
   */
  maxCoverageDeviation?: number;
  /**
   * Flag frames where image variance is extremely low (blank / solid colour).
   * @default 20
   */
  minVariance?: number;
}

/**
 * Validate a preprocessed MediaTimeline before promoting it to a sprite strip.
 *
 * Run AFTER PreprocessPipeline (green screen removal + centering) but BEFORE
 * SpriteAtlasExporter — so bad frames don't make it into the final sheet.
 */
export function validateSprite(
  timeline: MediaTimeline,
  opts: SpriteValidateOptions = {},
): SpriteValidationResult {
  const cellSize = opts.cellSize ?? SPRITE_CELL_SIZE;
  const minFrames = opts.minFrames ?? KLING_FRAME_RANGE.min;
  const maxFrames = opts.maxFrames ?? KLING_FRAME_RANGE.max;
  const minCoverage = opts.minSubjectCoverage ?? 0.02;
  const maxDeviation = opts.maxCoverageDeviation ?? 0.25;
  const minVariance = opts.minVariance ?? 20;

  const issues: SpriteValidationIssue[] = [];
  const frames = timeline.frames;

  // ── Frame count ────────────────────────────────────────────────────────────
  if (frames.length < minFrames) {
    issues.push({
      level: "error",
      code: "TOO_FEW_FRAMES",
      message: `Timeline has ${frames.length} frames; minimum is ${minFrames}. Generate a longer video or lower minFrames.`,
    });
  }
  if (frames.length > maxFrames) {
    issues.push({
      level: "warning",
      code: "TOO_MANY_FRAMES",
      message: `Timeline has ${frames.length} frames; recommended max is ${maxFrames}. Consider applying a frameStride in SpriteAtlasExporter.`,
    });
  }

  // ── Consistent frame size ─────────────────────────────────────────────────
  const refW = frames[0]?.width ?? 0;
  const refH = frames[0]?.height ?? 0;
  for (let i = 1; i < frames.length; i++) {
    const f = frames[i];
    if (f.width !== refW || f.height !== refH) {
      issues.push({
        level: "error",
        code: "INCONSISTENT_FRAME_SIZE",
        message: `Frame ${i} is ${f.width}×${f.height}, expected ${refW}×${refH}. Source video has variable dimensions.`,
        frameIndex: i,
      });
    }
  }

  // ── Target cell size mismatch ─────────────────────────────────────────────
  if (refW !== cellSize || refH !== cellSize) {
    issues.push({
      level: "warning",
      code: "CELL_SIZE_MISMATCH",
      message: `Frames are ${refW}×${refH}; target cell size is ${cellSize}×${cellSize}. SpriteAtlasExporter will rescale — verify fitMode.`,
    });
  }

  // ── Per-frame coverage + variance ────────────────────────────────────────
  const coverages: number[] = [];
  let alphaCoverageFrames = 0;

  for (let i = 0; i < frames.length; i++) {
    const f = frames[i];
    const hasMask = Boolean(f.preprocess?.alphaMask);
    if (hasMask) alphaCoverageFrames++;

    const cov = alphaCoverageOfFrame(f);
    coverages.push(cov);

    if (hasMask && cov < minCoverage) {
      issues.push({
        level: "warning",
        code: "NEAR_BLANK_FRAME",
        message: `Frame ${i} has only ${(cov * 100).toFixed(1)}% subject coverage — may be a blank/transition frame.`,
        frameIndex: i,
      });
    }

    const variance = imageDataVariance(f.imageData);
    if (variance < minVariance) {
      issues.push({
        level: "warning",
        code: "LOW_VARIANCE_FRAME",
        message: `Frame ${i} has very low image variance (${variance.toFixed(1)}) — may be blank or near-solid colour.`,
        frameIndex: i,
      });
    }
  }

  // ── Coverage deviation (scale drift / zoom leak) ─────────────────────────
  if (coverages.length > 1) {
    const avgCov = coverages.reduce((a, b) => a + b, 0) / coverages.length;
    for (let i = 0; i < coverages.length; i++) {
      const deviation = Math.abs(coverages[i] - avgCov);
      if (deviation > maxDeviation) {
        issues.push({
          level: "warning",
          code: "COVERAGE_DRIFT",
          message: `Frame ${i} coverage deviates ${(deviation * 100).toFixed(1)}% from average — possible camera zoom or subject pop.`,
          frameIndex: i,
        });
      }
    }
  }

  const avgSubjectCoverage =
    coverages.length > 0
      ? coverages.reduce((a, b) => a + b, 0) / coverages.length
      : 0;

  const hasErrors = issues.some((i) => i.level === "error");

  return {
    valid: !hasErrors,
    issues,
    stats: {
      frameCount: frames.length,
      frameWidth: refW,
      frameHeight: refH,
      alphaCoverage:
        frames.length > 0 ? alphaCoverageFrames / frames.length : 0,
      avgSubjectCoverage,
    },
  };
}
