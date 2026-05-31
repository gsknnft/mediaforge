#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

const DEFAULT_SOURCE = path.join(
  repoRoot,
  "packages/super-smash-agents/public/old/sigi/sigi_cc_matrix_v3_black.png",
);
const DEFAULT_FRAME_TS = path.join(
  repoRoot,
  "packages/super-smash-agents/src/assets/sigiAtlas.ts",
);
const DEFAULT_OUT_DIR = path.join(
  repoRoot,
  "packages/super-smash-agents/public/agents-arena/runtime",
);

function parseArg(flag, fallback) {
  const idx = process.argv.indexOf(flag);
  if (idx === -1) return fallback;
  const value = process.argv[idx + 1];
  return value && !value.startsWith("--") ? value : fallback;
}

function hasArg(flag) {
  return process.argv.includes(flag);
}

function parseIntArg(flag, fallback) {
  const raw = parseArg(flag, String(fallback));
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function parseFramesFromAtlasTs(source) {
  const frameEntries = [];
  const re = /"([^"]+)":\s*\{([^{}]*)\},/g;
  let match;
  while ((match = re.exec(source))) {
    const [, name, body] = match;
    const read = (field) => {
      const m = new RegExp(`${field}:\\s*(-?\\d+)`).exec(body);
      return m ? Number.parseInt(m[1], 10) : null;
    };
    const x = read("x");
    const y = read("y");
    const width = read("width");
    const height = read("height");
    if (x == null || y == null || width == null || height == null) continue;
    frameEntries.push({
      name,
      x,
      y,
      width,
      height,
      pivotX: read("pivotX") ?? Math.round(width / 2),
      pivotY: read("pivotY") ?? Math.max(1, height - 4),
    });
  }
  if (!frameEntries.length) {
    throw new Error("No frame rects found in atlas TS file");
  }
  return frameEntries;
}

function parseAtlasDimensionsFromTs(source) {
  const read = (field) => {
    const direct = new RegExp(`${field}:\\s*(\\d+)`).exec(source);
    if (direct) return Number.parseInt(direct[1], 10);
    const manifest = new RegExp(`${field}:\\s*\\w+Manifest\\.${field}`).exec(source);
    if (manifest) return null;
    return null;
  };
  return {
    imageWidth: read("imageWidth"),
    imageHeight: read("imageHeight"),
  };
}

function scaleFrameRects(frameRects, fromWidth, fromHeight, toWidth, toHeight) {
  if (!fromWidth || !fromHeight || (fromWidth === toWidth && fromHeight === toHeight)) {
    return frameRects;
  }
  const sx = toWidth / fromWidth;
  const sy = toHeight / fromHeight;
  return frameRects.map((frame) => ({
    ...frame,
    x: Math.round(frame.x * sx),
    y: Math.round(frame.y * sy),
    width: Math.max(1, Math.round(frame.width * sx)),
    height: Math.max(1, Math.round(frame.height * sy)),
    pivotX: Math.round(frame.pivotX * sx),
    pivotY: Math.round(frame.pivotY * sy),
  }));
}

function cropPng(source, rect) {
  const x0 = Math.max(0, Math.min(source.width - 1, rect.x));
  const y0 = Math.max(0, Math.min(source.height - 1, rect.y));
  const width = Math.max(1, Math.min(rect.width, source.width - x0));
  const height = Math.max(1, Math.min(rect.height, source.height - y0));
  const out = new PNG({ width, height });
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const srcIdx = ((y0 + y) * source.width + x0 + x) * 4;
      const dstIdx = (y * width + x) * 4;
      out.data[dstIdx] = source.data[srcIdx];
      out.data[dstIdx + 1] = source.data[srcIdx + 1];
      out.data[dstIdx + 2] = source.data[srcIdx + 2];
      out.data[dstIdx + 3] = source.data[srcIdx + 3];
    }
  }
  return out;
}

