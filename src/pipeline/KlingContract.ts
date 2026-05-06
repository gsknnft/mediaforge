/**
 * KlingContract — Sprite-Pipeline animation prompt standard.
 *
 * When generating an animation video for a bitty / character sprite:
 *   1. Generate a clean character PNG via image_server.py
 *   2. Paste it on a FLAT #00FF00 green background (no gradients, no shadows)
 *   3. Feed to Kling (or WAN image-to-video) using buildKlingPrompt()
 *   4. Pass the video to VideoFrameExtractor → PreprocessPipeline (green screen)
 *      → SpriteAtlasExporter → VeraShellExporter
 *
 * Green screen spec: #00FF00  → RGB [0, 255, 0]
 * Key tolerance default: 42 (matches PreprocessPipeline default)
 * Standard output size: 256×256 px per cell, horizontal strip
 *
 * Source reference: LayrKits/Sprite-Pipeline SKILL.md
 */

import { createFlatBackgroundSpritePreprocess } from "./PreprocessPipeline";
import type { RgbColor, TimelinePreprocessOptions } from "./types";

// ── Constants ──────────────────────────────────────────────────────────────────

/** The Kling/Sprite-Pipeline standard matting background colour. */
export const KLING_GREEN_SCREEN: RgbColor = [0, 255, 0];

/** Standard output cell size for vera-shell sprite strips. */
export const SPRITE_CELL_SIZE = 256;

/** Recommended frame count range for Kling animation videos. */
export const KLING_FRAME_RANGE = { min: 12, max: 24 };

// ── Prompt contract ────────────────────────────────────────────────────────────

export interface KlingPromptOptions {
  /** Character description — same text used for the still generation. */
  characterDescription: string;
  /**
   * Animation pose / action description.
   * E.g. "idle breathing loop", "walk cycle side-view", "cast spell".
   */
  action: string;
  /**
   * Number of frames to generate.
   * @default 16
   */
  frames?: number;
  /**
   * Whether to request a seamless loop (first frame ≈ last frame).
   * @default true
   */
  seamlessLoop?: boolean;
}

/**
 * Build a Kling / WAN image-to-video prompt from a character + action.
 *
 * Enforces the locked-camera, centered-character, green-background contract
 * that the Sprite-Pipeline spec requires for clean frame extraction.
 */
export function buildKlingPrompt(opts: KlingPromptOptions): string {
  const frames = opts.frames ?? 16;
  const loop = opts.seamlessLoop !== false;

  const parts = [
    `The uploaded image is the exact first frame — preserve every design detail.`,
    `Locked camera: no zoom, no pan, no rotation, no camera movement of any kind.`,
    `Character stays centered in frame throughout the entire animation.`,
    `Flat solid #00FF00 green background — no gradients, no shadows, no scenery.`,
    `Flat 2D cel-shaded style — preserve the original illustration look.`,
    `Animation: ${opts.characterDescription} — ${opts.action}.`,
    `${frames} frames total.`,
    loop
      ? `Seamless loop — final frame flows back into the first frame.`
      : null,
    `No motion blur. Hard edges only. No background elements.`,
  ].filter(Boolean);

  return parts.join(" ");
}

/**
 * Negative prompt to pair with every Kling animation generation.
 * Suppresses background contamination and camera drift.
 */
export const KLING_NEGATIVE_PROMPT =
  "background details, scenery, camera movement, zoom, pan, rotation, " +
  "motion blur, soft edges, 3d render, photorealistic, gradient background, " +
  "shadow on background, white background, black background";

// ── Green screen preprocess preset ────────────────────────────────────────────

/**
 * Ready-made PreprocessPipeline config for Kling green screen (#00FF00) footage.
 *
 * Usage:
 *   const { timeline } = await PreprocessPipeline.run(rawTimeline, greenScreenPreprocess(256, 256));
 *   const atlas = await SpriteAtlasExporter.export(timeline, { targetFrameWidth: 256, ... });
 */
export function greenScreenPreprocess(
  targetWidth = SPRITE_CELL_SIZE,
  targetHeight = SPRITE_CELL_SIZE,
  opts: { keyTolerance?: number; featherRadius?: number } = {},
): TimelinePreprocessOptions {
  return createFlatBackgroundSpritePreprocess({
    targetWidth,
    targetHeight,
    keyColor: KLING_GREEN_SCREEN,
    keyTolerance: opts.keyTolerance ?? 50,
    featherRadius: opts.featherRadius ?? 1,
    alphaThreshold: 18,
    keepFrameSize: false,
  });
}
