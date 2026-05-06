/**
 * Prep frames for TripoSR input.
 * Black bg → transparent → flatten to gray #808080 (TripoSR's expected bg).
 *
 * Usage:
 *   node prep-triposr-frames.mjs [frame numbers...]
 *   node prep-triposr-frames.mjs 1 25
 *   node prep-triposr-frames.mjs          ← processes all frames
 *
 * Output: isolation/scanforge/frontend/public/assets/sigi/frames_triposr/
 */

import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SCANFORGE = resolve(__dirname, "../../../isolation/scanforge");

const THRESHOLD = 30; // dist < 30 → black bg pixel → transparent
const IN_DIR  = join(SCANFORGE, "frontend/public/assets/sigi/frames_360");
const OUT_DIR = join(SCANFORGE, "frontend/public/assets/sigi/frames_triposr");
const GRAY    = { r: 128, g: 128, b: 128 };

await mkdir(OUT_DIR, { recursive: true });

// Parse frame args: "1 25" → ["frame_0001.png", "frame_0025.png"], none → all
const args = process.argv.slice(2);
let files;
if (args.length > 0) {
  files = args.map(n => `frame_${String(n).padStart(4, "0")}.png`);
} else {
  files = (await readdir(IN_DIR)).filter(f => f.endsWith(".png")).sort();
}

const t2 = THRESHOLD * THRESHOLD;

console.log(`Prepping ${files.length} frame(s) → ${OUT_DIR}`);

for (const file of files) {
  const inPath  = join(IN_DIR, file);
  const outPath = join(OUT_DIR, file);

  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = new Uint8ClampedArray(data.buffer);

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i+1], b = px[i+2];
    if (r*r + g*g + b*b < t2) px[i+3] = 0;
  }

  await sharp(Buffer.from(px.buffer), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .flatten({ background: GRAY })
    .png()
    .toFile(outPath);

  console.log(`  ✓ ${file}`);
}

console.log(`Done → ${OUT_DIR}`);