function estimateEdgeColors(png) {
  const samples = [];
  const add = (x, y) => {
    const idx = (y * png.width + x) * 4;
    samples.push([png.data[idx], png.data[idx + 1], png.data[idx + 2]]);
  };
  for (let x = 0; x < png.width; x += Math.max(1, Math.floor(png.width / 12))) {
    add(x, 0);
    add(x, png.height - 1);
  }
  for (let y = 0; y < png.height; y += Math.max(1, Math.floor(png.height / 12))) {
    add(0, y);
    add(png.width - 1, y);
  }
  return samples;
}

function keyOutConnectedBackground(png, tolerance) {
  const { width, height, data } = png;
  const total = width * height;
  const backgroundColors = estimateEdgeColors(png);
  const visited = new Uint8Array(total);
  const queue = [];

  const shouldFlood = (p) => {
    if (p < 0 || p >= total || visited[p]) return false;
    const i = p * 4;
    if (data[i + 3] === 0) return true;
    const rgb = [data[i], data[i + 1], data[i + 2]];
    const max = Math.max(...rgb);
    const min = Math.min(...rgb);
    const neutral = max - min <= 22;
    const nearEdgeColor = backgroundColors.some(
      (color) => colorDistance(rgb, color) <= tolerance,
    );
    const nearBlack = max <= tolerance + 10;
    return nearEdgeColor || nearBlack || (neutral && max >= 130);
  };

  const push = (p) => {
    if (!shouldFlood(p)) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (queue.length > 0) {
    const p = queue.pop();
    const x = p % width;
    const y = Math.floor(p / width);
    if (x > 0) push(p - 1);
    if (x < width - 1) push(p + 1);
    if (y > 0) push(p - width);
    if (y < height - 1) push(p + width);
  }

  for (let p = 0; p < total; p += 1) {
    if (!visited[p]) continue;
    const idx = p * 4;
    data[idx] = 0;
    data[idx + 1] = 0;
    data[idx + 2] = 0;
    data[idx + 3] = 0;
  }
}

function findAlphaBounds(png, alphaThreshold) {
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const a = png.data[(y * png.width + x) * 4 + 3];
      if (a < alphaThreshold) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) return null;
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function trimPng(png, bounds, pad) {
  if (!bounds) return png;
  const x0 = Math.max(0, bounds.x - pad);
  const y0 = Math.max(0, bounds.y - pad);
  const x1 = Math.min(png.width, bounds.x + bounds.width + pad);
  const y1 = Math.min(png.height, bounds.y + bounds.height + pad);
  return cropPng(png, { x: x0, y: y0, width: x1 - x0, height: y1 - y0 });
}

function blit(src, dst, dx, dy) {
  for (let y = 0; y < src.height; y += 1) {
    for (let x = 0; x < src.width; x += 1) {
      const srcIdx = (y * src.width + x) * 4;
      const dstIdx = ((dy + y) * dst.width + dx + x) * 4;
      dst.data[dstIdx] = src.data[srcIdx];
      dst.data[dstIdx + 1] = src.data[srcIdx + 1];
      dst.data[dstIdx + 2] = src.data[srcIdx + 2];
      dst.data[dstIdx + 3] = src.data[srcIdx + 3];
    }
  }
}

function packFrames(frames, maxWidth, atlasPadding) {
  let x = atlasPadding;
  let y = atlasPadding;
  let rowHeight = 0;
  let atlasWidth = maxWidth;
  for (const frame of frames) {
    if (x + frame.png.width + atlasPadding > maxWidth) {
      x = atlasPadding;
      y += rowHeight + atlasPadding;
      rowHeight = 0;
    }
    frame.atlas = { x, y, width: frame.png.width, height: frame.png.height };
    x += frame.png.width + atlasPadding;
    rowHeight = Math.max(rowHeight, frame.png.height);
  }
  const atlasHeight = y + rowHeight + atlasPadding;
  return { width: atlasWidth, height: atlasHeight };
}

async function main() {
  const sourcePath = path.resolve(parseArg("--source", DEFAULT_SOURCE));
  const frameTsPath = path.resolve(parseArg("--frames-ts", DEFAULT_FRAME_TS));
  const agent = parseArg("--agent", path.basename(sourcePath).split("_")[0]);
  const variant = parseArg("--variant", "");
  const outDir = path.resolve(parseArg("--out-dir", path.join(DEFAULT_OUT_DIR, agent)));
  const maxWidth = parseIntArg("--max-width", 2048);
  const tolerance = parseIntArg("--tolerance", 34);
  const cropPadding = parseIntArg("--crop-padding", 8);
  const atlasPadding = parseIntArg("--atlas-padding", 2);
  const alphaThreshold = parseIntArg("--alpha-threshold", 18);
  const skipKeying = hasArg("--skip-keying");

  const source = PNG.sync.read(await fs.readFile(sourcePath));
  const atlasSource = await fs.readFile(frameTsPath, "utf8");
  const atlasDimensions = parseAtlasDimensionsFromTs(atlasSource);
  const frameRects = scaleFrameRects(
    parseFramesFromAtlasTs(atlasSource),
    parseIntArg("--source-map-width", atlasDimensions.imageWidth ?? 1536),
    parseIntArg("--source-map-height", atlasDimensions.imageHeight ?? 1024),
    source.width,
    source.height,
  );
  const frames = [];

  for (const rect of frameRects) {
    const rough = cropPng(source, rect);
    if (!skipKeying) keyOutConnectedBackground(rough, tolerance);
    const bounds = findAlphaBounds(rough, alphaThreshold);
    const png = trimPng(rough, bounds, cropPadding);
    frames.push({
      name: rect.name,
      source: rect,
      png,
      pivotX: Math.round(png.width / 2),
      pivotY: Math.max(1, png.height - cropPadding),
    });
  }

  const size = packFrames(frames, maxWidth, atlasPadding);
  const atlas = new PNG({ width: size.width, height: size.height });
  for (const frame of frames) {
    blit(frame.png, atlas, frame.atlas.x, frame.atlas.y);
  }

  await fs.mkdir(outDir, { recursive: true });
  const suffix = variant ? `_${variant}` : "";
  const atlasFile = path.join(outDir, `${agent}_cc_runtime_atlas${suffix}.png`);
  const manifestFile = path.join(outDir, `${agent}_cc_runtime_atlas${suffix}.json`);
  await fs.writeFile(atlasFile, PNG.sync.write(atlas));
  await fs.writeFile(
    manifestFile,
    `${JSON.stringify(
      {
        schema: "agents-arena.coherence-clash.runtime-atlas.v1",
        source: path.relative(repoRoot, sourcePath),
        framesTs: path.relative(repoRoot, frameTsPath),
        sourceMapSize: {
          width: parseIntArg("--source-map-width", atlasDimensions.imageWidth ?? 1536),
          height: parseIntArg("--source-map-height", atlasDimensions.imageHeight ?? 1024),
        },
        image: path.basename(atlasFile),
        imageWidth: atlas.width,
        imageHeight: atlas.height,
        frames: Object.fromEntries(
          frames.map((frame) => [
            frame.name,
            {
              x: frame.atlas.x,
              y: frame.atlas.y,
              width: frame.atlas.width,
              height: frame.atlas.height,
              pivotX: frame.pivotX,
              pivotY: frame.pivotY,
            },
          ]),
        ),
      },
      null,
      2,
    )}\n`,
  );

  console.log(`wrote ${path.relative(repoRoot, atlasFile)}`);
  console.log(`wrote ${path.relative(repoRoot, manifestFile)}`);
  console.log(
    `frames=${frames.length} atlas=${atlas.width}x${atlas.height} source=${path.relative(repoRoot, sourcePath)}`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
