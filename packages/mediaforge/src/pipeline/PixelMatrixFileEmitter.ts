import { PixelMatrixExporter } from "./PixelMatrixExporter";
import type {
  MediaTimeline,
  PixelMatrixEmittedFile,
  PixelMatrixExportOptions,
  PixelMatrixFileEmitterOptions,
} from "./types";

function sanitizeFileToken(value: string): string {
  const replaced = value.replace(/[^a-zA-Z0-9_-]/g, "_");
  return replaced || "pixel_matrix";
}

function ensureTsExtension(fileName: string): string {
  return fileName.endsWith(".ts") ? fileName : `${fileName}.ts`;
}

export class PixelMatrixFileEmitter {
  static emitModules(
    timeline: MediaTimeline,
    pixelOptions: PixelMatrixExportOptions = {},
    options: PixelMatrixFileEmitterOptions = {},
  ): PixelMatrixEmittedFile[] {
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
          frameCount: result.frames.length,
        },
      ];
    }

    const files: PixelMatrixEmittedFile[] = [];
    const exportLines: string[] = [];

    for (const clip of timeline.clips) {
      const frameIndexes: number[] = [];
      for (let i = clip.startFrame; i <= clip.endFrame; i += 1) {
        if (i >= 0 && i < timeline.frames.length) frameIndexes.push(i);
      }
      if (!frameIndexes.length) continue;

      const result = PixelMatrixExporter.exportTimeline(timeline, {
        ...pixelOptions,
        frameIndexes,
      });

      const safeClip = sanitizeFileToken(clip.name.toLowerCase());
      const fileStem = `${base}.${safeClip}.pixels`;
      const fileName = ensureTsExtension(fileStem);
      files.push({
        fileName,
        content: result.constModule,
        format: result.format,
        clipName: clip.name,
        frameCount: result.frames.length,
      });

      exportLines.push(`export * from "./${fileStem}";`);
    }

    if (includeIndexFile && exportLines.length > 0) {
      files.push({
        fileName: ensureTsExtension(`${base}.pixels.index`),
        content: exportLines.join("\n"),
        format: "matrix",
        frameCount: 0,
      });
    }

    return files;
  }
}
