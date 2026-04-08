import type { RuntimeTaskRegistry } from "../runtime";

export const SCANFORGE_PREPROCESS_TASKS = {
  MATRIX_SPLIT: "scanforge.matrix.split",
  IMAGE_ALIGN: "scanforge.image.align",
  PREVIEW_GENERATE: "scanforge.preview.generate",
} as const;

export interface SerializableImageData {
  width: number;
  height: number;
  data: Uint8ClampedArray;
  label?: string;
}

export interface MatrixSplitTaskInput {
  image: SerializableImageData;
  rows: number;
  cols: number;
  gapX?: number;
  gapY?: number;
  marginX?: number;
  marginY?: number;
  cellWidth?: number;
  cellHeight?: number;
}

export interface MatrixSplitCell {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  image: SerializableImageData;
}

export interface MatrixSplitTaskResult {
  task: typeof SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT;
  rows: number;
  cols: number;
  cellWidth: number;
  cellHeight: number;
  cells: MatrixSplitCell[];
}

export interface ImageAlignTaskInput {
  image: SerializableImageData;
  targetWidth: number;
  targetHeight: number;
  fillColor?: [number, number, number, number];
  alphaThreshold?: number;
  colorKey?: [number, number, number];
  colorTolerance?: number;
  padding?: number;
  trimPx?: number;
  anchorX?: number;
  anchorY?: number;
  coverage?: number;
  subjectScale?: number;
}

export interface ImageAlignTaskResult {
  task: typeof SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN;
  image: SerializableImageData;
  subjectBox: { x: number; y: number; width: number; height: number };
  offsetX: number;
  offsetY: number;
  scale: number;
  drawWidth: number;
  drawHeight: number;
}

export interface ImageAlignSetTaskInput {
  images: SerializableImageData[];
  targetWidth: number;
  targetHeight: number;
  fillColor?: [number, number, number, number];
  alphaThreshold?: number;
  colorKey?: [number, number, number];
  colorTolerance?: number;
  padding?: number;
  trimPx?: number;
  anchorX?: number;
  anchorY?: number;
  coverage?: number;
  subjectScale?: number;
}

export interface ImageAlignSetTaskResult {
  images: SerializableImageData[];
  subjectBoxes: Array<{ x: number; y: number; width: number; height: number }>;
  placements: Array<{
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
    scale: number;
  }>;
  sharedScale: number;
}

export interface PreviewGenerateTaskInput {
  images: SerializableImageData[];
  columns?: number;
  cellWidth?: number;
  cellHeight?: number;
  padding?: number;
  fillColor?: [number, number, number, number];
}

