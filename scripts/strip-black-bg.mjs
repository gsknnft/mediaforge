/**
 * Strip pure-black background from frames_360 PNGs.
 * Color-key: dist = sqrt(r²+g²+b²) < threshold → alpha=0, then flatten to white.
 * Lower threshold = less aggressive (keeps more dark details).
 */

import sharp from "sharp";
import { readdir } from "fs/promises";
import { join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const SCANFORGE = resolve(__dirname, "../../../isolation/scanforge");

const THRESHOLD = Number(process.argv[2] ?? 12);
const IN_DIR  = join(SCANFORGE, "frontend/public/assets/sigi/frames_360");
const OUT_DIR = join(SCANFORGE, "frontend/public/assets/sigi/frames_360_clean");

console.log(`Threshold: dist < ${THRESHOLD}  (${IN_DIR} → ${OUT_DIR})`);

const files = (await readdir(IN_DIR)).filter(f => f.endsWith(".png")).sort();
console.log(`${files.length} frames found`);

for (const file of files) {
  const inPath  = join(IN_DIR, file);
  const outPath = join(OUT_DIR, file);

  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const px = new Uint8ClampedArray(data.buffer);
  const t2 = THRESHOLD * THRESHOLD;

  for (let i = 0; i < px.length; i += 4) {
    const r = px[i], g = px[i+1], b = px[i+2];
    if (r*r + g*g + b*b < t2) px[i+3] = 0;
  }

  await sharp(Buffer.from(px.buffer), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .flatten({ background: { r: 255, g: 255, b: 255 } })
    .png()
    .toFile(outPath);

  process.stdout.write(".");
}
console.log(`\nDone → ${OUT_DIR}`);
