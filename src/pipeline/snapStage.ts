import type {
  RgbColor,
  TimelinePreprocessOptions,
  TimelinePreprocessStage,
} from "./types";
import { createFlatBackgroundSpritePreprocess } from "./PreprocessPipeline";

// ── Image Snap Stage ──────────────────────────────────────────────────────────
// Generalised image cleanup as a MediaForge preprocess stage.
// Inspired by Hugo-Dz/spritefusion-pixel-snapper (K-means + Sobel + elastic walker)
// but extended to all art styles — not just pixel art.
//
// Modes:
//   pixel        → k=16,  strong edge sharpening, full palette snap  (pixel art / RTS sprites)
//   illustrative → k=48,  moderate sharpening, soft palette          (concept art / cartoon)
//   smooth       → k=128, mild sharpening, denoise focus             (photo / realistic)
//   edge-only    → no quantize, strong Sobel-based edge enhance      (silhouette cleanup)
//   bg-remove    → delegates to createFlatBackgroundSpritePreprocess  (chroma-key + center)

export type ImageSnapMode =
  | "pixel"
  | "illustrative"
  | "smooth"
  | "edge-only"
  | "bg-remove";

export interface ImageSnapOptions {
  mode?: ImageSnapMode;
  /** Override palette size (auto-set per mode when omitted) */
  kColors?: number;
  /** Edge sharpening strength 0–2 (auto per mode when omitted) */
  edgeStrength?: number;
  // bg-remove passthrough:
  targetWidth?: number;
  targetHeight?: number;
  keyColor?: RgbColor;
  keyTolerance?: number;
  featherRadius?: number;
  alphaThreshold?: number;
}

interface ModeDefaults {
  kColors: number;
  edgeStrength: number;
}

const MODE_DEFAULTS: Record<Exclude<ImageSnapMode, "bg-remove">, ModeDefaults> = {
  pixel:        { kColors: 16,  edgeStrength: 1.4 },
  illustrative: { kColors: 48,  edgeStrength: 0.9 },
  smooth:       { kColors: 128, edgeStrength: 0.35 },
  "edge-only":  { kColors: 0,   edgeStrength: 1.6 },
};

// ── Pure pixel ops (no canvas required) ──────────────────────────────────────

function clamp8(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
}

function colorDistSq(
  a: [number, number, number],
  b: [number, number, number],
): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

/**
 * K-means++ colour quantization in-place on RGBA Uint8ClampedArray.
 * Transparent pixels (alpha < 128) are skipped.
 */
function kmeansQuantize(
  data: Uint8ClampedArray,
  k: number,
  maxIter = 15,
): void {
  if (k <= 0) return;
  const pixelCount = data.length >> 2;

  // Sample up to 3000 opaque pixels for centroid fitting
  const step = Math.max(1, Math.floor(pixelCount / 3000));
  const samples: [number, number, number][] = [];
  for (let i = 0; i < pixelCount; i += step) {
    const o = i << 2;
    if (data[o + 3] < 128) continue;
    samples.push([data[o], data[o + 1], data[o + 2]]);
  }
  if (samples.length < k) return;

  // k-means++ initialisation
  const centroids: [number, number, number][] = [
    samples[Math.floor(Math.random() * samples.length)],
  ];
  while (centroids.length < k) {
    const dists = samples.map((s) =>
      Math.min(...centroids.map((c) => colorDistSq(s, c))),
    );
    const total = dists.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < dists.length; i++) {
      r -= dists[i];
      if (r <= 0) {
        centroids.push(samples[i]!);
        break;
      }
    }
    if (centroids.length < k) centroids.push(samples[samples.length - 1]!);
  }

  // Iterate
  for (let iter = 0; iter < maxIter; iter++) {
    const sums = centroids.map(() => [0, 0, 0] as [number, number, number]);
    const counts = new Int32Array(k);

    for (const s of samples) {
      let best = 0;
      let bestDist = Infinity;
      for (let j = 0; j < k; j++) {
        const d = colorDistSq(s, centroids[j]!);
        if (d < bestDist) {
          bestDist = d;
          best = j;
        }
      }
      sums[best]![0] += s[0];
      sums[best]![1] += s[1];
      sums[best]![2] += s[2];
      counts[best]++;
    }

    let moved = false;
    for (let j = 0; j < k; j++) {
      if (!counts[j]) continue;
      const nr = sums[j]![0] / counts[j];
      const ng = sums[j]![1] / counts[j];
      const nb = sums[j]![2] / counts[j];
      if (
        Math.abs(nr - centroids[j]![0]) +
          Math.abs(ng - centroids[j]![1]) +
          Math.abs(nb - centroids[j]![2]) >
        0.5
      )
        moved = true;
      centroids[j] = [nr, ng, nb];
    }
    if (!moved) break;
  }

  // Remap every opaque pixel to nearest centroid
  for (let i = 0; i < pixelCount; i++) {
    const o = i << 2;
    if (data[o + 3] < 128) continue;
    const rgb: [number, number, number] = [data[o], data[o + 1], data[o + 2]];
    let best = 0;
    let bestDist = Infinity;
    for (let j = 0; j < k; j++) {
      const d = colorDistSq(rgb, centroids[j]!);
      if (d < bestDist) {
        bestDist = d;
        best = j;
      }
    }
    data[o]     = clamp8(centroids[best]![0]);
    data[o + 1] = clamp8(centroids[best]![1]);
    data[o + 2] = clamp8(centroids[best]![2]);
  }
}

/**
 * Unsharp mask — sharpens edges without a grid snap.
 * Equivalent to: result = original + amount × (original − blurred)
 * Uses a simple 3×3 box blur for the low-pass step.
 */
