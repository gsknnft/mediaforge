// src/pipeline/CutEngine.ts
function cloneFrames(frames) {
  return frames.map((frame, index) => ({
    ...frame,
    index
  }));
}
function recalcTiming(frames) {
  let timestampMs = 0;
  const normalized = frames.map((frame, index) => {
    const durationMs2 = Math.max(1, Math.round(frame.durationMs || 0));
    const next = {
      ...frame,
      index,
      timestampMs,
      durationMs: durationMs2
    };
    timestampMs += durationMs2;
    return next;
  });
  const durationMs = timestampMs;
  const fps = normalized.length > 0 && durationMs > 0 ? Math.max(1, Math.round(normalized.length * 1e3 / durationMs)) : 1;
  return { frames: normalized, durationMs, fps };
}
var CutEngine = class {
  static cutByFrame(timeline, startFrame, endFrameInclusive, clipName = "clip") {
    if (timeline.frames.length === 0) {
      throw new Error("Cannot cut an empty timeline");
    }
    const start = Math.max(0, startFrame);
    const end = Math.min(timeline.frames.length - 1, endFrameInclusive);
    if (end < start) {
      throw new Error(
        `Invalid frame range: ${startFrame}-${endFrameInclusive}`
      );
    }
    const slice = cloneFrames(timeline.frames.slice(start, end + 1));
    const timing = recalcTiming(slice);
    const clip = {
      name: clipName,
      startFrame: 0,
      endFrame: timing.frames.length - 1
    };
    return {
      ...timeline,
      id: `${timeline.id}:${clipName}`,
      fps: timing.fps,
      durationMs: timing.durationMs,
      frames: timing.frames,
      clips: [clip]
    };
  }
  static cutByTime(timeline, startMs, endMs, clipName = "clip") {
    if (timeline.frames.length === 0) {
      throw new Error("Cannot cut an empty timeline");
    }
    const start = Math.max(0, startMs);
    const end = Math.max(start, endMs);
    const selected = timeline.frames.filter((frame) => {
      const frameStart = frame.timestampMs;
      const frameEnd = frame.timestampMs + frame.durationMs;
      return frameEnd > start && frameStart <= end;
    });
    if (selected.length === 0) {
      throw new Error(`No frames found in range ${startMs}-${endMs}ms`);
    }
    return this.cutByFrame(
      { ...timeline, frames: selected },
      0,
      selected.length - 1,
      clipName
    );
  }
  static sampleEvery(timeline, step, clipName = "sampled") {
    if (step <= 0) {
      throw new Error("step must be greater than 0");
    }
    const sampled = timeline.frames.filter((_, index) => index % step === 0);
    if (sampled.length === 0) {
      throw new Error("Sampling removed all frames");
    }
    return this.cutByFrame(
      { ...timeline, frames: sampled },
      0,
      sampled.length - 1,
      clipName
    );
  }
};

// src/pipeline/NamedClipPlanner.ts
var DEFAULT_ORDER = ["idle", "walk", "blink", "react"];
var DEFAULT_RATIOS = {
  idle: [0, 0.35],
  walk: [0.35, 0.7],
  blink: [0.7, 0.85],
  react: [0.85, 1]
};
function clampFrame(frame, maxFrame) {
  return Math.max(0, Math.min(maxFrame, frame));
}
function durationForClip(timeline, range) {
  let total = 0;
  for (let i = range.startFrame; i <= range.endFrame; i += 1) {
    total += timeline.frames[i]?.durationMs ?? 0;
  }
  return total;
}
var NamedClipPlanner = class {
  static plan(timeline, options = {}) {
    if (!timeline.frames.length) {
      throw new Error("Cannot plan clips for an empty timeline");
    }
    const maxFrame = timeline.frames.length - 1;
    const minClipFrames = Math.max(1, options.minClipFrames ?? 1);
    return DEFAULT_ORDER.map((name) => {
      const override = options.clips?.[name];
      if (override?.startFrame !== void 0 || override?.endFrame !== void 0) {
        const start = clampFrame(override.startFrame ?? 0, maxFrame);
        const end = clampFrame(
          override.endFrame ?? Math.max(start, start + minClipFrames - 1),
          maxFrame
        );
        return {
          name,
          startFrame: Math.min(start, end),
          endFrame: Math.max(start, end)
        };
      }
      const [startRatio, endRatio] = DEFAULT_RATIOS[name];
      const startFrame = clampFrame(
        Math.floor(startRatio * timeline.frames.length),
        maxFrame
      );
      const endFrame = clampFrame(
        Math.max(
          startFrame + minClipFrames - 1,
          Math.ceil(endRatio * timeline.frames.length) - 1
        ),
        maxFrame
      );
      return {
        name,
        startFrame,
        endFrame
      };
    });
  }
  static split(timeline, options = {}) {
    const plan = this.plan(timeline, options);
    const result = {};
    for (const clip of plan) {
      result[clip.name] = CutEngine.cutByFrame(
        timeline,
        clip.startFrame,
        clip.endFrame,
        clip.name
      );
    }
    return result;
  }
  static summarize(timeline, options = {}) {
    return this.plan(timeline, options).map((clip) => ({
      ...clip,
      durationMs: durationForClip(timeline, clip)
    }));
  }
};

