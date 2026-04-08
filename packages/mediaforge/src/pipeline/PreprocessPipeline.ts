import type {
  FlatBackgroundPreprocessOptions,
  MediaTimeline,
  RgbColor,
  TimelineFrame,
  TimelineFramePreprocessMeta,
  TimelinePreprocessOptions,
  TimelinePreprocessReport,
  TimelinePreprocessStage,
} from "./types";

function cloneFrame(frame: TimelineFrame): TimelineFrame {
  return {
    ...frame,
    preprocess: frame.preprocess ? { ...frame.preprocess } : undefined,
  };
}

function clamp8(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function toKeyColor(value: RgbColor | undefined): RgbColor {
  return value ?? [24, 24, 24];
}

function rgbaAt(
  data: Uint8ClampedArray,
  index: number,
): [number, number, number, number] {
  return [data[index], data[index + 1], data[index + 2], data[index + 3]];
}

function colorDistance(
  a: [number, number, number],
  b: [number, number, number],
): number {
  const dr = a[0] - b[0];
  const dg = a[1] - b[1];
  const db = a[2] - b[2];
  return Math.sqrt(dr * dr + dg * dg + db * db);
}

function estimateCornerKeyColor(imageData: ImageData): RgbColor {
  const { data, width, height } = imageData;
  const corners = [
    0,
    (width - 1) * 4,
    (height - 1) * width * 4,
    ((height - 1) * width + (width - 1)) * 4,
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
    clamp8(b / Math.max(1, n)),
  ];
}

function applyChromaKeyMask(args: {
  imageData: ImageData;
  keyColor?: RgbColor;
  tolerance: number;
}): Uint8ClampedArray {
  const { imageData, tolerance } = args;
  const keyColor =
    toKeyColor(args.keyColor) ?? estimateCornerKeyColor(imageData);
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

function featherMask(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number,
): Uint8ClampedArray {
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

function maskToImageData(
  imageData: ImageData,
  mask: Uint8ClampedArray,
): ImageData {
  const next = new ImageData(
    new Uint8ClampedArray(imageData.data),
    imageData.width,
    imageData.height,
  );
  for (let i = 0, p = 0; i < next.data.length; i += 4, p += 1) {
    next.data[i + 3] = mask[p];
  }
  return next;
}

function subjectBoxFromMask(
  mask: Uint8ClampedArray,
  width: number,
  height: number,
  alphaThreshold: number,
): TimelineFramePreprocessMeta["subjectBox"] {
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
      confidence: 0,
    };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX + 1,
    height: maxY - minY + 1,
    confidence: 1,
  };
}

function centerFrameOnCanvas(args: {
  frame: TimelineFrame;
  targetWidth: number;
  targetHeight: number;
  keepFrameSize: boolean;
  subjectBox?: TimelineFramePreprocessMeta["subjectBox"];
}): {
  imageData: ImageData;
  width: number;
  height: number;
  anchor: TimelineFramePreprocessMeta["anchor"];
} {
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
        label: "fallback-center",
      },
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
        label: "fallback-center",
      },
    };
  }

  sctx.putImageData(frame.imageData, 0, 0);
  const box = subjectBox ?? {
    x: 0,
    y: 0,
    width: frame.width,
    height: frame.height,
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
      label: "subject-center",
    },
  };
}

export function createFlatBackgroundSpritePreprocess(
  options: FlatBackgroundPreprocessOptions,
): TimelinePreprocessOptions {
  const tolerance = Math.max(0, Math.min(441, options.keyTolerance ?? 42));
  const featherRadius = Math.max(
    0,
    Math.min(4, Math.round(options.featherRadius ?? 1)),
  );
  const alphaThreshold = Math.max(
    0,
    Math.min(255, Math.round(options.alphaThreshold ?? 18)),
  );

  return {
    enabled: true,
    stages: [
      {
        id: "segment-foreground",
        run: (frame) => {
          const computedKey =
            options.keyColor ?? estimateCornerKeyColor(frame.imageData);
          const rawMask = applyChromaKeyMask({
            imageData: frame.imageData,
            keyColor: computedKey,
            tolerance,
          });
          const smoothMask = featherMask(
            rawMask,
            frame.width,
            frame.height,
            featherRadius,
          );
          const imageData = maskToImageData(frame.imageData, smoothMask);
          const subjectBox = subjectBoxFromMask(
            smoothMask,
            frame.width,
            frame.height,
            alphaThreshold,
          );

          return {
            imageData,
            preprocess: {
              alphaMask: smoothMask,
              subjectBox,
              diagnostics: {
                stage: "segment-foreground",
                keyColor: computedKey,
                tolerance,
              },
            },
          };
        },
      },
      {
        id: "center-canvas",
        run: (frame) => {
          const centered = centerFrameOnCanvas({
            frame,
            targetWidth: options.targetWidth,
            targetHeight: options.targetHeight,
            keepFrameSize: options.keepFrameSize ?? false,
            subjectBox: frame.preprocess?.subjectBox,
          });

          return {
            imageData: centered.imageData,
            width: centered.width,
            height: centered.height,
            preprocess: {
              ...(frame.preprocess ?? {}),
              anchor: centered.anchor,
            },
          };
        },
      },
    ],
  };
}

export class PreprocessPipeline {
  static async run(
    timeline: MediaTimeline,
    options?: TimelinePreprocessOptions,
  ): Promise<{ timeline: MediaTimeline; report: TimelinePreprocessReport }> {
    const enabled = options?.enabled !== false;
    const stages: TimelinePreprocessStage[] = enabled
      ? (options?.stages ?? [])
      : [];

    if (!enabled || stages.length === 0 || timeline.frames.length === 0) {
      return {
        timeline,
        report: {
          enabled,
          stagesRun: stages.map((stage) => stage.id),
          frameCount: timeline.frames.length,
        },
      };
    }

    const frames: TimelineFrame[] = [];

    for (
      let frameIndex = 0;
      frameIndex < timeline.frames.length;
      frameIndex += 1
    ) {
      let nextFrame = cloneFrame(timeline.frames[frameIndex]);

      for (const stage of stages) {
        const result = await stage.run(nextFrame, {
          stageId: stage.id,
          frameIndex,
          frameCount: timeline.frames.length,
          timeline,
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
            ...(nextFrame.preprocess ?? {}),
            ...result.preprocess,
          };
        }
      }

      frames.push({
        ...nextFrame,
        index: frames.length,
      });
    }

    const processedTimeline: MediaTimeline = {
      ...timeline,
      id: `${timeline.id}-preprocessed`,
      frames,
    };

    return {
      timeline: processedTimeline,
      report: {
        enabled: true,
        stagesRun: stages.map((stage) => stage.id),
        frameCount: frames.length,
      },
    };
  }
}
