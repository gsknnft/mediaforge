#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PNG } from "pngjs";
let canvasLoader = null;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../../..");

const defaultBase = path.join(
  repoRoot,
  "packages/vera-shell/public/assets/characters/plankton",
);

const EXPRESSION_NAMES = [
  "normal",
  "focused",
  "tired",
  "happy",
  "sad",
  "thinking",
  "alarmed",
  "sleeping",
  "offline",
];

// Default placement:
// overlays are typically facial elements and should sit above center.
const DEFAULT_OFFSET_X = -8;
const DEFAULT_OFFSET_Y = -120;

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

function clamp01(value) {
  return Math.min(1, Math.max(0, value));
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function parseFloatArg(flag, fallback) {
  const raw = parseArg(flag, String(fallback));
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function parseNonNegativeIntArg(flag, fallback) {
  const raw = parseArg(flag, String(fallback));
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function resolveEnumArg(flag, allowed, fallback) {
  const raw = parseArg(flag, fallback).trim().toLowerCase();
  return allowed.includes(raw) ? raw : fallback;
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

function findOpaqueBounds(png) {
  let minX = png.width;
  let minY = png.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < png.height; y += 1) {
    for (let x = 0; x < png.width; x += 1) {
      const idx = (y * png.width + x) * 4;
      if (png.data[idx + 3] === 0) continue;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) {
    return {
      minX: 0,
      minY: 0,
      maxX: png.width - 1,
      maxY: png.height - 1,
      width: png.width,
      height: png.height,
    };
  }
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
  };
}

function transformedContentBounds(args) {
  const {
    bounds,
    overlayWidth,
    overlayHeight,
    anchorX,
    anchorY,
    scale,
    tiltDeg,
  } = args;
  const theta = (tiltDeg * Math.PI) / 180;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const halfW = overlayWidth / 2;
  const halfH = overlayHeight / 2;
  const corners = [
    [bounds.minX, bounds.minY],
    [bounds.maxX, bounds.minY],
    [bounds.minX, bounds.maxY],
    [bounds.maxX, bounds.maxY],
  ];

  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;

  for (const [sx, sy] of corners) {
    const relX = (sx - halfW) * scale;
    const relY = (sy - halfH) * scale;
    const tx = anchorX + (relX * cosT - relY * sinT);
    const ty = anchorY + (relX * sinT + relY * cosT);
    if (tx < minX) minX = tx;
    if (tx > maxX) maxX = tx;
    if (ty < minY) minY = ty;
    if (ty > maxY) maxY = ty;
  }

  return {
    minX,
    minY,
    maxX,
    maxY,
    width: maxX - minX,
    height: maxY - minY,
  };
}

function fitOverlayIntoFrame(args) {
  const {
    bounds,
    overlayWidth,
    overlayHeight,
    mainWidth,
    mainHeight,
    anchorX,
    anchorY,
    scale,
    tiltDeg,
    padding,
  } = args;

  const safePadding = Math.max(0, padding);
  const availableWidth = Math.max(1, mainWidth - safePadding * 2);
  const availableHeight = Math.max(1, mainHeight - safePadding * 2);

  let fittedScale = scale;
  let fittedAnchorX = anchorX;
  let fittedAnchorY = anchorY;

  let projected = transformedContentBounds({
    bounds,
    overlayWidth,
    overlayHeight,
    anchorX: fittedAnchorX,
    anchorY: fittedAnchorY,
    scale: fittedScale,
    tiltDeg,
  });

  if (projected.width > availableWidth || projected.height > availableHeight) {
    const scaleFactor = Math.min(
      availableWidth / Math.max(1, projected.width),
      availableHeight / Math.max(1, projected.height),
    );
    fittedScale *= scaleFactor;
    projected = transformedContentBounds({
      bounds,
      overlayWidth,
      overlayHeight,
      anchorX: fittedAnchorX,
      anchorY: fittedAnchorY,
      scale: fittedScale,
      tiltDeg,
    });
  }

  let shiftX = 0;
  let shiftY = 0;
  if (projected.minX < safePadding) {
    shiftX += safePadding - projected.minX;
  }
  if (projected.maxX > mainWidth - safePadding) {
    shiftX -= projected.maxX - (mainWidth - safePadding);
  }
  if (projected.minY < safePadding) {
    shiftY += safePadding - projected.minY;
  }
  if (projected.maxY > mainHeight - safePadding) {
    shiftY -= projected.maxY - (mainHeight - safePadding);
  }

  fittedAnchorX += shiftX;
  fittedAnchorY += shiftY;

  return {
    anchorX: fittedAnchorX,
    anchorY: fittedAnchorY,
    scale: fittedScale,
  };
}

function blendOverlayTransformed(
  mainPng,
  overlayPng,
  alphaScale,
  anchorX,
  anchorY,
  scale,
  tiltDeg,
) {
  const out = new PNG({ width: mainPng.width, height: mainPng.height });
  mainPng.data.copy(out.data);
  const safeScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
  const theta = (tiltDeg * Math.PI) / 180;
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);
  const halfW = overlayPng.width / 2;
  const halfH = overlayPng.height / 2;

  for (let ty = 0; ty < mainPng.height; ty += 1) {
    for (let tx = 0; tx < mainPng.width; tx += 1) {
      const relX = tx - anchorX;
      const relY = ty - anchorY;
      const srcRelX = (relX * cosT + relY * sinT) / safeScale;
      const srcRelY = (-relX * sinT + relY * cosT) / safeScale;
      const srcX = Math.round(srcRelX + halfW);
      const srcY = Math.round(srcRelY + halfH);
      if (
        srcX < 0 ||
        srcY < 0 ||
        srcX >= overlayPng.width ||
        srcY >= overlayPng.height
      ) {
        continue;
      }
      const srcIdx = (srcY * overlayPng.width + srcX) * 4;
      const oa = (overlayPng.data[srcIdx + 3] / 255) * alphaScale;
      if (oa <= 0) continue;
      const dstIdx = (ty * mainPng.width + tx) * 4;
      const br = out.data[dstIdx];
      const bg = out.data[dstIdx + 1];
      const bb = out.data[dstIdx + 2];
      const ba = out.data[dstIdx + 3] / 255;
      const or = overlayPng.data[srcIdx];
      const og = overlayPng.data[srcIdx + 1];
      const ob = overlayPng.data[srcIdx + 2];
      const outA = oa + ba * (1 - oa);
      if (outA <= 0) {
        out.data[dstIdx] = 0;
        out.data[dstIdx + 1] = 0;
        out.data[dstIdx + 2] = 0;
        out.data[dstIdx + 3] = 0;
      } else {
        out.data[dstIdx] = Math.round((or * oa + br * ba * (1 - oa)) / outA);
        out.data[dstIdx + 1] = Math.round(
          (og * oa + bg * ba * (1 - oa)) / outA,
        );
        out.data[dstIdx + 2] = Math.round(
          (ob * oa + bb * ba * (1 - oa)) / outA,
        );
        out.data[dstIdx + 3] = Math.round(outA * 255);
      }
    }
  }
  return out;
}

async function readPng(filePath) {
  const buffer = await fs.readFile(filePath);
  try {
    return PNG.sync.read(buffer);
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

async function main() {
  const baseDir = path.resolve(parseArg("--base-dir", defaultBase));
  const mainPath = path.resolve(
    parseArg("--main", path.join(baseDir, "main.png")),
  );
  const expressionsDir = path.resolve(
    parseArg("--expressions-dir", path.join(baseDir, "expressions")),
  );
  const outputDir = path.resolve(
    parseArg("--output-dir", path.join(baseDir, "composed")),
  );
  const manualOffsetX =
    Number.parseInt(parseArg("--offset-x", String(DEFAULT_OFFSET_X)), 10) ||
    DEFAULT_OFFSET_X;
  const manualOffsetY =
    Number.parseInt(parseArg("--offset-y", String(DEFAULT_OFFSET_Y)), 10) ||
    DEFAULT_OFFSET_Y;
  const transformScale = parseFloatArg("--scale", 1);
  const tiltDeg = parseFloatArg("--tilt-deg", 0);
  const alphaScale = clamp01(Number.parseFloat(parseArg("--alpha-scale", "1")));
  const fitMode = resolveEnumArg("--fit-mode", ["contain", "off"], "contain");
  const fitPadding = parseNonNegativeIntArg("--fit-padding", 6);
  const fitScale = clamp(parseFloatArg("--fit-scale", 1), 0.1, 3);
  const expressionNames = parseListArg("--names", EXPRESSION_NAMES);

  await fs.mkdir(outputDir, { recursive: true });
  const mainPng = await readPng(mainPath);

  for (const name of expressionNames) {
    const expressionPath = path.join(expressionsDir, `${name}.png`);
    const outPath = path.join(outputDir, `${name}.png`);

    let overlayPng;
    try {
      overlayPng = await readPng(expressionPath);
    } catch {
      await fs.writeFile(outPath, PNG.sync.write(mainPng));
      console.log(`copied main fallback for ${name}`);
      continue;
    }

    const autoCenterX = Math.floor((mainPng.width - overlayPng.width) / 2);
    const autoCenterY = Math.floor((mainPng.height - overlayPng.height) / 2);
    let anchorX = autoCenterX + manualOffsetX + overlayPng.width / 2;
    let anchorY = autoCenterY + manualOffsetY + overlayPng.height / 2;
    let composedScale = transformScale;

    if (fitMode === "contain") {
      const opaqueBounds = findOpaqueBounds(overlayPng);
      const fitted = fitOverlayIntoFrame({
        bounds: opaqueBounds,
        overlayWidth: overlayPng.width,
        overlayHeight: overlayPng.height,
        mainWidth: mainPng.width,
        mainHeight: mainPng.height,
        anchorX,
        anchorY,
        scale: composedScale,
        tiltDeg,
        padding: fitPadding,
      });
      anchorX = fitted.anchorX;
      anchorY = fitted.anchorY;
      composedScale = fitted.scale;
    }

    // Optional size tuning after fit; values <1 shrink, >1 enlarge.
    composedScale *= fitScale;

    const out = blendOverlayTransformed(
      mainPng,
      overlayPng,
      alphaScale,
      anchorX,
      anchorY,
      composedScale,
      tiltDeg,
    );

    await fs.writeFile(outPath, PNG.sync.write(out));
    console.log(`wrote ${path.relative(repoRoot, outPath)}`);
  }

  console.log(
      `settings fit-mode=${fitMode} fit-padding=${fitPadding} fit-scale=${fitScale} scale=${transformScale} offset=(${manualOffsetX},${manualOffsetY}) tilt=${tiltDeg} names=${expressionNames.length}`,
  );
  console.log("done");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