// src/pipeline/PixelMatrixExporter.ts
function toBinaryValue(r, g, b, a, threshold) {
  if (a === 0) return 0;
  const luminance = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
  return luminance >= threshold ? 1 : 0;
}
function toGrayscaleValue(r, g, b, a) {
  if (a === 0) return 0;
  return Math.round(r * 0.299 + g * 0.587 + b * 0.114);
}
function sanitizeConstToken(value) {
  const replaced = value.replace(/[^a-zA-Z0-9_]/g, "_");
  if (!replaced) return "FRAME";
  return /^[0-9]/.test(replaced) ? `_${replaced}` : replaced;
}
function imageDataToMatrix(imageData, mode, threshold) {
  const { data, width, height } = imageData;
  const rows = new Array(height);
  for (let y = 0; y < height; y += 1) {
    const row = new Array(width);
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];
      if (mode === "alpha-mask") {
        row[x] = a > 0 ? 1 : 0;
      } else if (mode === "binary") {
        row[x] = toBinaryValue(r, g, b, a, threshold);
      } else {
        row[x] = toGrayscaleValue(r, g, b, a);
      }
    }
    rows[y] = row;
  }
  return rows;
}
function selectFrameIndexes(totalFrames, options) {
  const explicit = options.frameIndexes?.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < totalFrames
  );
  if (explicit && explicit.length > 0) {
    return Array.from(new Set(explicit)).sort((a, b) => a - b);
  }
  const stride = Math.max(1, options.frameStride ?? 1);
  const maxFrames = options.maxFrames ?? totalFrames;
  const indexes = [];
  for (let i = 0; i < totalFrames && indexes.length < maxFrames; i += stride) {
    indexes.push(i);
  }
  return indexes;
}
function serializeNumberMatrix(matrix) {
  const rows = matrix.map((row) => `  [${row.join(", ")}]`).join(",\n");
  return `[
${rows}
]`;
}
function flattenMatrix(matrix) {
  const flat = [];
  for (const row of matrix) {
    for (const value of row) {
      flat.push(value);
    }
  }
  return flat;
}
function packBits(values) {
  const bytes = new Uint8Array(Math.ceil(values.length / 8));
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] > 0) {
      bytes[Math.floor(i / 8)] |= 1 << 7 - i % 8;
    }
  }
  return bytes;
}
function serializeBytes(bytes) {
  if (!bytes.length) return "";
  const chunkSize = 32;
  const chunks = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = Array.from(bytes.slice(i, i + chunkSize));
    chunks.push(`  ${slice.join(", ")}`);
  }
  return `
${chunks.join(",\n")}
`;
}
function buildMatrixModule(constPrefix, timeline, mode, threshold, frames, includeMetadataConst) {
  const constChunks = frames.map((frame) => {
    const constName = `${constPrefix}_FRAME_${frame.index}`;
    return `export const ${constName}: number[][] = ${serializeNumberMatrix(frame.pixels)};`;
  });
  const metadataConst = includeMetadataConst ? `export const ${constPrefix}_META = ${JSON.stringify(
    {
      mode,
      threshold,
      frameCount: frames.length,
      sourceTimelineId: timeline.id,
      width: timeline.width,
      height: timeline.height
    },
    null,
    2
  )} as const;` : "";
  const allFramesConst = `export const ${constPrefix}_FRAMES: number[][][] = [
${frames.map((frame) => `  ${constPrefix}_FRAME_${frame.index}`).join(",\n")}
];`;
  return [metadataConst, ...constChunks, allFramesConst].filter(Boolean).join("\n\n");
}
function buildPackedModule(constPrefix, timeline, mode, threshold, packedFrames, includeMetadataConst) {
  const metadataConst = includeMetadataConst ? `export const ${constPrefix}_PACKED_META = ${JSON.stringify(
    {
      mode,
      threshold,
      frameCount: packedFrames.length,
      sourceTimelineId: timeline.id,
      width: timeline.width,
      height: timeline.height,
      encoding: "bit-packed-msb"
    },
    null,
    2
  )} as const;` : "";
  const decodeHelper = `export function decodeBitPackedFrame(bytes: Uint8Array, width: number, height: number): number[][] {
  const rows: number[][] = new Array(height);
  for (let y = 0; y < height; y += 1) {
    const row: number[] = new Array(width);
    for (let x = 0; x < width; x += 1) {
      const bitIndex = y * width + x;
      const byte = bytes[Math.floor(bitIndex / 8)] ?? 0;
      const bit = (byte >> (7 - (bitIndex % 8))) & 1;
      row[x] = bit;
    }
    rows[y] = row;
  }
  return rows;
}`;
  const constChunks = packedFrames.map((frame) => {
    const constName = `${constPrefix}_FRAME_${frame.index}_BITS`;
    return `export const ${constName} = new Uint8Array([${serializeBytes(frame.bytes)}]);`;
  });
  const payloadConst = `export const ${constPrefix}_PACKED_FRAMES = [
${packedFrames.map((frame) => {
    const bitsName = `${constPrefix}_FRAME_${frame.index}_BITS`;
    return `  { index: ${frame.index}, width: ${frame.width}, height: ${frame.height}, timestampMs: ${frame.timestampMs}, durationMs: ${frame.durationMs}, bitLength: ${frame.bitLength}, bytes: ${bitsName} }`;
  }).join(",\n")}
] as const;`;
  return [metadataConst, decodeHelper, ...constChunks, payloadConst].filter(Boolean).join("\n\n");
}
var PixelMatrixExporter = class {
  static exportTimeline(timeline, options = {}) {
    const mode = options.mode ?? "binary";
    const outputFormat = options.outputFormat ?? "matrix";
    const threshold = Math.max(0, Math.min(255, options.threshold ?? 128));
    const constPrefix = sanitizeConstToken(
      (options.constPrefix ?? timeline.id).toUpperCase()
    );
    const includeMetadataConst = options.includeMetadataConst !== false;
    if (outputFormat !== "matrix" && mode === "grayscale") {
      throw new Error(
        "Bit-packed output supports only binary/alpha-mask modes. Use mode 'binary' or 'alpha-mask'."
      );
    }
    const indexes = selectFrameIndexes(timeline.frames.length, options);
    const frames = indexes.map((frameIndex) => {
      const frame = timeline.frames[frameIndex];
      return {
        index: frame.index,
        width: frame.width,
        height: frame.height,
        timestampMs: frame.timestampMs,
        durationMs: frame.durationMs,
        pixels: imageDataToMatrix(frame.imageData, mode, threshold)
      };
    });
    const matrixModule = outputFormat === "bit-packed" ? void 0 : buildMatrixModule(
      constPrefix,
      timeline,
      mode,
      threshold,
      frames,
      includeMetadataConst
    );
    const packedFrames = outputFormat === "matrix" ? void 0 : frames.map((frame) => {
      const bits = packBits(flattenMatrix(frame.pixels));
      return {
        index: frame.index,
        width: frame.width,
        height: frame.height,
        timestampMs: frame.timestampMs,
        durationMs: frame.durationMs,
        bitLength: frame.width * frame.height,
        bytes: bits
      };
    });
    const packedModule = packedFrames ? buildPackedModule(
      constPrefix,
      timeline,
      mode,
      threshold,
      packedFrames,
      includeMetadataConst
    ) : void 0;
    const constModule = outputFormat === "matrix" ? matrixModule ?? "" : outputFormat === "bit-packed" ? packedModule ?? "" : [matrixModule, packedModule].filter(Boolean).join("\n\n");
    return {
      format: outputFormat,
      constModule,
      frames,
      packedFrames,
      matrixModule,
      packedModule
    };
  }
};

// src/pipeline/PixelMatrixFileEmitter.ts
function sanitizeFileToken(value) {
  const replaced = value.replace(/[^a-zA-Z0-9_-]/g, "_");
  return replaced || "pixel_matrix";
}
function ensureTsExtension(fileName) {
  return fileName.endsWith(".ts") ? fileName : `${fileName}.ts`;
}
var PixelMatrixFileEmitter = class {
  static emitModules(timeline, pixelOptions = {}, options = {}) {
    const base = sanitizeFileToken(options.baseFileName ?? timeline.id);
    const splitByClip = options.splitByClip ?? false;
    const includeIndexFile = options.includeIndexFile ?? splitByClip;
    if (!splitByClip) {
      const result = PixelMatrixExporter.exportTimeline(timeline, pixelOptions);
      return [
        {
          fileName: ensureTsExtension(`${base}.pixels`),
          content: result.constModule,
          format: result.format,
          frameCount: result.frames.length
        }
      ];
    }
    const files = [];
    const exportLines = [];
    for (const clip of timeline.clips) {
      const frameIndexes = [];
      for (let i = clip.startFrame; i <= clip.endFrame; i += 1) {
        if (i >= 0 && i < timeline.frames.length) frameIndexes.push(i);
      }
      if (!frameIndexes.length) continue;
      const result = PixelMatrixExporter.exportTimeline(timeline, {
        ...pixelOptions,
        frameIndexes
      });
      const safeClip = sanitizeFileToken(clip.name.toLowerCase());
      const fileStem = `${base}.${safeClip}.pixels`;
      const fileName = ensureTsExtension(fileStem);
      files.push({
        fileName,
        content: result.constModule,
        format: result.format,
        clipName: clip.name,
        frameCount: result.frames.length
      });
      exportLines.push(`export * from "./${fileStem}";`);
    }
    if (includeIndexFile && exportLines.length > 0) {
      files.push({
        fileName: ensureTsExtension(`${base}.pixels.index`),
        content: exportLines.join("\n"),
        format: "matrix",
        frameCount: 0
      });
    }
    return files;
  }
};