export interface PreviewGenerateTaskResult {
  task: typeof SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE;
  image: SerializableImageData;
  placements: Array<{
    index: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  columns: number;
  rows: number;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function clampNumber(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function clamp01(value: number): number {
  return clampNumber(value, 0, 1);
}

function pixelOffset(width: number, x: number, y: number): number {
  return (y * width + x) * 4;
}

function createImage(
  width: number,
  height: number,
  fillColor: [number, number, number, number] = [0, 0, 0, 0],
  label?: string,
): SerializableImageData {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 0; index < data.length; index += 4) {
    data[index] = fillColor[0];
    data[index + 1] = fillColor[1];
    data[index + 2] = fillColor[2];
    data[index + 3] = fillColor[3];
  }

  return { width, height, data, label };
}

function cropImage(
  image: SerializableImageData,
  x: number,
  y: number,
  width: number,
  height: number,
  label?: string,
): SerializableImageData {
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

function isBackgroundPixel(
  image: SerializableImageData,
  x: number,
  y: number,
  alphaThreshold: number,
  colorKey?: [number, number, number],
  colorTolerance = 24,
): boolean {
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

function detectSubjectBounds(
  image: SerializableImageData,
  alphaThreshold: number,
  colorKey?: [number, number, number],
  colorTolerance?: number,
): { x: number; y: number; width: number; height: number } {
  let minX = image.width;
  let minY = image.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < image.height; y += 1) {
    for (let x = 0; x < image.width; x += 1) {
      if (
        isBackgroundPixel(image, x, y, alphaThreshold, colorKey, colorTolerance)
      ) {
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
    height: maxY - minY + 1,
  };
}

function trimSubjectBounds(
  subjectBox: { x: number; y: number; width: number; height: number },
  trimPx = 0,
): { x: number; y: number; width: number; height: number } {
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
    height: Math.max(1, subjectBox.height - safeTrimY * 2),
  };
}

function computeAlignPlacement(args: {
  subjectWidth: number;
  subjectHeight: number;
  targetWidth: number;
  targetHeight: number;
  padding?: number;
  anchorX?: number;
  anchorY?: number;
  coverage?: number;
  subjectScale?: number;
  scaleOverride?: number;
}) {
  const safePadding = Math.max(0, args.padding ?? 0);
  const safeAnchorX = clamp01(args.anchorX ?? 0.5);
  const safeAnchorY = clamp01(args.anchorY ?? 0.5);
  const fitCoverage = clamp01(args.coverage ?? 0.92);
  const subjectScale = Math.max(0.01, args.subjectScale ?? 1);
  const availableWidth = Math.max(1, args.targetWidth - safePadding * 2);
  const availableHeight = Math.max(1, args.targetHeight - safePadding * 2);
  const maxFitScale = Math.min(
    availableWidth / Math.max(1, args.subjectWidth),
    availableHeight / Math.max(1, args.subjectHeight),
  );
  const scale =
    args.scaleOverride ??
    maxFitScale * clampNumber(fitCoverage * subjectScale, 0.01, 1);
  const drawWidth = Math.max(1, Math.floor(args.subjectWidth * scale));
  const drawHeight = Math.max(1, Math.floor(args.subjectHeight * scale));
  const minOffsetX = safePadding;
  const minOffsetY = safePadding;
  const maxOffsetX = Math.max(
    safePadding,
    args.targetWidth - safePadding - drawWidth,
  );
  const maxOffsetY = Math.max(
    safePadding,
    args.targetHeight - safePadding - drawHeight,
  );
  const offsetX = Math.round(
    clampNumber(
      safeAnchorX * args.targetWidth - drawWidth / 2,
      minOffsetX,
      maxOffsetX,
    ),
  );
  const offsetY = Math.round(
    clampNumber(
      safeAnchorY * args.targetHeight - drawHeight / 2,
      minOffsetY,
      maxOffsetY,
    ),
  );

  return {
    offsetX,
    offsetY,
    drawWidth,
    drawHeight,
    scale,
  };
}

function alignImageToPlacement(args: {
  image: SerializableImageData;
  subjectBox: { x: number; y: number; width: number; height: number };
  targetWidth: number;
  targetHeight: number;
  fillColor?: [number, number, number, number];
  placement: {
    offsetX: number;
    offsetY: number;
    drawWidth: number;
    drawHeight: number;
    scale: number;
  };
}) {
  const cropped = cropImage(
    args.image,
    args.subjectBox.x,
    args.subjectBox.y,
    args.subjectBox.width,
    args.subjectBox.height,
    args.image.label,
  );

  const target = createImage(
    args.targetWidth,
    args.targetHeight,
    args.fillColor ?? [0, 0, 0, 0],
    args.image.label,
  );

  drawScaledImage(
    cropped,
    target,
    args.placement.offsetX,
    args.placement.offsetY,
    args.placement.drawWidth,
    args.placement.drawHeight,
  );

  return target;
}

function drawScaledImage(
  source: SerializableImageData,
  target: SerializableImageData,
  destinationX: number,
  destinationY: number,
  destinationWidth: number,
  destinationHeight: number,
): void {
  for (let y = 0; y < destinationHeight; y += 1) {
    for (let x = 0; x < destinationWidth; x += 1) {
      const sourceX = Math.min(
        source.width - 1,
        Math.max(0, Math.floor((x / destinationWidth) * source.width)),
      );
      const sourceY = Math.min(
        source.height - 1,
        Math.max(0, Math.floor((y / destinationHeight) * source.height)),
      );

      const sourceOffset = pixelOffset(source.width, sourceX, sourceY);
      const targetOffset = pixelOffset(
        target.width,
        destinationX + x,
        destinationY + y,
      );

      target.data[targetOffset] = source.data[sourceOffset];
      target.data[targetOffset + 1] = source.data[sourceOffset + 1];
      target.data[targetOffset + 2] = source.data[sourceOffset + 2];
      target.data[targetOffset + 3] = source.data[sourceOffset + 3];
    }
  }
}

export function splitMatrix(
  input: MatrixSplitTaskInput,
): MatrixSplitTaskResult {
  const gapX = input.gapX ?? 0;
  const gapY = input.gapY ?? 0;
  const marginX = input.marginX ?? 0;
  const marginY = input.marginY ?? 0;
  const cellWidth =
    input.cellWidth ??
    Math.floor(
      (input.image.width - marginX * 2 - gapX * (input.cols - 1)) / input.cols,
    );
  const cellHeight =
    input.cellHeight ??
    Math.floor(
      (input.image.height - marginY * 2 - gapY * (input.rows - 1)) / input.rows,
    );

  const cells: MatrixSplitCell[] = [];
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
          `r${row}c${col}`,
        ),
      });
    }
  }

  return {
    task: SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT,
    rows: input.rows,
    cols: input.cols,
    cellWidth,
    cellHeight,
    cells,
  };
}

