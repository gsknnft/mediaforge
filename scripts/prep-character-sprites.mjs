/**
 * prep-character-sprites.mjs
 *
 * snap → bg-strip in one pass for coherence-clash character sprite sheets.
 * Works on black or grey backgrounds (auto-detected from filename, or set --bg).
 *
 * Usage:
 *   node scripts/prep-character-sprites.mjs
 *     → processes all factions in packages/coherence-clash/public/old/
 *
 *   node scripts/prep-character-sprites.mjs --faction sigi --mode illustrative
 *   node scripts/prep-character-sprites.mjs --input ./my-sheet.png --bg black
 *
 * Flags:
 *   --faction  sigi|nexa|brutus|glitch|all  (default: all)
 *   --mode     pixel|illustrative|smooth|edge-only  (default: illustrative)
 *   --bg       black|grey|none  (default: auto from filename)
 *   --k        override kColors
 *   --edge     override edgeStrength
 *   --threshold  bg strip threshold 0-441  (default: black=18, grey=40)
 */

import sharp from "sharp";
import { readdir, mkdir, stat } from "fs/promises";
import { join, resolve, basename, extname } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const OLD_DIR   = resolve(__dirname, "../../coherence-clash/public/old");
const OUT_DIR   = resolve(__dirname, "../../coherence-clash/public/agents-arena/characters");

// ── Args ──────────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const map = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) {
      const key = argv[i].slice(2);
      const val = argv[i+1];
      map[key] = val && !val.startsWith("--") ? (i++, val) : "true";
    }
  }
  return map;
}

const args = parseArgs(process.argv.slice(2));
const MODE      = args["mode"]      ?? "illustrative";
const FACTION   = args["faction"]   ?? "all";
const BG_FORCE  = args["bg"]        ?? null;   // black | grey | none | null=auto
const K_OVR     = args["k"]         ? Number(args["k"])    : null;
const EDGE_OVR  = args["edge"]      ? Number(args["edge"]) : null;
const THRESHOLD = args["threshold"] ? Number(args["threshold"]) : null;

// ── Snap config ───────────────────────────────────────────────────────────────

const MODES = {
  pixel:        { kColors: 16,  edgeStrength: 1.4, useSobel: true  },
  illustrative: { kColors: 48,  edgeStrength: 0.9, useSobel: false },
  smooth:       { kColors: 128, edgeStrength: 0.35, useSobel: false },
  "edge-only":  { kColors: 0,   edgeStrength: 1.6, useSobel: true  },
};

// ── Pixel ops ─────────────────────────────────────────────────────────────────

function clamp8(v) { return v < 0 ? 0 : v > 255 ? 255 : Math.round(v); }
function dist2(a, b) { return (a[0]-b[0])**2+(a[1]-b[1])**2+(a[2]-b[2])**2; }

function kmeansQuantize(data, k) {
  if (k <= 0) return;
  const pc = data.length >> 2;
  const step = Math.max(1, Math.floor(pc / 3000));
  const samples = [];
  for (let i = 0; i < pc; i += step) {
    const o = i<<2;
    if (data[o+3] < 128) continue;
    samples.push([data[o], data[o+1], data[o+2]]);
  }
  if (samples.length < k) return;
  const centroids = [samples[Math.floor(Math.random() * samples.length)]];
  while (centroids.length < k) {
    const dists = samples.map(s => Math.min(...centroids.map(c => dist2(s,c))));
    const total = dists.reduce((a,b) => a+b, 0);
    let r = Math.random() * total;
    for (let i = 0; i < dists.length; i++) { r -= dists[i]; if (r<=0){centroids.push(samples[i]);break;} }
    if (centroids.length < k) centroids.push(samples[samples.length-1]);
  }
  for (let iter = 0; iter < 15; iter++) {
    const sums = centroids.map(() => [0,0,0]);
    const counts = new Int32Array(k);
    for (const s of samples) {
      let best=0, bd=Infinity;
      for (let j=0;j<k;j++){const d=dist2(s,centroids[j]);if(d<bd){bd=d;best=j;}}
      sums[best][0]+=s[0];sums[best][1]+=s[1];sums[best][2]+=s[2];counts[best]++;
    }
    let moved=false;
    for (let j=0;j<k;j++){
      if(!counts[j])continue;
      const nr=sums[j][0]/counts[j],ng=sums[j][1]/counts[j],nb=sums[j][2]/counts[j];
      if(Math.abs(nr-centroids[j][0])+Math.abs(ng-centroids[j][1])+Math.abs(nb-centroids[j][2])>0.5)moved=true;
      centroids[j]=[nr,ng,nb];
    }
    if(!moved)break;
  }
  for (let i=0;i<pc;i++){
    const o=i<<2;
    if(data[o+3]<128)continue;
    const rgb=[data[o],data[o+1],data[o+2]];
    let best=0,bd=Infinity;
    for(let j=0;j<k;j++){const d=dist2(rgb,centroids[j]);if(d<bd){bd=d;best=j;}}
    data[o]=clamp8(centroids[best][0]);data[o+1]=clamp8(centroids[best][1]);data[o+2]=clamp8(centroids[best][2]);
  }
}

function unsharpMask(data, width, height, amount) {
  if (amount<=0) return;
  const blurred = Buffer.from(data);
  for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
    let r=0,g=0,b=0,n=0;
    for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) {
      const o=(Math.max(0,Math.min(height-1,y+dy))*width+Math.max(0,Math.min(width-1,x+dx)))<<2;
      r+=data[o];g+=data[o+1];b+=data[o+2];n++;
    }
    const o=(y*width+x)<<2;
    blurred[o]=r/n;blurred[o+1]=g/n;blurred[o+2]=b/n;
  }
  for (let i=0;i<data.length;i+=4) {
    if(data[i+3]<128)continue;
    data[i]  =clamp8(data[i]  +amount*(data[i]  -blurred[i]));
    data[i+1]=clamp8(data[i+1]+amount*(data[i+1]-blurred[i+1]));
    data[i+2]=clamp8(data[i+2]+amount*(data[i+2]-blurred[i+2]));
  }
}