// src/pipeline/PreprocessPipeline.ts
function cloneFrame(frame) {
  return {
    ...frame,
    preprocess: frame.preprocess ? { ...frame.preprocess } : void 0
  };
}
function clamp8(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}
function toKeyColor(value) {
  return value ?? [24, 24, 24];
}
function rgbaAt(data, index) {
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}
function colorDistance(a, b) {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}
function estimateCornerKeyColor(imageData) {
  const { data, width, height } = imageData;
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4
  ];
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  for (const idx of corners) {
    const [cr, cg, cb] = rgbaAt(data, idx);
    r += cr;
    g += cg;
    b += cb;
    n += 1;
  }
  return [
    clamp8(r / Math.max(1, n)),
    clamp8(g / Math.max(1, n)),
    clamp8(b / Math.max(1, n))
  ];
}
function applyChromaKeyMask(args) {
  const { imageData, tolerance } = args;
  const keyColor = toKeyColor(args.keyColor) ?? estimateCornerKeyColor(imageData);
  const out = new Uint8ClampedArray(imageData.width * imageData.height);
  const { data } = imageData;
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const alpha = data[i + 3];
    if (alpha <= 0) {
      out[p] = 0;
      continue;
    }
    const dist = colorDistance([data[i], data[i + 1], data[i + 2]], keyColor);
    out[p] = dist <= tolerance ? 0 : alpha;
  }
  return out;
}
function featherMask(mask, width, height, radius) {
  if (radius <= 0) return mask;
  const next = new Uint8ClampedArray(mask.length);
  const diameter = radius * 2 + 1;
  const area = diameter * diameter;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let sum = 0;
      for (let dy = -radius; dy <= radius; dy += 1) {
        const yy = Math.max(0, Math.min(height - 1, y + dy));
        for (let dx = -radius; dx <= radius; dx += 1) {
          const xx = Math.max(0, Math.min(width - 1, x + dx));
          sum += mask[yy * width + xx];
        }
      }
      next[y * width + x] = clamp8(sum / area);
    }
  }
  return next;
}
function maskToImageData(imageData, mask) {
  const next = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height
  );
  for (let i = 0, p = 0; i < next.data.length; i += 4, p += 1) {
    next.data[i + 3] = mask[p];
  }
  return next;
}
function subjectBoxFromMask(mask, width, height, alphaThreshold) {
  let minX = width;
  let minY = height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      if (mask[y * width + x] < alphaThreshold) continue;
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) {
    return {
      x: 0,
      y: 0,
      width,
      height,
      confidence: 0
    };
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    confidence: 1
  };
}
function centerFrameOnCanvas(args) {
  const { frame, targetWidth, targetHeight, keepFrameSize, subjectBox } = args;
  const outWidth = keepFrameSize ? frame.width : targetWidth;
  const outHeight = keepFrameSize ? frame.height : targetHeight;
  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) {
    return {
      imageData: frame.imageData,
      width: frame.width,
      height: frame.height,
      anchor: {
        x: frame.width / 2,
        y: frame.height / 2,
        confidence: 0,
        label: "fallback-center"
      }
    };
  }
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = frame.width;
  sourceCanvas.height = frame.height;
  const sctx = sourceCanvas.getContext("2d", { willReadFrequently: true });
  if (!sctx) {
    return {
      imageData: frame.imageData,
      width: frame.width,
      height: frame.height,
      anchor: {
        x: frame.width / 2,
        y: frame.height / 2,
        confidence: 0,
        label: "fallback-center"
      }
    };
  }
  sctx.putImageData(frame.imageData, 0, 0);
  const box = subjectBox ?? {
    x: 0,
    y: 0,
    width: frame.width,
    height: frame.height
  };
  const sourceCenterX = box.x + box.width / 2;
  const sourceCenterY = box.y + box.height / 2;
  const targetCenterX = outWidth / 2;
  const targetCenterY = outHeight / 2;
  const dx = targetCenterX - sourceCenterX;
  const dy = targetCenterY - sourceCenterY;
  ctx.clearRect(0, 0, outWidth, outHeight);
  ctx.drawImage(sourceCanvas, dx, dy);
  return {
    imageData: ctx.getImageData(0, 0, outWidth, outHeight),
    width: outWidth,
    height: outHeight,
    anchor: {
      x: targetCenterX,
      y: targetCenterY,
      confidence: 1,
      label: "subject-center"
    }
  };
}
function createFlatBackgroundSpritePreprocess(options) {
  const tolerance = Math.max(0, Math.min(441, options.keyTolerance ?? 42));
  const featherRadius = Math.max(
    0,
    Math.min(4, Math.round(options.featherRadius ?? 1))
  );
  const alphaThreshold = Math.max(
    0,
    Math.min(255, Math.round(options.alphaThreshold ?? 18))
  );
  return {
    enabled: true,
    stages: [
      {
        id: "segment-foreground",
        run: (frame) => {
          const computedKey = options.keyColor ?? estimateCornerKeyColor(frame.imageData);
          const rawMask = applyChromaKeyMask({
            imageData: frame.imageData,
            keyColor: computedKey,
            tolerance
          });
          const smoothMask = featherMask(
            rawMask,
            frame.width,
            frame.height,
            featherRadius
          );
          const imageData = maskToImageData(frame.imageData, smoothMask);
          const subjectBox = subjectBoxFromMask(
            smoothMask,
            frame.width,
            frame.height,
            alphaThreshold
          );
          return {
            imageData,
            preprocess: {
              alphaMask: smoothMask,
              subjectBox,
              diagnostics: {
                stage: "segment-foreground",
                keyColor: computedKey,
                tolerance
              }
            }
          };
        }
      },
      {
        id: "center-canvas",
        run: (frame) => {
          const centered = centerFrameOnCanvas({
            frame,
            targetWidth: options.targetWidth,
            targetHeight: options.targetHeight,
            keepFrameSize: options.keepFrameSize ?? false,
            subjectBox: frame.preprocess?.subjectBox
          });
          return {
            imageData: centered.imageData,
            width: centered.width,
            height: centered.height,
            preprocess: {
              ...frame.preprocess ?? {},
              anchor: centered.anchor
            }
          };
        }
      }
    ]
  };
}
var PreprocessPipeline = class {
  static async run(timeline, options) {
    const enabled = options?.enabled !== false;
    const stages = enabled ? options?.stages ?? [] : [];
    if (!enabled || stages.length === 0 || timeline.frames.length === 0) {
      return {
        timeline,
        report: {
          enabled,
          stagesRun: stages.map((stage) => stage.id),
          frameCount: timeline.frames.length
        }
      };
    }
    const frames = [];
    for (let frameIndex = 0; frameIndex < timeline.frames.length; frameIndex += 1) {
      let nextFrame = cloneFrame(timeline.frames[frameIndex]);
      for (const stage of stages) {
        const result = await stage.run(nextFrame, {
          stageId: stage.id,
          frameIndex,
          frameCount: timeline.frames.length,
          timeline
        });
        if (!result) continue;
        if (result.imageData) {
          nextFrame.imageData = result.imageData;
        }
        if (typeof result.width === "number") {
          nextFrame.width = Math.max(1, Math.round(result.width));
        }
        if (typeof result.height === "number") {
          nextFrame.height = Math.max(1, Math.round(result.height));
        }
        if (result.preprocess) {
          nextFrame.preprocess = {
            ...nextFrame.preprocess ?? {},
            ...result.preprocess
          };
        }
      }
      frames.push({
        ...nextFrame,
        index: frames.length
      });
    }
    const processedTimeline = {
      ...timeline,
      id: `${timeline.id}-preprocessed`,
      frames
    };
    return {
      timeline: processedTimeline,
      report: {
        enabled: true,
        stagesRun: stages.map((stage) => stage.id),
        frameCount: frames.length
      }
    };
  }
};