export function alignImage(input: ImageAlignTaskInput): ImageAlignTaskResult {
  const alphaThreshold = input.alphaThreshold ?? 8;
  const subjectBox = trimSubjectBounds(
    detectSubjectBounds(
      input.image,
      alphaThreshold,
      input.colorKey,
      input.colorTolerance,
    ),
    input.trimPx ?? 0,
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
    subjectScale: input.subjectScale,
  });

  const target = alignImageToPlacement({
    image: input.image,
    subjectBox,
    targetWidth: input.targetWidth,
    targetHeight: input.targetHeight,
    fillColor: input.fillColor,
    placement,
  });

  return {
    task: SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN,
    image: target,
    subjectBox,
    offsetX: placement.offsetX,
    offsetY: placement.offsetY,
    scale: placement.scale,
    drawWidth: placement.drawWidth,
    drawHeight: placement.drawHeight,
  };
}

export function alignImageSet(
  input: ImageAlignSetTaskInput,
): ImageAlignSetTaskResult {
  if (input.images.length === 0) {
    return {
      images: [],
      subjectBoxes: [],
      placements: [],
      sharedScale: 1,
    };
  }

  const alphaThreshold = input.alphaThreshold ?? 8;
  const subjectBoxes = input.images.map((image) =>
    trimSubjectBounds(
      detectSubjectBounds(
        image,
        alphaThreshold,
        input.colorKey,
        input.colorTolerance,
      ),
      input.trimPx ?? 0,
    ),
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
    subjectScale: input.subjectScale,
  });

  const placements = subjectBoxes.map((subjectBox) =>
    computeAlignPlacement({
      subjectWidth: subjectBox.width,
      subjectHeight: subjectBox.height,
      targetWidth: input.targetWidth,
      targetHeight: input.targetHeight,
      padding: input.padding,
      anchorX: input.anchorX,
      anchorY: input.anchorY,
      scaleOverride: sharedPlacement.scale,
    }),
  );

  const images = input.images.map((image, index) =>
    alignImageToPlacement({
      image,
      subjectBox: subjectBoxes[index],
      targetWidth: input.targetWidth,
      targetHeight: input.targetHeight,
      fillColor: input.fillColor,
      placement: placements[index],
    }),
  );

  return {
    images,
    subjectBoxes,
    placements,
    sharedScale: sharedPlacement.scale,
  };
}

export function generatePreview(
  input: PreviewGenerateTaskInput,
): PreviewGenerateTaskResult {
  if (input.images.length === 0) {
    throw new Error("preview.generate requires at least one image");
  }

  const padding = input.padding ?? 8;
  const cellWidth =
    input.cellWidth ?? Math.max(...input.images.map((image) => image.width));
  const cellHeight =
    input.cellHeight ?? Math.max(...input.images.map((image) => image.height));
  const columns =
    input.columns ?? Math.max(1, Math.ceil(Math.sqrt(input.images.length)));
  const rows = Math.ceil(input.images.length / columns);

  const preview = createImage(
    columns * cellWidth + (columns + 1) * padding,
    rows * cellHeight + (rows + 1) * padding,
    input.fillColor ?? [18, 20, 24, 255],
    "scanforge-preview",
  );

  const placements = input.images.map((image, index) => {
    const column = index % columns;
    const row = Math.floor(index / columns);
    const scale = Math.min(cellWidth / image.width, cellHeight / image.height);
    const width = Math.max(1, Math.floor(image.width * scale));
    const height = Math.max(1, Math.floor(image.height * scale));
    const x =
      padding +
      column * (cellWidth + padding) +
      Math.floor((cellWidth - width) / 2);
    const y =
      padding +
      row * (cellHeight + padding) +
      Math.floor((cellHeight - height) / 2);

    drawScaledImage(image, preview, x, y, width, height);

    return { index, x, y, width, height };
  });

  return {
    task: SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE,
    image: preview,
    placements,
    columns,
    rows,
  };
}

export function registerScanForgePreprocessTasks(
  registry: RuntimeTaskRegistry,
): void {
  registry.register(SCANFORGE_PREPROCESS_TASKS.MATRIX_SPLIT, splitMatrix);
  registry.register(SCANFORGE_PREPROCESS_TASKS.IMAGE_ALIGN, alignImage);
  registry.register(
    SCANFORGE_PREPROCESS_TASKS.PREVIEW_GENERATE,
    generatePreview,
  );
}
