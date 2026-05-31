/**
 * snap-images.mjs
 *
 * Run image snap (K-means quantize + edge sharpening) on a folder of PNGs.
 * Generalised from Hugo-Dz/spritefusion-pixel-snapper — works for any art style.
 *
 * Modes:
 *   pixel        k=16,  Sobel edge  — pixel art / RTS sprites
 *   illustrative k=48,  unsharp     — concept art / cartoon
 *   smooth       k=128, gentle      — photo / realistic reference
 *   edge-only    k=0,   Sobel only  — silhouette cleanup, no palette change
 *
 * Usage:
 *   node scripts/snap-images.mjs
 *     --input  ../../verse-traverse/public/ships
 *     --output ../../verse-traverse/public/ships/snapped
 *     --mode   illustrative          (default: all)
 *     --k      48                    (override kColors)
 *     --edge   0.9                   (override edgeStrength 0–2)
 */

import sharp from "sharp";
import { readdir, mkdir } from "fs/promises";
import { join, resolve, basename } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

// ── Args ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const map = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i + 1];
      map[key] = val && !val.startsWith("--") ? (i++, val) : "true";
    }
  }
  return map;
}

const args  = parseArgs(process.argv.slice(2));
const INPUT = resolve(__dirname, args["input"] ?? "../../verse-traverse/public/ships");
const BASE_OUTPUT = resolve(__dirname, args["output"] ?? join(INPUT, "snapped"));
const MODE_ARG = args["mode"] ?? "all";
const K_OVERRIDE = args["k"] ? Number(args["k"]) : null;
const EDGE_OVERRIDE = args["edge"] ? Number(args["edge"]) : null;

// ── Mode table ────────────────────────────────────────────────────────────────

const MODES = {
  pixel:        { kColors: 16,  edgeStrength: 1.4, useSobel: true  },
  illustrative: { kColors: 48,  edgeStrength: 0.9, useSobel: false },
  smooth:       { kColors: 128, edgeStrength: 0.35, useSobel: false },
  "edge-only":  { kColors: 0,   edgeStrength: 1.6, useSobel: true  },
};

const modesRun = MODE_ARG === "all" ? Object.keys(MODES) : [MODE_ARG];

// ── Pixel ops ─────────────────────────────────────────────────────────────────

function clamp8(v) { return v < 0 ? 0 : v > 255 ? 255 : Math.round(v); }
function dist2(a, b) { return (a[0]-b[0])**2 + (a[1]-b[1])**2 + (a[2]-b[2])**2; }

function kmeansQuantize(data, k) {
  if (k <= 0) return;
  const pixelCount = data.length >> 2;
  const step = Math.max(1, Math.floor(pixelCount / 3000));
  const samples = [];
  for (let i = 0; i < pixelCount; i += step) {
    const o = i << 2;
    if (data[o+3] < 128) continue;
    samples.push([data[o], data[o+1], data[o+2]]);
  }
  if (samples.length < k) return;

  // k-means++ init
  const centroids = [samples[Math.floor(Math.random() * samples.length)]];
  while (centroids.length < k) {
    const dists = samples.map(s => Math.min(...centroids.map(c => dist2(s, c))));
    const total = dists.reduce((a, b) => a + b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < dists.length; i++) {
      r -= dists[i];
      if (r <= 0) { centroids.push(samples[i]); break; }
    }
    if (centroids.length < k) centroids.push(samples[samples.length - 1]);
  }

  // iterate
  for (let iter = 0; iter < 15; iter++) {
    const sums = centroids.map(() => [0, 0, 0]);
    const counts = new Int32Array(k);
    for (const s of samples) {
      let best = 0, bestDist = Infinity;
      for (let j = 0; j < k; j++) {
        const d = dist2(s, centroids[j]);
        if (d < bestDist) { bestDist = d; best = j; }
      }
      sums[best][0] += s[0]; sums[best][1] += s[1]; sums[best][2] += s[2];
      counts[best]++;
    }
    let moved = false;
    for (let j = 0; j < k; j++) {
      if (!counts[j]) continue;
      const nr = sums[j][0] / counts[j];
      const ng = sums[j][1] / counts[j];
      const nb = sums[j][2] / counts[j];
      if (Math.abs(nr - centroids[j][0]) + Math.abs(ng - centroids[j][1]) + Math.abs(nb - centroids[j][2]) > 0.5)
        moved = true;
      centroids[j] = [nr, ng, nb];
    }
    if (!moved) break;
  }

  // remap pixels
  for (let i = 0; i < pixelCount; i++) {
    const o = i << 2;
    if (data[o+3] < 128) continue;
    const rgb = [data[o], data[o+1], data[o+2]];
    let best = 0, bestDist = Infinity;
    for (let j = 0; j < k; j++) {
      const d = dist2(rgb, centroids[j]);
      if (d < bestDist) { bestDist = d; best = j; }
    }
    data[o]   = clamp8(centroids[best][0]);
    data[o+1] = clamp8(centroids[best][1]);
    data[o+2] = clamp8(centroids[best][2]);
  }
}