// src/pipeline/SpriteAtlasExporter.ts
function ceilDiv(a, b) {
  return Math.floor((a + b - 1) / b);
}
var SpriteAtlasExporter = class {
  static async exportTimeline(timeline, options = {}) {
    if (!timeline.frames.length) {
      throw new Error("Cannot export atlas from empty timeline");
    }
    const framePadding = options.framePadding ?? 2;
    const maxAtlasWidth = options.maxAtlasWidth ?? 4096;
    const maxAtlasHeight = options.maxAtlasHeight ?? 4096;
    const frameScale = Math.max(0.1, options.frameScale ?? 1);
    const fitMode = options.fitMode ?? "contain";
    const backgroundFill = options.backgroundFill ?? "";
    const frameWidth = Math.max(...timeline.frames.map((f) => f.width));
    const frameHeight = Math.max(...timeline.frames.map((f) => f.height));
    const scaledFrameWidth = Math.max(1, Math.round(frameWidth * frameScale));
    const scaledFrameHeight = Math.max(1, Math.round(frameHeight * frameScale));
    const targetFrameWidth = Math.max(
      1,
      Math.round(options.targetFrameWidth ?? scaledFrameWidth)
    );
    const targetFrameHeight = Math.max(
      1,
      Math.round(options.targetFrameHeight ?? scaledFrameHeight)
    );
    const cellWidth = targetFrameWidth + framePadding * 2;
    const cellHeight = targetFrameHeight + framePadding * 2;
    const columns = Math.max(1, Math.floor(maxAtlasWidth / cellWidth));
    const rows = ceilDiv(timeline.frames.length, columns);
    const atlasWidth = Math.min(maxAtlasWidth, columns * cellWidth);
    const atlasHeight = rows * cellHeight;
    if (atlasHeight > maxAtlasHeight) {
      throw new Error(
        `Atlas height ${atlasHeight}px exceeds max ${maxAtlasHeight}px. Reduce frame count or increase limits.`
      );
    }
    const canvas = document.createElement("canvas");
    canvas.width = atlasWidth;
    canvas.height = atlasHeight;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire canvas context for atlas export");
    }
    ctx.clearRect(0, 0, atlasWidth, atlasHeight);
    const frames = timeline.frames.map((frame, index) => {
      const column = index % columns;
      const row = Math.floor(index / columns);
      const x = column * cellWidth + framePadding;
      const y = row * cellHeight + framePadding;
      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = frame.width;
      frameCanvas.height = frame.height;
      const frameCtx = frameCanvas.getContext("2d");
      if (!frameCtx) {
        throw new Error("Failed to acquire frame canvas context");
      }
      frameCtx.putImageData(frame.imageData, 0, 0);
      if (backgroundFill) {
        ctx.fillStyle = backgroundFill;
        ctx.fillRect(x, y, targetFrameWidth, targetFrameHeight);
      }
      const scaleX = targetFrameWidth / frame.width * frameScale;
      const scaleY = targetFrameHeight / frame.height * frameScale;
      const scale = fitMode === "cover" ? Math.max(scaleX, scaleY) : fitMode === "contain" ? Math.min(scaleX, scaleY) : 1;
      const drawWidth = fitMode === "stretch" ? targetFrameWidth : frame.width * scale;
      const drawHeight = fitMode === "stretch" ? targetFrameHeight : frame.height * scale;
      const drawX = x + (targetFrameWidth - drawWidth) / 2;
      const drawY = y + (targetFrameHeight - drawHeight) / 2;
      if (fitMode === "cover") {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, targetFrameWidth, targetFrameHeight);
        ctx.clip();
        ctx.drawImage(frameCanvas, drawX, drawY, drawWidth, drawHeight);
        ctx.restore();
      } else {
        ctx.drawImage(frameCanvas, drawX, drawY, drawWidth, drawHeight);
      }
      return {
        index,
        x,
        y,
        width: targetFrameWidth,
        height: targetFrameHeight,
        durationMs: frame.durationMs,
        timestampMs: frame.timestampMs
      };
    });
    const manifest = {
      version: "1.0.0",
      frameCount: timeline.frames.length,
      atlasWidth,
      atlasHeight,
      frameWidth: targetFrameWidth,
      frameHeight: targetFrameHeight,
      framePadding,
      cellWidth,
      cellHeight,
      columns,
      rows,
      clips: options.clipName ? [
        {
          name: options.clipName,
          startFrame: 0,
          endFrame: timeline.frames.length - 1
        }
      ] : timeline.clips,
      frames
    };
    const imageType = options.imageType ?? "image/png";
    const imageQuality = options.imageQuality ?? 0.92;
    const imageBlob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Failed to encode atlas image"));
            return;
          }
          resolve(blob);
        },
        imageType,
        imageQuality
      );
    });
    return { imageBlob, manifest };
  }
};

// src/pipeline/VideoFrameExtractor.ts
function waitForEvent(target, eventName) {
  return new Promise((resolve, reject) => {
    const onResolve = () => {
      cleanup();
      resolve();
    };
    const onReject = () => {
      cleanup();
      reject(new Error(`Video event failed: ${eventName}`));
    };
    const cleanup = () => {
      target.removeEventListener(eventName, onResolve);
      target.removeEventListener("error", onReject);
    };
    target.addEventListener(eventName, onResolve, {
      once: true
    });
    target.addEventListener("error", onReject, { once: true });
  });
}
var VideoFrameExtractor = class {
  static async extractFrames(options, timelineId = "video-timeline") {
    const {
      src,
      fps = 12,
      startMs = 0,
      endMs,
      maxFrames = 240,
      crossOrigin = "anonymous"
    } = options;
    if (!src) {
      throw new Error("Video source is required");
    }
    const video = document.createElement("video");
    video.preload = "auto";
    video.crossOrigin = crossOrigin;
    video.muted = true;
    video.playsInline = true;
    video.src = src;
    await waitForEvent(video, "loadedmetadata");
    const width = video.videoWidth;
    const height = video.videoHeight;
    if (!width || !height) {
      throw new Error("Failed to load video dimensions");
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire canvas context for video extraction");
    }
    const effectiveEndMs = Math.max(
      startMs,
      endMs ?? Math.floor(video.duration * 1e3)
    );
    const intervalMs = Math.max(1, Math.floor(1e3 / fps));
    const frames = [];
    let t = Math.max(0, startMs);
    while (t <= effectiveEndMs && frames.length < maxFrames) {
      video.currentTime = t / 1e3;
      await waitForEvent(video, "seeked");
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(video, 0, 0, width, height);
      const imageData = ctx.getImageData(0, 0, width, height);
      frames.push({
        index: frames.length,
        timestampMs: t,
        durationMs: intervalMs,
        width,
        height,
        imageData
      });
      t += intervalMs;
    }
    if (!frames.length) {
      throw new Error("No frames extracted from video source");
    }
    const totalDurationMs = frames.reduce(
      (sum, frame) => sum + frame.durationMs,
      0
    );
    const clip = {
      name: "full",
      startFrame: 0,
      endFrame: frames.length - 1
    };
    return {
      id: timelineId,
      sourceKind: "video",
      fps,
      durationMs: totalDurationMs,
      width,
      height,
      frames,
      clips: [clip]
    };
  }
};

