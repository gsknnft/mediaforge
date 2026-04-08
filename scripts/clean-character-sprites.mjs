#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

const DEFAULT_INPUT_DIR = path.join(
  repoRoot,
  "packages/vera-shell/public/assets/vera",
);
const DEFAULT_OUTPUT_DIR = path.join(
  repoRoot,
  "packages/vera-shell/public/assets/vera-clean",
);

const DEFAULT_NAMES = [
  "normal",
  "focused",
  "tired",
  "happy",
  "thinking",
  "alarmed",
  "sleeping",
  "sad",
  "offline",
];

const MODE_PRESETS = {
  soft: {
    bgThreshold: 20,
    edgeAlphaCutoff: 64,
    trimPx: 0,
    haloStripPasses: 0,
  },
  balanced: {
    bgThreshold: 24,
    edgeAlphaCutoff: 88,
    trimPx: 1,
    haloStripPasses: 1,
  },
  aggressive: {
    bgThreshold: 28,
    edgeAlphaCutoff: 110,
    trimPx: 2,
    haloStripPasses: 2,
  },
};

let canvasLoader = null;

function parseArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  return value && !value.startsWith("--") ? value : fallback;
}

function parseListArg(flag, fallback = []) {
  const raw = parseArg(flag, "");
  if (!raw) return fallback;
  return raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function hasArg(flag) {
  return process.argv.includes(flag);
}

function parseMaybeInt(value, fallback) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseNonNegativeIntArg(flag, fallback) {
  const raw = parseArg(flag, String(fallback));
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function resolveModePreset() {
  const raw = parseArg("--mode", "balanced").trim().toLowerCase();
  if (raw in MODE_PRESETS) return { name: raw, ...MODE_PRESETS[raw] };
  return { name: "balanced", ...MODE_PRESETS.balanced };
}

async function loadCanvasTools() {
  if (canvasLoader) return canvasLoader;
  try {
    const mod = await import("canvas");
    canvasLoader = {
      createCanvas: mod.createCanvas,
      loadImage: mod.loadImage,
    };
    return canvasLoader;
  } catch {
    return null;
  }
}

async function readPngRobust(filePath) {
  const inputBuffer = await fs.readFile(filePath);
  try {
    return PNG.sync.read(inputBuffer);
  } catch (error) {
    const canvasTools = await loadCanvasTools();
    if (!canvasTools) throw error;
    const image = await canvasTools.loadImage(filePath);
    const canvas = canvasTools.createCanvas(image.width, image.height);
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, image.width, image.height);
    ctx.drawImage(image, 0, 0);
    const img = ctx.getImageData(0, 0, image.width, image.height);
    const out = new PNG({ width: image.width, height: image.height });
    out.data.set(img.data);
    return out;
  }
}

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function estimateBackgroundColors(png) {
  const corners = [
    0,
    (png.width - 1) * 4,
    (png.height - 1) * png.width * 4,
    ((png.height - 1) * png.width + (png.width - 1)) * 4,
  ];
  const colors = [];
  for (const idx of corners) {
    colors.push([png.data[idx], png.data[idx + 1], png.data[idx + 2]]);
  }
  return colors;
}

function keyOutBackground(png, colors, threshold) {
  const { width, height, data } = png;
  const total = width * height;
  const candidate = new Uint8Array(total);

  for (let p = 0; p < total; p += 1) {
    const i = p * 4;
    if (data[i + 3] === 0) continue;

    const rgb = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(rgb[0], rgb[1], rgb[2]);
    const min = Math.min(rgb[0], rgb[1], rgb[2]);
    const isNeutral = max - min <= 12;
    const isCheckerLike = isNeutral && max >= 145;
    const nearBackground = colors.some(
      (color) => colorDistance(rgb, color) <= threshold,
    );

    if (nearBackground || isCheckerLike) {
      candidate[p] = 1;
    }
  }

  // Only clear candidate pixels that are connected to the image border.
  // This preserves dark interior details that share background-like colors.
  const visited = new Uint8Array(total);
  const queue = [];

  const pushIfCandidate = (p) => {
    if (p < 0 || p >= total) return;
    if (!candidate[p] || visited[p]) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    pushIfCandidate(x);
    pushIfCandidate((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    pushIfCandidate(y * width);
    pushIfCandidate(y * width + (width - 1));
  }

  while (queue.length > 0) {
    const p = queue.pop();
    const x = p % width;
    const y = Math.floor(p / width);

    if (x > 0) pushIfCandidate(p - 1);
    if (x < width - 1) pushIfCandidate(p + 1);
    if (y > 0) pushIfCandidate(p - width);
    if (y < height - 1) pushIfCandidate(p + width);
  }

  for (let p = 0; p < total; p += 1) {
    if (!visited[p]) continue;
    data[p * 4 + 3] = 0;
  }
}

function hasMeaningfulTransparency(png) {
  let transparentPixels = 0;
  const totalPixels = png.width * png.height;
  for (let i = 3; i < png.data.length; i += 4) {
    if (png.data[i] < 250) transparentPixels += 1;
  }
  return transparentPixels / Math.max(1, totalPixels) > 0.01;
}

function keepLargestAlphaComponent(png) {
  const { width, height, data } = png;
  const total = width * height;
  const visited = new Uint8Array(total);
  let bestComponent = null;

  const neighbors = (idx) => {
    const x = idx % width;
    const y = Math.floor(idx / width);
    const out = [];
    if (x > 0) out.push(idx - 1);
    if (x < width - 1) out.push(idx + 1);
    if (y > 0) out.push(idx - width);
    if (y < height - 1) out.push(idx + width);
    return out;
  };

  for (let p = 0; p < total; p += 1) {
    if (visited[p]) continue;
    const alpha = data[p * 4 + 3];
    if (alpha <= 0) {
      visited[p] = 1;
      continue;
    }

    const queue = [p];
    visited[p] = 1;
    const component = [];

    while (queue.length > 0) {
      const current = queue.pop();
      component.push(current);
      for (const next of neighbors(current)) {
        if (visited[next]) continue;
        visited[next] = 1;
        if (data[next * 4 + 3] > 0) queue.push(next);
      }
    }

    if (!bestComponent || component.length > bestComponent.length) {
      bestComponent = component;
    }
  }

  if (!bestComponent) return;
  const keep = new Uint8Array(total);
  for (const p of bestComponent) keep[p] = 1;
  for (let p = 0; p < total; p += 1) {
    if (!keep[p]) data[p * 4 + 3] = 0;
  }
}

function cleanupTransparentPixels(png) {
  for (let i = 0; i < png.data.length; i += 4) {
    if (png.data[i + 3] !== 0) continue;
    png.data[i] = 0;
    png.data[i + 1] = 0;
    png.data[i + 2] = 0;
  }
}

function suppressSoftHalo(png, alphaCutoff) {
  for (let i = 0; i < png.data.length; i += 4) {
    const a = png.data[i + 3];
    if (a === 0) continue;
    if (a < alphaCutoff) {
      png.data[i + 3] = 0;
      continue;
    }
    if (a < 255) {
      png.data[i + 3] = Math.min(255, a + 28);
    }
  }
}

function stripOuterHaloRing(png, passes) {
  if (passes <= 0) return;
  const { width, height } = png;
  const neighborOffsets = [-1, 1, -width, width];

  for (let pass = 0; pass < passes; pass += 1) {
    const original = new Uint8ClampedArray(png.data);
    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {
        const p = y * width + x;
        const idx = p * 4;
        const a = original[idx + 3];
        if (a === 0) continue;

        let touchesTransparent = false;
        for (const o of neighborOffsets) {
          if (original[(p + o) * 4 + 3] === 0) {
            touchesTransparent = true;
            break;
          }
        }
        if (!touchesTransparent) continue;

        const r = original[idx];
        const g = original[idx + 1];
        const b = original[idx + 2];
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const cyanLike = b > 140 && g > 120 && r < 100;
        const brightNeutral = max >= 175 && max - min <= 24;
        const weakEdge = a < 245;

        if (cyanLike || brightNeutral || weakEdge) {
          if (a >= 245 && brightNeutral) {
            png.data[idx] = 6;
            png.data[idx + 1] = 10;
            png.data[idx + 2] = 18;
            png.data[idx + 3] = 255;
          } else {
            png.data[idx + 3] = 0;
            png.data[idx] = 0;
            png.data[idx + 1] = 0;
            png.data[idx + 2] = 0;
          }
        }
      }
    }
  }
}

function findAlphaBounds(png) {
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const idx = (y * png.width + x) * 4;
      if (png.data[idx + 3] <= 0) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function trimBounds(bounds, trimPx) {
  if (!bounds) return null;
  if (trimPx <= 0) return bounds;
  const maxTrimX = Math.max(0, Math.floor((bounds.width - 1) / 2));
  const maxTrimY = Math.max(0, Math.floor((bounds.height - 1) / 2));
  const tx = Math.min(trimPx, maxTrimX);
  const ty = Math.min(trimPx, maxTrimY);
  return {
    minX: bounds.minX + tx,
    minY: bounds.minY + ty,
    maxX: bounds.maxX - tx,
    maxY: bounds.maxY - ty,
    width: bounds.width - tx * 2,
    height: bounds.height - ty * 2,
  };
}

function centerOnTransparentCanvas(source, bounds, outWidth, outHeight) {
  const out = new PNG({ width: outWidth, height: outHeight });
  const targetX = Math.floor((outWidth - bounds.width) / 2);
  const targetY = Math.floor((outHeight - bounds.height) / 2);
  for (let y = 0; y < bounds.height; y += 1) {
    for (let x = 0; x < bounds.width; x += 1) {
      const srcX = bounds.minX + x;
      const srcY = bounds.minY + y;
      const srcIdx = (srcY * source.width + srcX) * 4;
      const dstIdx = ((targetY + y) * outWidth + (targetX + x)) * 4;
      out.data[dstIdx] = source.data[srcIdx];
      out.data[dstIdx + 1] = source.data[srcIdx + 1];
      out.data[dstIdx + 2] = source.data[srcIdx + 2];
      out.data[dstIdx + 3] = source.data[srcIdx + 3];
    }
  }
  return out;
}

async function ensureNames(inputDir, namesArg) {
  if (namesArg.length > 0) return namesArg;
  const discovered = [];
  for (const name of DEFAULT_NAMES) {
    const candidate = path.join(inputDir, `${name}.png`);
    try {
      await fs.access(candidate);
      discovered.push(name);
    } catch {
      // Ignore missing files for default scan.
    }
  }
  if (discovered.length > 0) return discovered;

  const files = await fs.readdir(inputDir);
  return files
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((f) => f.replace(/\.png$/i, ""))
    .sort();
}

async function main() {
  const modePreset = resolveModePreset();
  const inputDir = path.resolve(parseArg("--input-dir", DEFAULT_INPUT_DIR));
  const outputDir = path.resolve(parseArg("--output-dir", DEFAULT_OUTPUT_DIR));
  const names = await ensureNames(inputDir, parseListArg("--names", []));
  const trimPx = hasArg("--trim")
    ? parseNonNegativeIntArg("--trim", modePreset.trimPx)
    : modePreset.trimPx;
  const haloStripPasses = hasArg("--halo-strip")
    ? parseNonNegativeIntArg("--halo-strip", modePreset.haloStripPasses)
    : modePreset.haloStripPasses;
  const edgeAlphaCutoff = hasArg("--edge-alpha-cutoff")
    ? parseNonNegativeIntArg("--edge-alpha-cutoff", modePreset.edgeAlphaCutoff)
    : modePreset.edgeAlphaCutoff;
  const bgThreshold = hasArg("--bg-threshold")
    ? parseNonNegativeIntArg("--bg-threshold", modePreset.bgThreshold)
    : modePreset.bgThreshold;
  const forceKeying = hasArg("--force-keying");

  if (names.length === 0) {
    throw new Error(`No PNG files found in ${inputDir}`);
  }

  await fs.mkdir(outputDir, { recursive: true });

  for (const name of names) {
    const inFile = path.join(inputDir, `${name}.png`);
    let splitPng;
    try {
      splitPng = await readPngRobust(inFile);
    } catch (error) {
      console.warn(
        `skipping ${name}: ${error instanceof Error ? error.message : String(error)}`,
      );
      continue;
    }

    const hasAlpha = hasMeaningfulTransparency(splitPng);
    if (forceKeying || !hasAlpha) {
      const backgroundColors = estimateBackgroundColors(splitPng);
      keyOutBackground(splitPng, backgroundColors, bgThreshold);
    }
    keepLargestAlphaComponent(splitPng);
    if (forceKeying || !hasAlpha) {
      suppressSoftHalo(splitPng, edgeAlphaCutoff);
      stripOuterHaloRing(splitPng, haloStripPasses);
    }
    cleanupTransparentPixels(splitPng);
    const bounds = trimBounds(findAlphaBounds(splitPng), trimPx);
    const outPng = bounds
      ? centerOnTransparentCanvas(
          splitPng,
          bounds,
          splitPng.width,
          splitPng.height,
        )
      : new PNG({ width: splitPng.width, height: splitPng.height });

    const outFile = path.join(outputDir, `${name}.png`);
    await fs.writeFile(outFile, PNG.sync.write(outPng));
    console.log(`wrote ${path.relative(repoRoot, outFile)}`);
  }

  console.log(
    `settings mode=${modePreset.name} bg-threshold=${bgThreshold} edge-alpha-cutoff=${edgeAlphaCutoff} trim=${trimPx} halo-strip=${haloStripPasses} force-keying=${forceKeying}`,
  );
  console.log("done");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