function sobelEnhance(data, width, height, amount) {
  if (amount<=0) return;
  const edges = new Float32Array(data.length>>2);
  const Kx=[-1,0,1,-2,0,2,-1,0,1], Ky=[-1,-2,-1,0,0,0,1,2,1];
  for (let y=0;y<height;y++) for (let x=0;x<width;x++) {
    let gx=0,gy=0;
    for (let dy=-1;dy<=1;dy++) for (let dx=-1;dx<=1;dx++) {
      const o=(Math.max(0,Math.min(height-1,y+dy))*width+Math.max(0,Math.min(width-1,x+dx)))<<2;
      const lum=0.299*data[o]+0.587*data[o+1]+0.114*data[o+2];
      const ki=(dy+1)*3+(dx+1);
      gx+=Kx[ki]*lum;gy+=Ky[ki]*lum;
    }
    edges[y*width+x]=Math.sqrt(gx*gx+gy*gy);
  }
  let maxEdge=0;
  for (let i=0;i<edges.length;i++) if(edges[i]>maxEdge)maxEdge=edges[i];
  if(!maxEdge)return;
  const scale=amount/maxEdge;
  for (let i=0;i<edges.length;i++){
    const o=i<<2;
    if(data[o+3]<128)continue;
    const boost=edges[i]*scale*64;
    data[o]=clamp8(data[o]+boost);data[o+1]=clamp8(data[o+1]+boost);data[o+2]=clamp8(data[o+2]+boost);
  }
}

/** Strip flat background by color distance. keyColor=[r,g,b], threshold 0-441 */
function stripBackground(data, keyColor, threshold) {
  const t2 = threshold * threshold;
  for (let i=0;i<data.length;i+=4) {
    const dr=data[i]-keyColor[0], dg=data[i+1]-keyColor[1], db=data[i+2]-keyColor[2];
    if (dr*dr+dg*dg+db*db < t2) data[i+3]=0;
  }
}

// ── Background detection ──────────────────────────────────────────────────────

function detectBg(filename) {
  if (BG_FORCE) return BG_FORCE;
  if (filename.includes("_black")) return "black";
  if (filename.includes("_grey") || filename.includes("_gray")) return "grey";
  return "none";
}

const BG_COLORS = {
  black: { color: [0,0,0],     threshold: THRESHOLD ?? 22  },
  grey:  { color: [128,128,128], threshold: THRESHOLD ?? 45  },
  none:  null,
};

// ── Process one file ──────────────────────────────────────────────────────────

async function processFile(src, dest, cfg) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  const k = K_OVR ?? cfg.kColors;
  const edge = EDGE_OVR ?? cfg.edgeStrength;

  // 1. snap
  kmeansQuantize(data, k);
  cfg.useSobel ? sobelEnhance(data, width, height, edge) : unsharpMask(data, width, height, edge);

  // 2. bg strip
  const bgKey = detectBg(basename(src));
  const bgCfg = BG_COLORS[bgKey];
  if (bgCfg) stripBackground(data, bgCfg.color, bgCfg.threshold);

  await sharp(data, { raw: { width, height, channels: 4 } }).png().toFile(dest);
  return bgKey;
}

// ── Collect inputs ────────────────────────────────────────────────────────────

async function collectInputs() {
  const factions = FACTION === "all"
    ? ["sigi", "nexa", "brutus", "glitch"]
    : [FACTION];

  const inputs = [];
  for (const faction of factions) {
    const dir = join(OLD_DIR, faction);
    let entries;
    try { entries = await readdir(dir, { withFileTypes: true }); }
    catch { console.warn(`  skipping ${faction} (not found)`); continue; }

    for (const e of entries) {
      if (e.isFile() && e.name.endsWith(".png")) {
        inputs.push({ faction, src: join(dir, e.name), name: e.name });
      } else if (e.isDirectory()) {
        // recurse one level (e.g. sigi/noeyes/)
        const sub = join(dir, e.name);
        const subFiles = await readdir(sub);
        for (const f of subFiles) {
          if (f.endsWith(".png"))
            inputs.push({ faction, src: join(sub, f), name: `${e.name}_${f}` });
        }
      }
    }
  }
  return inputs;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const cfg = MODES[MODE];
if (!cfg) { console.error(`Unknown mode: ${MODE}`); process.exit(1); }

const inputs = await collectInputs();
await mkdir(OUT_DIR, { recursive: true });

console.log(`\n▶ prep-character-sprites`);
console.log(`  Mode: ${MODE}  (k=${K_OVR??cfg.kColors}, edge=${EDGE_OVR??cfg.edgeStrength}, ${cfg.useSobel?"Sobel":"unsharp"})`);
console.log(`  ${inputs.length} sheet(s) → ${OUT_DIR}\n`);

for (const { faction, src, name } of inputs) {
  const outName = name.replace(/_v3_(black|grey)/, "").replace(/^(noeyes_)/, `${faction}_noeyes_`);
  const dest = join(OUT_DIR, outName);
  const t0 = Date.now();
  const bgKey = await processFile(src, dest, cfg);
  console.log(`  ✓ [${faction}] ${name}  →  ${outName}  (bg:${bgKey}, ${Date.now()-t0}ms)`);
}

console.log(`\n✓ Done → ${OUT_DIR}\n`);