// src/pipeline/TimelineBuilder.ts
function normalizePatch(patch) {
  if (patch.buffer instanceof ArrayBuffer) {
    return patch;
  }
  return new Uint8ClampedArray(patch);
}
function createTimeline(id, sourceKind, frames, width, height) {
  const durationMs = frames.reduce((sum, frame) => sum + frame.durationMs, 0);
  const fps = frames.length > 0 && durationMs > 0 ? Math.max(1, Math.round(frames.length * 1e3 / durationMs)) : 1;
  const clip = {
    name: "full",
    startFrame: 0,
    endFrame: Math.max(0, frames.length - 1)
  };
  return {
    id,
    sourceKind,
    fps,
    durationMs,
    width,
    height,
    frames,
    clips: [clip]
  };
}
var TimelineBuilder = class {
  static fromGifFrames(frames, id = "gif-timeline") {
    if (!frames.length) {
      throw new Error("No GIF frames provided");
    }
    let timestampMs = 0;
    const timelineFrames = frames.map((frame, index) => {
      const durationMs = Math.max(10, Number(frame.delay) || 100);
      const imageData = new ImageData(
        normalizePatch(frame.patch),
        frame.dims.width,
        frame.dims.height
      );
      const out = {
        index,
        timestampMs,
        durationMs,
        width: frame.dims.width,
        height: frame.dims.height,
        imageData
      };
      timestampMs += durationMs;
      return out;
    });
    const first = timelineFrames[0];
    return createTimeline(id, "gif", timelineFrames, first.width, first.height);
  }
  static async fromImageSource(source, id = "image-timeline", durationMs = 1e3) {
    const width = source.width || source.width;
    const height = source.height || source.height;
    if (!width || !height) {
      throw new Error("Unable to derive dimensions from image source");
    }
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      throw new Error("Failed to acquire 2D context for image timeline");
    }
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(source, 0, 0, width, height);
    const imageData = ctx.getImageData(0, 0, width, height);
    return createTimeline(
      id,
      "image",
      [
        {
          index: 0,
          timestampMs: 0,
          durationMs: Math.max(1, durationMs),
          width,
          height,
          imageData
        }
      ],
      width,
      height
    );
  }
  static async fromVideo(options, id = "video-timeline") {
    return VideoFrameExtractor.extractFrames(options, id);
  }
};

// src/pipeline/VeraShellExporter.ts
var DEFAULT_CLIP_TO_EXPRESSION = {
  normal: "idle",
  focused: "walk",
  tired: "walk",
  alarmed: "react",
  sleeping: "blink",
  offline: "react"
};
function frameToSheetCell(frameIndex, columns) {
  return [frameIndex % columns, Math.floor(frameIndex / columns)];
}
function downsampleTimeline(timeline, stride) {
  if (stride <= 1) return timeline;
  const frames = [];
  for (let i = 0; i < timeline.frames.length; i += stride) {
    const chunk = timeline.frames.slice(i, i + stride);
    if (!chunk.length) continue;
    const durationMs = chunk.reduce((sum, frame) => sum + frame.durationMs, 0);
    const first = chunk[0];
    frames.push({
      ...first,
      index: frames.length,
      durationMs
    });
  }
  const maxFrame = Math.max(0, frames.length - 1);
  const clips = timeline.clips.map((clip) => {
    const startFrame = Math.min(maxFrame, Math.floor(clip.startFrame / stride));
    const endFrame = Math.min(maxFrame, Math.floor(clip.endFrame / stride));
    return {
      ...clip,
      startFrame: Math.min(startFrame, endFrame),
      endFrame: Math.max(startFrame, endFrame)
    };
  });
  return {
    ...timeline,
    id: `${timeline.id}-ds${stride}`,
    fps: timeline.fps / stride,
    frames,
    clips
  };
}
var VeraShellExporter = class {
  static async exportSpriteSheet(timeline, options) {
    const preprocessResult = await PreprocessPipeline.run(
      timeline,
      options.preprocess
    );
    const preprocessTimeline = preprocessResult.timeline;
    const maxFrames = options.maxFrames ?? 0;
    const frameStrideOption = options.frameStride ?? 1;
    const computedStride = maxFrames > 0 ? Math.max(
      frameStrideOption,
      Math.ceil(preprocessTimeline.frames.length / maxFrames)
    ) : frameStrideOption;
    const exportTimeline = downsampleTimeline(
      preprocessTimeline,
      computedStride
    );
    const atlas = await SpriteAtlasExporter.exportTimeline(
      exportTimeline,
      options
    );
    const clipPlan = NamedClipPlanner.summarize(exportTimeline);
    const clipStarts = /* @__PURE__ */ new Map();
    for (const clip of clipPlan) {
      clipStarts.set(clip.name, clip.startFrame);
    }
    const mapping = {
      ...DEFAULT_CLIP_TO_EXPRESSION,
      ...options.clipToExpression ?? {}
    };
    const frames = {};
    for (const expression of Object.keys(mapping)) {
      const clipName = mapping[expression];
      const start = clipStarts.get(clipName) ?? 0;
      frames[expression] = frameToSheetCell(start, atlas.manifest.columns);
    }
    const spriteConfig = {
      type: "sheet",
      url: options.atlasUrl,
      cellWidth: atlas.manifest.cellWidth,
      cellHeight: atlas.manifest.cellHeight,
      frames
    };
    const pixelMatrix = options.pixelMatrix?.enabled ? PixelMatrixExporter.exportTimeline(exportTimeline, options.pixelMatrix) : void 0;
    return {
      ...atlas,
      veraShellManifest: {
        schema: "vera-shell.sprite-sheet.v1",
        timelineId: exportTimeline.id,
        atlas: atlas.manifest,
        sprite: spriteConfig,
        clips: clipPlan.map((clip) => ({
          name: clip.name,
          startFrame: clip.startFrame,
          endFrame: clip.endFrame,
          durationMs: clip.durationMs
        }))
      },
      pixelMatrix,
      preprocess: preprocessResult.report
    };
  }
};

