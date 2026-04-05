import type {
  MediaTimeline,
  PixelMatrixExportOptions,
  PixelMatrixExportResult,
  PixelMatrixFrame,
  PixelMatrixMode,
  PixelMatrixOutputFormat,
  PixelMatrixPackedFrame,
} from "./types";

function toBinaryValue(
  r: number,
  g: number,
  b: number,
  a: number,
  threshold: number,
): number {
  if (a === 0) return 0;
  const luminance = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
  return luminance >= threshold ? 1 : 0;
}

function toGrayscaleValue(r: number, g: number, b: number, a: number): number {
  if (a === 0) return 0;
  return Math.round(r * 0.299 + g * 0.587 + b * 0.114);
}

function sanitizeConstToken(value: string): string {
  const replaced = value.replace(/[^a-zA-Z0-9_]/g, "_");
  if (!replaced) return "FRAME";
  return /^[0-9]/.test(replaced) ? `_${replaced}` : replaced;
}

function imageDataToMatrix(
  imageData: ImageData,
  mode: PixelMatrixMode,
  threshold: number,
): number[][] {
  const { data, width, height } = imageData;
  const rows: number[][] = new Array(height);

  for (let y = 0; y < height; y += 1) {
    const row: number[] = new Array(width);
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

function selectFrameIndexes(
  totalFrames: number,
  options: PixelMatrixExportOptions,
): number[] {
  const explicit = options.frameIndexes?.filter(
    (index) => Number.isInteger(index) && index >= 0 && index < totalFrames,
  );

  if (explicit && explicit.length > 0) {
    return Array.from(new Set(explicit)).sort((a, b) => a - b);
  }

  const stride = Math.max(1, options.frameStride ?? 1);
  const maxFrames = options.maxFrames ?? totalFrames;
  const indexes: number[] = [];

  for (let i = 0; i < totalFrames && indexes.length < maxFrames; i += stride) {
    indexes.push(i);
  }

  return indexes;
}

function serializeNumberMatrix(matrix: number[][]): string {
  const rows = matrix.map((row) => `  [${row.join(", ")}]`).join(",\n");
  return `[\n${rows}\n]`;
}

function flattenMatrix(matrix: number[][]): number[] {
  const flat: number[] = [];
  for (const row of matrix) {
    for (const value of row) {
      flat.push(value);
    }
  }
  return flat;
}

function packBits(values: number[]): Uint8Array {
  const bytes = new Uint8Array(Math.ceil(values.length / 8));
  for (let i = 0; i < values.length; i += 1) {
    if (values[i] > 0) {
      bytes[Math.floor(i / 8)] |= 1 << (7 - (i % 8));
    }
  }
  return bytes;
}

function serializeBytes(bytes: Uint8Array): string {
  if (!bytes.length) return "";
  const chunkSize = 32;
  const chunks: string[] = [];
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = Array.from(bytes.slice(i, i + chunkSize));
    chunks.push(`  ${slice.join(", ")}`);
  }
  return `\n${chunks.join(",\n")}\n`;
}

function buildMatrixModule(
  constPrefix: string,
  timeline: MediaTimeline,
  mode: PixelMatrixMode,
  threshold: number,
  frames: PixelMatrixFrame[],
  includeMetadataConst: boolean,
): string {
  const constChunks = frames.map((frame) => {
    const constName = `${constPrefix}_FRAME_${frame.index}`;
    return `export const ${constName}: number[][] = ${serializeNumberMatrix(frame.pixels)};`;
  });

  const metadataConst = includeMetadataConst
    ? `export const ${constPrefix}_META = ${JSON.stringify(
        {
          mode,
          threshold,
          frameCount: frames.length,
          sourceTimelineId: timeline.id,
          width: timeline.width,
          height: timeline.height,
        },
        null,
        2,
      )} as const;`
    : "";

  const allFramesConst = `export const ${constPrefix}_FRAMES: number[][][] = [\n${frames
    .map((frame) => `  ${constPrefix}_FRAME_${frame.index}`)
    .join(",\n")}\n];`;

  return [metadataConst, ...constChunks, allFramesConst]
    .filter(Boolean)
    .join("\n\n");
}

function buildPackedModule(
  constPrefix: string,
  timeline: MediaTimeline,
  mode: PixelMatrixMode,
  threshold: number,
  packedFrames: PixelMatrixPackedFrame[],
  includeMetadataConst: boolean,
): string {
  const metadataConst = includeMetadataConst
    ? `export const ${constPrefix}_PACKED_META = ${JSON.stringify(
        {
          mode,
          threshold,
          frameCount: packedFrames.length,
          sourceTimelineId: timeline.id,
          width: timeline.width,
          height: timeline.height,
          encoding: "bit-packed-msb",
        },
        null,
        2,
      )} as const;`
    : "";

  const decodeHelper = `export function decodeBitPackedFrame(bytes: Uint8Array, width: number, height: number): number[][] {\n  const rows: number[][] = new Array(height);\n  for (let y = 0; y < height; y += 1) {\n    const row: number[] = new Array(width);\n    for (let x = 0; x < width; x += 1) {\n      const bitIndex = y * width + x;\n      const byte = bytes[Math.floor(bitIndex / 8)] ?? 0;\n      const bit = (byte >> (7 - (bitIndex % 8))) & 1;\n      row[x] = bit;\n    }\n    rows[y] = row;\n  }\n  return rows;\n}`;

  const constChunks = packedFrames.map((frame) => {
    const constName = `${constPrefix}_FRAME_${frame.index}_BITS`;
    return `export const ${constName} = new Uint8Array([${serializeBytes(frame.bytes)}]);`;
  });

  const payloadConst = `export const ${constPrefix}_PACKED_FRAMES = [\n${packedFrames
    .map((frame) => {
      const bitsName = `${constPrefix}_FRAME_${frame.index}_BITS`;
      return `  { index: ${frame.index}, width: ${frame.width}, height: ${frame.height}, timestampMs: ${frame.timestampMs}, durationMs: ${frame.durationMs}, bitLength: ${frame.bitLength}, bytes: ${bitsName} }`;
    })
    .join(",\n")}\n] as const;`;

  return [metadataConst, decodeHelper, ...constChunks, payloadConst]
    .filter(Boolean)
    .join("\n\n");
}

export class PixelMatrixExporter {
  static exportTimeline(
    timeline: MediaTimeline,
    options: PixelMatrixExportOptions = {},
  ): PixelMatrixExportResult {
    const mode: PixelMatrixMode = options.mode ?? "binary";
    const outputFormat: PixelMatrixOutputFormat =
      options.outputFormat ?? "matrix";
    const threshold = Math.max(0, Math.min(255, options.threshold ?? 128));
    const constPrefix = sanitizeConstToken(
      (options.constPrefix ?? timeline.id).toUpperCase(),
    );
    const includeMetadataConst = options.includeMetadataConst !== false;

    if (outputFormat !== "matrix" && mode === "grayscale") {
      throw new Error(
        "Bit-packed output supports only binary/alpha-mask modes. Use mode 'binary' or 'alpha-mask'.",
      );
    }

    const indexes = selectFrameIndexes(timeline.frames.length, options);
    const frames: PixelMatrixFrame[] = indexes.map((frameIndex) => {
      const frame = timeline.frames[frameIndex];
      return {
        index: frame.index,
        width: frame.width,
        height: frame.height,
        timestampMs: frame.timestampMs,
        durationMs: frame.durationMs,
        pixels: imageDataToMatrix(frame.imageData, mode, threshold),
      };
    });

    const matrixModule =
      outputFormat === "bit-packed"
        ? undefined
        : buildMatrixModule(
            constPrefix,
            timeline,
            mode,
            threshold,
            frames,
            includeMetadataConst,
          );

    const packedFrames =
      outputFormat === "matrix"
        ? undefined
        : frames.map((frame) => {
            const bits = packBits(flattenMatrix(frame.pixels));
            return {
              index: frame.index,
              width: frame.width,
              height: frame.height,
              timestampMs: frame.timestampMs,
              durationMs: frame.durationMs,
              bitLength: frame.width * frame.height,
              bytes: bits,
            } satisfies PixelMatrixPackedFrame;
          });

    const packedModule = packedFrames
      ? buildPackedModule(
          constPrefix,
          timeline,
          mode,
          threshold,
          packedFrames,
          includeMetadataConst,
        )
      : undefined;

    const constModule =
      outputFormat === "matrix"
        ? (matrixModule ?? "")
        : outputFormat === "bit-packed"
          ? (packedModule ?? "")
          : [matrixModule, packedModule].filter(Boolean).join("\n\n");

    return {
      format: outputFormat,
      constModule,
      frames,
      packedFrames,
      matrixModule,
      packedModule,
    };
  }
}