function unsharpMask(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number,
): void {
  if (amount <= 0) return;
  const blurred = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = Math.max(0, Math.min(height - 1, y + dy));
        for (let dx = -1; dx <= 1; dx++) {
          const nx = Math.max(0, Math.min(width - 1, x + dx));
          const o = (ny * width + nx) << 2;
          r += data[o]; g += data[o + 1]; b += data[o + 2];
          n++;
        }
      }
      const o = (y * width + x) << 2;
      blurred[o]     = r / n;
      blurred[o + 1] = g / n;
      blurred[o + 2] = b / n;
      blurred[o + 3] = data[o + 3];
    }
  }

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    data[i]     = clamp8(data[i]     + amount * (data[i]     - blurred[i]));
    data[i + 1] = clamp8(data[i + 1] + amount * (data[i + 1] - blurred[i + 1]));
    data[i + 2] = clamp8(data[i + 2] + amount * (data[i + 2] - blurred[i + 2]));
  }
}

/**
 * Sobel-based edge enhance — adds the edge map back to the image.
 * Stronger than unsharp mask for silhouette-style cleanup.
 */
function sobelEnhance(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  amount: number,
): void {
  if (amount <= 0) return;
  const edges = new Float32Array(data.length >> 2);
  const Kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const Ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let gx = 0, gy = 0, ki = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = Math.max(0, Math.min(height - 1, y + dy));
          const nx = Math.max(0, Math.min(width - 1, x + dx));
          const o = (ny * width + nx) << 2;
          // luminance
          const lum = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
          gx += Kx[ki]! * lum;
          gy += Ky[ki]! * lum;
          ki++;
        }
      }
      edges[y * width + x] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  // Normalise and blend back
  let maxEdge = 0;
  for (let i = 0; i < edges.length; i++) if (edges[i]! > maxEdge) maxEdge = edges[i]!;
  if (maxEdge === 0) return;
  const scale = amount / maxEdge;

  for (let i = 0; i < edges.length; i++) {
    const o = i << 2;
    if (data[o + 3] < 128) continue;
    const boost = edges[i]! * scale * 64; // 64 = empirical pixel boost ceiling
    data[o]     = clamp8(data[o]     + boost);
    data[o + 1] = clamp8(data[o + 1] + boost);
    data[o + 2] = clamp8(data[o + 2] + boost);
  }
}

// ── Stage factory ─────────────────────────────────────────────────────────────

/**
 * Returns a single MediaForge preprocess stage that applies image cleanup
 * tuned for the given art style. Works on any ImageData — no binary required.
 *
 * @example
 * // Verse-Fighters character frame — cartoon cleanup
 * const stage = createImageSnapStage({ mode: "illustrative" });
 *
 * // Protocol-Wars RTS unit — classic pixel art look
 * const stage = createImageSnapStage({ mode: "pixel", kColors: 12 });
 *
 * // Photo reference for TriPoSR preprocessing — just denoise
 * const stage = createImageSnapStage({ mode: "smooth" });
 */
export function createImageSnapStage(opts: ImageSnapOptions = {}): TimelinePreprocessStage {
  const mode = opts.mode ?? "illustrative";

  return {
    id: `image-snap-${mode}`,
    run: (frame) => {
      const { imageData, width, height } = frame;
      const out = new ImageData(
        new Uint8ClampedArray(imageData.data),
        width,
        height,
      );
      const px = out.data;
      const defaults = mode !== "bg-remove" ? MODE_DEFAULTS[mode] : null;
      const k = opts.kColors ?? defaults?.kColors ?? 48;
      const strength = opts.edgeStrength ?? defaults?.edgeStrength ?? 1.0;

      // 1. palette reduction
      kmeansQuantize(px, k);

      // 2. edge sharpening — Sobel for pixel/edge-only, unsharp for others
      if (mode === "pixel" || mode === "edge-only") {
        sobelEnhance(px, width, height, strength);
      } else {
        unsharpMask(px, width, height, strength);
      }

      return {
        imageData: out,
        preprocess: {
          diagnostics: { stage: `image-snap-${mode}`, kColors: k, edgeStrength: strength },
        },
      };
    },
  };
}

/**
 * Returns a full TimelinePreprocessOptions that chains bg-remove → snap.
 * Use this when the source has a flat background that needs cutting first.
 */
export function createSnapWithBgRemove(opts: ImageSnapOptions & {
  targetWidth: number;
  targetHeight: number;
}): TimelinePreprocessOptions {
  const bgOpts = createFlatBackgroundSpritePreprocess({
    targetWidth: opts.targetWidth,
    targetHeight: opts.targetHeight,
    keyColor: opts.keyColor,
    keyTolerance: opts.keyTolerance,
    featherRadius: opts.featherRadius,
    alphaThreshold: opts.alphaThreshold,
  });

  const snapStage = createImageSnapStage({ ...opts, mode: opts.mode === "bg-remove" ? "illustrative" : opts.mode });

  return {
    enabled: true,
    stages: [...(bgOpts.stages ?? []), snapStage],
  };
}

/**
 * Convenience: build a preprocess options object from snap opts alone.
 * bg-remove mode automatically chains flatBackground stages before snap.
 */
export function createImageSnapPreprocess(opts: ImageSnapOptions & {
  targetWidth?: number;
  targetHeight?: number;
}): TimelinePreprocessOptions {
  if (opts.mode === "bg-remove") {
    return createSnapWithBgRemove({
      ...opts,
      targetWidth: opts.targetWidth ?? 256,
      targetHeight: opts.targetHeight ?? 256,
    });
  }
  return {
    enabled: true,
    stages: [createImageSnapStage(opts)],
  };
}