// src/tasks/scanforgePreprocess.ts
var SCANFORGE_PREPROCESS_TASKS = {
  MATRIX_SPLIT: "scanforge.matrix.split",
  IMAGE_ALIGN: "scanforge.image.align",
  PREVIEW_GENERATE: "scanforge.preview.generate"
};
function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function clamp01(value) {
  return clampNumber(value, 0, 1);
}
function pixelOffset(width, x, y) {
  return (y * width + x) * 4;
}
function createImage(width, height, fillColor = [0, 0, 0, 0], label) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = fillColor[0];
    data[index + 1] = fillColor[1];
    data[index + 2] = fillColor[2];
    data[index + 3] = fillColor[3];
  }
  return { width, height, data, label };
}
function cropImage(image, x, y, width, height, label) {
  const cropped = new Uint8ClampedArray(width * height * 4);
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const sourceOffset = pixelOffset(image.width, x + col, y + row);
      const targetOffset = pixelOffset(width, col, row);
      cropped[targetOffset] = image.data[sourceOffset];
      cropped[targetOffset + 1] = image.data[sourceOffset + 1];
      cropped[targetOffset + 2] = image.data[sourceOffset + 2];
      cropped[targetOffset + 3] = image.data[sourceOffset + 3];
    }
  }
  return { width, height, data: cropped, label };
}
function isBackgroundPixel(image, x, y, alphaThreshold, colorKey, colorTolerance = 24) {
  const offset = pixelOffset(image.width, x, y);
  const alpha = image.data[offset + 3];
  if (alpha <= alphaThreshold) {
    return true;
  }
  if (!colorKey) {
    return false;
  }
  const dr = image.data[offset] - colorKey[0];
  const dg = image.data[offset + 1] - colorKey[1];
  const db = image.data[offset + 2] - colorKey[2];
  const distance = Math.sqrt(dr * dr + dg * dg + db * db);
  return distance <= colorTolerance;
}
function detectSubjectBounds(image, alphaThreshold, colorKey, colorTolerance) {
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (isBackgroundPixel(image, x, y, alphaThreshold, colorKey, colorTolerance)) {
        continue;
      }
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }
  }
  if (maxX < minX || maxY < minY) {
    return { x: 0, y: 0, width: image.width, height: image.height };
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1
  };
}
function trimSubjectBounds(subjectBox, trimPx = 0) {
  if (trimPx <= 0) {
    return subjectBox;
  }
  const maxTrimX = Math.max(0, Math.floor((subjectBox.width - 1) / 2));
  const maxTrimY = Math.max(0, Math.floor((subjectBox.height - 1) / 2));
  const safeTrimX = Math.min(trimPx, maxTrimX);
  const safeTrimY = Math.min(trimPx, maxTrimY);
  return {
    x: subjectBox.x + safeTrimX,
    y: subjectBox.y + safeTrimY,
    width: Math.max(1, subjectBox.width - safeTrimX * 2),
    height: Math.max(1, subjectBox.height - safeTrimY * 2)
  };
}
function computeAlignPlacement(args) {
  const safePadding = Math.max(0, args.padding ?? 0);
  const safeAnchorX = clamp01(args.anchorX ?? 0.5);
  const safeAnchorY = clamp01(args.anchorY ?? 0.5);
  const fitCoverage = clamp01(args.coverage ?? 0.92);
  const subjectScale = Math.max(0.01, args.subjectScale ?? 1);
  const availableWidth = Math.max(1, args.targetWidth - safePadding * 2);
  const availableHeight = Math.max(1, args.targetHeight - safePadding * 2);
  const maxFitScale = Math.min(
    availableWidth / Math.max(1, args.subjectWidth),
    availableHeight / Math.max(1, args.subjectHeight)
  );
  const scale = args.scaleOverride ?? maxFitScale * clampNumber(fitCoverage * subjectScale, 0.01, 1);
  const drawWidth = Math.max(1, Math.floor(args.subjectWidth * scale));
  const drawHeight = Math.max(1, Math.floor(args.subjectHeight * scale));
  const minOffsetX = safePadding;
  const minOffsetY = safePadding;
  const maxOffsetX = Math.max(
    safePadding,
    args.targetWidth - safePadding - drawWidth
  );
  const maxOffsetY = Math.max(
    safePadding,
    args.targetHeight - safePadding - drawHeight
  );
  const offsetX = Math.round(
    clampNumber(
      safeAnchorX * args.targetWidth - drawWidth / 2,
      minOffsetX,
      maxOffsetX
    )
  );
  const offsetY = Math.round(
    clampNumber(
      safeAnchorY * args.targetHeight - drawHeight / 2,
      minOffsetY,
      maxOffsetY
    )
  );
  return {
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
    scale
  };
}
function alignImageToPlacement(args) {
  const cropped = cropImage(
    args.image,
    args.subjectBox.x,
    args.subjectBox.y,
    args.subjectBox.width,
    args.subjectBox.height,
    args.image.label
  );
  const target = createImage(
    args.targetWidth,
    args.targetHeight,
    args.fillColor ?? [0, 0, 0, 0],
    args.image.label
  );
  drawScaledImage(
    cropped,
    target,
    args.placement.offsetX,
    args.placement.offsetY,
    args.placement.drawWidth,
    args.placement.drawHeight
  );
  return target;
}
function drawScaledImage(source, target, destinationX, destinationY, destinationWidth, destinationHeight) {
  for (let y = 0; y < destinationHeight; y += 1) {
    for (let x = 0; x < destinationWidth; x += 1) {
      const sourceX = Math.min(
        source.width - 1,
        Math.max(0, Math.floor(x / destinationWidth * source.width))
      );
      const sourceY = Math.min(
        source.height - 1,
        Math.max(0, Math.floor(y / destinationHeight * source.height))
      );
      const sourceOffset = pixelOffset(source.width, sourceX, sourceY);
      const targetOffset = pixelOffset(
        target.width,
        destinationX + x,
        destinationY + y
      );
      target.data[targetOffset] = source.data[sourceOffset];
      target.data[targetOffset + 1] = source.data[sourceOffset + 1];
      target.data[targetOffset + 2] = source.data[sourceOffset + 2];
      target.data[targetOffset + 3] = source.data[sourceOffset + 3];
    }
  }
}
function splitMatrix(input) {
  const gapX = input.gapX ?? 0;
  const gapY = input.gapY ?? 0;
  const marginX = input.marginX ?? 0;
  const marginY = input.marginY ?? 0;
  const cellWidth = input.cellWidth ?? Math.floor(
    (input.image.width - marginX * 2 - gapX * (input.cols - 1)) / input.cols
  );
  const cellHeight = input.cellHeight ?? Math.floor(
    (input.image.height - marginY * 2 - gapY * (input.rows - 1)) / input.rows
  );
  const cells = [];
  for (let row = 0; row < input.rows; row += 1) {
    for (let col = 0; col < input.cols; col += 1) {
      const x = marginX + col * (cellWidth + gapX);
      const y = marginY + row * (cellHeight + gapY);
      cells.push({
        id: `r${row}c${col}`,
        row,
        col,
        x,
        y,
        image: cropImage(
          input.image,
          x,
          y,
          cellWidth,
          cellHeight,
          `r${row}c${col}`
        )
      });
    }
  }
  return {
    task: SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT,
    rows: input.rows,
    cols: input.cols,
    cellWidth,
    cellHeight,
    cells
  };
}
function alignImage(input) {
  const alphaThreshold = input.alphaThreshold ?? 8;
  const subjectBox = trimSubjectBounds(
    detectSubjectBounds(
      input.image,
      alphaThreshold,
      input.colorKey,
      input.colorTolerance
    ),
    input.trimPx ?? 0
  );
  const placement = computeAlignPlacement({
    subjectWidth: subjectBox.width,
    subjectHeight: subjectBox.height,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    padding: input.padding,
    anchorX: input.anchorX,
    anchorY: input.anchorY,
    coverage: input.coverage,
    subjectScale: input.subjectScale
  });
  const target = alignImageToPlacement({
    image: input.image,
    subjectBox,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    fillColor: input.fillColor,
    placement
  });
  return {
    task: SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN,
    image: target,
    subjectBox,
    offsetX: placement.offsetX,
    offsetY: placement.offsetY,
    scale: placement.scale,
    drawWidth: placement.drawWidth,
    drawHeight: placement.drawHeight
  };
}
function alignImageSet(input) {
  if (input.images.length === 0) {
    return {
      images: [],
      subjectBoxes: [],
      placements: [],
      sharedScale: 1
    };
  }
  const alphaThreshold = input.alphaThreshold ?? 8;
  const subjectBoxes = input.images.map(
    (image) => trimSubjectBounds(
      detectSubjectBounds(
        image,
        alphaThreshold,
        input.colorKey,
        input.colorTolerance
      ),
      input.trimPx ?? 0
    )
  );
  const maxSubjectWidth = Math.max(...subjectBoxes.map((box) => box.width));
  const maxSubjectHeight = Math.max(...subjectBoxes.map((box) => box.height));
  const sharedPlacement = computeAlignPlacement({
    subjectWidth: maxSubjectWidth,
    subjectHeight: maxSubjectHeight,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    padding: input.padding,
    anchorX: input.anchorX,
    anchorY: input.anchorY,
    coverage: input.coverage,
    subjectScale: input.subjectScale
  });
  const placements = subjectBoxes.map(
    (subjectBox) => computeAlignPlacement({
      subjectWidth: subjectBox.width,
      subjectHeight: subjectBox.height,
      targetWidth: input.targetWidth,
      targetHeight: input.targetHeight,
      padding: input.padding,
      anchorX: input.anchorX,
      anchorY: input.anchorY,
      scaleOverride: sharedPlacement.scale
    })
  );
  const images = input.images.map(
    (image, index) => alignImageToPlacement({
      image,
      subjectBox: subjectBoxes[index],
      targetWidth: input.targetWidth,
      targetHeight: input.targetHeight,
      fillColor: input.fillColor,
      placement: placements[index]
    })
  );
  return {
    images,
    subjectBoxes,
    placements,
    sharedScale: sharedPlacement.scale
  };
}
function generatePreview(input) {
  if (input.images.length === 0) {
    throw new Error("preview.generate requires at least one image");
  }
  const padding = input.padding ?? 8;
  const cellWidth = input.cellWidth ?? Math.max(...input.images.map((image) => image.width));
  const cellHeight = input.cellHeight ?? Math.max(...input.images.map((image) => image.height));
  const columns = input.columns ?? Math.max(1, Math.ceil(Math.sqrt(input.images.length)));
  const rows = Math.ceil(input.images.length / columns);
  const preview = createImage(
    columns * cellWidth + (columns + 1) * padding,
    rows * cellHeight + (rows + 1) * padding,
    input.fillColor ?? [18, 20, 24, 255],
    "scanforge-preview"
  );
  const placements = input.images.map((image, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const scale = Math.min(cellWidth / image.width, cellHeight / image.height);
    const width = Math.max(1, Math.floor(image.width * scale));
    const height = Math.max(1, Math.floor(image.height * scale));
    const x = padding + column * (cellWidth + padding) + Math.floor((cellWidth - width) / 2);
    const y = padding + row * (cellHeight + padding) + Math.floor((cellHeight - height) / 2);
    drawScaledImage(image, preview, x, y, width, height);
    return { index, x, y, width, height };
  });
  return {
    task: SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE,
    image: preview,
    placements,
    columns,
    rows
  };
}
function registerScanForgePreprocessTasks(registry) {
  registry.register(SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT, splitMatrix);
  registry.register(SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN, alignImage);
  registry.register(
    SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE,
    generatePreview
  );
}

