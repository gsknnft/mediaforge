/**
 * Prep a single image for TripoSR input.
 *
 * Handles two cases:
 *   1. Transparent PNG  → flatten alpha to #808080 grey
 *   2. Black-bg PNG/JPG → threshold-remove black → flatten to #808080 grey
 *
 * Usage:
 *   node prep-triposr-single.mjs <input-image> [output-path]
 *
 * Output defaults to <input-basename>_triposr.png alongside the input file.
 * The output is always a solid-bg RGB PNG ready for TripoSR --no-remove-bg.
 */

import sharp from "sharp";
import { existsSync } from "fs";
import { dirname, basename, extname, join, resolve } from "path";
import { fileURLToPath } from "url";

const GRAY = { r: 128, g: 128, b: 128 };
const BLACK_THRESHOLD_SQ = 30 * 30; // pixel within dist 30 of pure black = bg

const args = process.argv.slice(2);
if (!args[0]) {
  console.error("Usage: node prep-triposr-single.mjs <input-image> [output-path]");
  process.exit(1);
}

const inPath = resolve(args[0]);
if (!existsSync(inPath)) {
  console.error("File not found:", inPath);
  process.exit(1);
}

const ext = extname(inPath);
const base = basename(inPath, ext);
const outPath = args[1]
  ? resolve(args[1])
  : join(dirname(inPath), `${base}_triposr.png`);

const { data, info } = await sharp(inPath)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const px = new Uint8ClampedArray(data.buffer);

// Check if image has meaningful alpha (transparent bg) or opaque (black bg)
let transparentPixels = 0;
for (let i = 3; i < px.length; i += 4) {
  if (px[i] < 128) transparentPixels++;
}
const hasTransparentBg = transparentPixels > (px.length / 4) * 0.05;

if (!hasTransparentBg) {
  // Black-bg removal: mark near-black pixels as transparent
  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i + 1], b = px[i + 2];
    if (r * r + g * g + b * b < BLACK_THRESHOLD_SQ) px[i + 3] = 0;
  }
  console.log("  Mode: black-bg removal → grey flatten");
} else {
  console.log("  Mode: transparent-bg → grey flatten");
}

await sharp(Buffer.from(px.buffer), {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .flatten({ background: GRAY })
  .png()
  .toFile(outPath);

console.log(`  ✓ ${inPath}`);
console.log(`  → ${outPath}`);
console.log(`  Size: ${info.width}x${info.height}`);