function unsharpMask(data, width, height, amount) {
  if (amount <= 0) return;
  const blurred = Buffer.from(data);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        const ny = Math.max(0, Math.min(height-1, y+dy));
        for (let dx = -1; dx <= 1; dx++) {
          const nx = Math.max(0, Math.min(width-1, x+dx));
          const o = (ny * width + nx) << 2;
          r += data[o]; g += data[o+1]; b += data[o+2]; n++;
        }
      }
      const o = (y * width + x) << 2;
      blurred[o] = r/n; blurred[o+1] = g/n; blurred[o+2] = b/n;
    }
  }
  for (let i = 0; i < data.length; i += 4) {
    if (data[i+3] < 128) continue;
    data[i]   = clamp8(data[i]   + amount * (data[i]   - blurred[i]));
    data[i+1] = clamp8(data[i+1] + amount * (data[i+1] - blurred[i+1]));
    data[i+2] = clamp8(data[i+2] + amount * (data[i+2] - blurred[i+2]));
  }
}

function sobelEnhance(data, width, height, amount) {
  if (amount <= 0) return;
  const n = data.length >> 2;
  const edges = new Float32Array(n);
  const Kx = [-1,0,1,-2,0,2,-1,0,1];
  const Ky = [-1,-2,-1,0,0,0,1,2,1];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let gx = 0, gy = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = Math.max(0, Math.min(height-1, y+dy));
          const nx = Math.max(0, Math.min(width-1, x+dx));
          const o = (ny * width + nx) << 2;
          const lum = 0.299*data[o] + 0.587*data[o+1] + 0.114*data[o+2];
          const ki = (dy+1)*3 + (dx+1);
          gx += Kx[ki] * lum; gy += Ky[ki] * lum;
        }
      }
      edges[y*width+x] = Math.sqrt(gx*gx + gy*gy);
    }
  }
  let maxEdge = 0;
  for (let i = 0; i < edges.length; i++) if (edges[i] > maxEdge) maxEdge = edges[i];
  if (maxEdge === 0) return;
  const scale = amount / maxEdge;
  for (let i = 0; i < edges.length; i++) {
    const o = i << 2;
    if (data[o+3] < 128) continue;
    const boost = edges[i] * scale * 64;
    data[o]   = clamp8(data[o]   + boost);
    data[o+1] = clamp8(data[o+1] + boost);
    data[o+2] = clamp8(data[o+2] + boost);
  }
}

// ── Process one file ──────────────────────────────────────────────────────────

async function processFile(src, dest, cfg) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;

  const k = K_OVERRIDE ?? cfg.kColors;
  const edge = EDGE_OVERRIDE ?? cfg.edgeStrength;

  kmeansQuantize(data, k);
  if (cfg.useSobel) {
    sobelEnhance(data, width, height, edge);
  } else {
    unsharpMask(data, width, height, edge);
  }

  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(dest);
}

// ── Main ──────────────────────────────────────────────────────────────────────

const files = (await readdir(INPUT))
  .filter(f => f.endsWith(".png") && !f.includes("snapped"))
  .sort();

console.log(`\n▶ snap-images  ${files.length} file(s) × ${modesRun.length} mode(s)`);
console.log(`  Input:  ${INPUT}`);
console.log(`  Output: ${BASE_OUTPUT}\n`);

for (const mode of modesRun) {
  const cfg = MODES[mode];
  if (!cfg) { console.error(`Unknown mode: ${mode}`); process.exit(1); }
  const outDir = join(BASE_OUTPUT, mode);
  await mkdir(outDir, { recursive: true });

  const k = K_OVERRIDE ?? cfg.kColors;
  const edge = EDGE_OVERRIDE ?? cfg.edgeStrength;
  console.log(`  [${mode}]  k=${k}  edge=${edge}  ${cfg.useSobel ? "Sobel" : "unsharp"}`);

  for (const file of files) {
    const t0 = Date.now();
    await processFile(join(INPUT, file), join(outDir, file), cfg);
    console.log(`    ✓ ${file}  (${Date.now()-t0}ms)`);
  }
}

console.log(`\n✓ All done → ${BASE_OUTPUT}\n`);
