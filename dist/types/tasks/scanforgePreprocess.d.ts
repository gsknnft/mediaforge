import type { RuntimeTaskRegistry } from "../runtime";
export declare const SCANFORGE_PREPROCESS_TASKS: {
    readonly MATRIX_SPLIT: "scanforge.matrix.split";
    readonly IMAGE_ALIGN: "scanforge.image.align";
    readonly PREVIEW_GENERATE: "scanforge.preview.generate";
};
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
    subjectBox: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
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
    subjectBoxes: Array<{
        x: number;
        y: number;
        width: number;
        height: number;
    }>;
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
export declare function splitMatrix(input: MatrixSplitTaskInput): MatrixSplitTaskResult;
export declare function alignImage(input: ImageAlignTaskInput): ImageAlignTaskResult;
export declare function alignImageSet(input: ImageAlignSetTaskInput): ImageAlignSetTaskResult;
export declare function generatePreview(input: PreviewGenerateTaskInput): PreviewGenerateTaskResult;
export declare function registerScanForgePreprocessTasks(registry: RuntimeTaskRegistry): void;
//# sourceMappingURL=scanforgePreprocess.d.ts.map