// src/runtime/taskProtocol.ts
function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}
var RuntimeTaskRegistry = class {
  handlers = /* @__PURE__ */ new Map();
  register(taskName, handler) {
    if (!isNonEmptyString(taskName)) {
      throw new Error("Runtime task name must be a non-empty string");
    }
    if (typeof handler !== "function") {
      throw new Error(`Runtime task handler for ${taskName} must be a function`);
    }
    if (this.handlers.has(taskName)) {
      throw new Error(`Runtime task ${taskName} is already registered`);
    }
    this.handlers.set(taskName, handler);
  }
  has(taskName) {
    return this.handlers.has(taskName);
  }
  async run(taskName, payload) {
    const handler = this.handlers.get(taskName);
    if (!handler) {
      throw new Error(`No runtime task registered for ${taskName}`);
    }
    return await handler(payload);
  }
};

// src/runtime/WorkerPool.ts
function getDefaultConcurrency() {
  if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
    return navigator.hardwareConcurrency;
  }
  return 4;
}
var WorkerPool = class _WorkerPool {
  constructor(maxWorkers = Math.max(
    1,
    Math.ceil(getDefaultConcurrency())
  ), workerScript) {
    this.maxWorkers = maxWorkers;
    this.workerScript = workerScript;
  }
  static instance = null;
  executingTasks = /* @__PURE__ */ new Map();
  availableWorkers = /* @__PURE__ */ new Set();
  taskRegistry = new RuntimeTaskRegistry();
  queue = [];
  initialized = false;
  shutdownRequested = false;
  static getInstance(maxWorkers, workerScript) {
    if (!this.instance) {
      this.instance = new _WorkerPool(maxWorkers, workerScript);
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  get stats() {
    return {
      activeWorkers: this.executingTasks.size,
      availableWorkers: this.availableWorkers.size,
      maxWorkers: this.maxWorkers,
      queuedTasks: this.queue.length
    };
  }
  async initialize() {
    if (this.initialized) {
      return;
    }
    for (let workerId = 0; workerId < this.maxWorkers; workerId += 1) {
      this.availableWorkers.add(workerId);
    }
    this.shutdownRequested = false;
    this.initialized = true;
  }
  async registerTask(taskName, taskFunction) {
    this.taskRegistry.register(taskName, taskFunction);
  }
  hasTask(taskName) {
    return this.taskRegistry.has(taskName);
  }
  async runTask(taskName, payload, timeout = 3e4) {
    if (!this.taskRegistry.has(taskName)) {
      throw new Error(`Unknown worker task: ${taskName}`);
    }
    return this.addTask(
      () => this.taskRegistry.run(taskName, payload),
      timeout
    );
  }
  async addTask(task, timeout = 3e4) {
    if (!this.initialized) {
      await this.initialize();
    }
    if (this.shutdownRequested) {
      throw new Error("Worker pool is shutting down");
    }
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
        timeoutMs: timeout
      });
      this.processQueue();
    });
  }
  markWorkerAvailable(workerId) {
    this.availableWorkers.add(workerId);
  }
  async terminate(force = false) {
    this.shutdownRequested = true;
    if (force) {
      while (this.queue.length > 0) {
        const task = this.queue.shift();
        task?.reject(new Error("Worker pool terminated"));
      }
    }
    for (const [, task] of this.executingTasks) {
      clearTimeout(task.timeoutId);
      if (force) {
        task.reject(new Error("Worker pool terminated"));
      }
    }
    this.executingTasks.clear();
    this.availableWorkers.clear();
    this.initialized = false;
  }
  processQueue() {
    while (this.queue.length > 0 && this.availableWorkers.size > 0) {
      const workerId = this.availableWorkers.values().next().value;
      if (workerId === void 0) {
        return;
      }
      this.availableWorkers.delete(workerId);
      const queuedTask = this.queue.shift();
      if (!queuedTask) {
        this.availableWorkers.add(workerId);
        return;
      }
      const timeoutId = setTimeout(() => {
        const executing = this.executingTasks.get(workerId);
        if (!executing) {
          return;
        }
        this.executingTasks.delete(workerId);
        executing.reject(new Error("Task timed out"));
        this.markWorkerAvailable(workerId);
        this.processQueue();
      }, queuedTask.timeoutMs);
      this.executingTasks.set(workerId, {
        ...queuedTask,
        timeoutId
      });
      void this.executeTask(workerId, queuedTask, timeoutId);
    }
  }
  async executeTask(workerId, queuedTask, timeoutId) {
    try {
      const result = await queuedTask.task();
      clearTimeout(timeoutId);
      if (this.executingTasks.has(workerId)) {
        queuedTask.resolve(result);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      if (this.executingTasks.has(workerId)) {
        queuedTask.reject(error);
      }
    } finally {
      this.executingTasks.delete(workerId);
      if (!this.shutdownRequested) {
        this.markWorkerAvailable(workerId);
        this.processQueue();
      }
    }
  }
};
var workerPool = WorkerPool.getInstance();

// src/runtime/BrowserTaskAdapter.ts
var BrowserTaskAdapter = class {
  workerScriptUrl;
  pendingRequests = /* @__PURE__ */ new Map();
  nextRequestId = 0;
  worker = null;
  constructor(options = {}) {
    this.pool = options.pool ?? WorkerPool.getInstance();
    this.registry = options.registry ?? new RuntimeTaskRegistry();
    this.workerScriptUrl = options.workerScriptUrl;
  }
  pool;
  registry;
  registerTask(taskName, handler) {
    this.registry.register(taskName, handler);
    void this.pool.registerTask(taskName, handler);
  }
  async runTask(taskName, payload, timeoutMs = 3e4) {
    if (this.registry.has(taskName)) {
      return this.pool.runTask(taskName, payload, timeoutMs);
    }
    if (typeof Worker !== "undefined" && this.workerScriptUrl) {
      return this.runTaskInWorker(
        taskName,
        payload,
        timeoutMs
      );
    }
    return this.pool.runTask(taskName, payload, timeoutMs);
  }
  get taskRegistry() {
    return this.registry;
  }
  terminate() {
    for (const pending of this.pendingRequests.values()) {
      clearTimeout(pending.timeoutId);
      pending.reject(new Error("Browser task adapter terminated"));
    }
    this.pendingRequests.clear();
    this.worker?.terminate();
    this.worker = null;
  }
  async runTaskInWorker(taskName, payload, timeoutMs) {
    const worker = this.ensureWorker();
    const requestId = `task-${this.nextRequestId++}`;
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Task timed out: ${taskName}`));
      }, timeoutMs);
      this.pendingRequests.set(requestId, {
        resolve: (value) => resolve(value),
        reject,
        timeoutId
      });
      worker.postMessage({
        id: requestId,
        taskName,
        payload
      });
    });
  }
  ensureWorker() {
    if (this.worker) {
      return this.worker;
    }
    if (!this.workerScriptUrl) {
      throw new Error(
        "BrowserTaskAdapter requires workerScriptUrl for off-main-thread execution"
      );
    }
    this.worker = new Worker(this.workerScriptUrl, { type: "module" });
    this.worker.onmessage = (event) => {
      const response = event.data;
      const pending = this.pendingRequests.get(response.id);
      if (!pending) {
        return;
      }
      clearTimeout(pending.timeoutId);
      this.pendingRequests.delete(response.id);
      if (response.ok) {
        pending.resolve(response.result);
        return;
      }
      pending.reject(new Error(response.error ?? "Task failed"));
    };
    this.worker.onerror = (error) => {
      for (const pending of this.pendingRequests.values()) {
        clearTimeout(pending.timeoutId);
        pending.reject(error);
      }
      this.pendingRequests.clear();
      this.worker?.terminate();
      this.worker = null;
    };
    return this.worker;
  }
};
var browserTaskAdapter = new BrowserTaskAdapter();

// src/runtime/CanvasPool.ts
function createCanvasElement(width, height) {
  if (typeof document === "undefined") {
    throw new Error(
      "CanvasPool requires a DOM-like environment with document.createElement"
    );
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}
var CanvasPool = class _CanvasPool {
  constructor(maxPoolSize = 5, maxCanvasesPerSize = 2, memoryLimit = 500 * 1024 * 1024) {
    this.maxPoolSize = maxPoolSize;
    this.maxCanvasesPerSize = maxCanvasesPerSize;
    this.memoryLimit = memoryLimit;
  }
  static instance = null;
  pool = /* @__PURE__ */ new Map();
  usage = /* @__PURE__ */ new Map();
  metrics = /* @__PURE__ */ new Map();
  static getInstance() {
    if (!this.instance) {
      this.instance = new _CanvasPool();
    }
    return this.instance;
  }
  static destroyInstance() {
    this.instance = null;
  }
  getCanvas(width, height, _useFabric = false) {
    const key = this.getKey(width, height);
    const poolForSize = this.pool.get(key);
    if (poolForSize && poolForSize.length > 0) {
      this.incrementUsage(key);
      this.updateMetrics(key);
      return poolForSize.pop();
    }
    this.incrementUsage(key);
    this.updateMetrics(key);
    return createCanvasElement(width, height);
  }
  releaseCanvas(canvas) {
    const key = this.getKey(canvas.width, canvas.height);
    if (!this.shouldAddToPool(key)) {
      this.disposeCanvas(canvas);
      return;
    }
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    const poolForSize = this.pool.get(key) ?? [];
    poolForSize.push(canvas);
    this.pool.set(key, poolForSize);
    this.updateMetrics(key);
  }
  clear() {
    for (const canvases of this.pool.values()) {
      canvases.forEach((canvas) => this.disposeCanvas(canvas));
    }
    this.pool.clear();
    this.usage.clear();
    this.metrics.clear();
  }
  terminate() {
    this.clear();
  }
  getPoolSize() {
    return this.pool.size;
  }
  getUsageStats() {
    return this.usage;
  }
  getKey(width, height) {
    return `${width}x${height}`;
  }
  incrementUsage(key) {
    this.usage.set(key, (this.usage.get(key) ?? 0) + 1);
  }
  shouldAddToPool(key) {
    const currentSize = this.pool.get(key)?.length ?? 0;
    const totalCanvases = Array.from(this.pool.values()).reduce(
      (count, canvases) => count + canvases.length,
      0
    );
    return currentSize < this.maxCanvasesPerSize && totalCanvases < this.maxPoolSize && this.getCurrentMemoryUsage() < this.memoryLimit;
  }
  getCurrentMemoryUsage() {
    return Array.from(this.pool.entries()).reduce((total, [key, canvases]) => {
      const [width, height] = key.split("x").map(Number);
      return total + canvases.length * width * height * 4;
    }, 0);
  }
  updateMetrics(key) {
    const metric = this.metrics.get(key) ?? { usage: 0, lastUsed: 0 };
    metric.usage += 1;
    metric.lastUsed = Date.now();
    this.metrics.set(key, metric);
  }
  disposeCanvas(canvas) {
    canvas.width = 0;
    canvas.height = 0;
    canvas.remove();
  }
};
var canvasPool = CanvasPool.getInstance();

// src/runtime/NodeWorkerThreadsAdapter.ts
import { randomUUID } from "node:crypto";
var NodeWorkerThreadsAdapter = class {
  constructor(workerPath) {
    this.workerPath = workerPath;
  }
  async runTask(taskName, payload) {
    const workerThreadsModule = await import("node:worker_threads");
    const request = {
      id: randomUUID(),
      taskName,
      payload
    };
    const workerPath = this.resolveWorkerPath();
    return new Promise((resolve, reject) => {
      const worker = new workerThreadsModule.Worker(workerPath);
      let settled = false;
      worker.once("message", (response) => {
        settled = true;
        worker.terminate().catch(() => void 0);
        if (response.ok === true) {
          resolve(response.result);
          return;
        }
        reject(new Error(response.error));
      });
      worker.once("error", (error) => {
        settled = true;
        worker.terminate().catch(() => void 0);
        reject(error);
      });
      worker.once("exit", (code) => {
        if (!settled && code !== 0) {
          reject(new Error(`Node worker exited before responding (code ${code})`));
        }
      });
      worker.postMessage(request);
    });
  }
  resolveWorkerPath() {
    if (this.workerPath) {
      return this.workerPath;
    }
    throw new Error(
      "NodeWorkerThreadsAdapter requires an explicit workerPath. Use the built ./node-worker entry output when wiring the adapter."
    );
  }
};
export {
  BrowserTaskAdapter,
  CutEngine,
  NamedClipPlanner,
  NodeWorkerThreadsAdapter,
  PixelMatrixExporter,
  PixelMatrixFileEmitter,
  PreprocessPipeline,
  RuntimeTaskRegistry,
  SCANFORGE_PREPROCESS_TASKS,
  SpriteAtlasExporter,
  TimelineBuilder,
  VeraShellExporter,
  VideoFrameExtractor,
  WorkerPool,
  alignImage,
  alignImageSet,
  createFlatBackgroundSpritePreprocess,
  generatePreview,
  registerScanForgePreprocessTasks,
  splitMatrix
};
