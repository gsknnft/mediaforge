import { BitReader } from "./BitReader";
import { CodeTable } from "./CodeTable";
import { GifFrame } from "./GifFrame";
import { GifFrameData } from "../types";
export declare class GifImage {
    header: string;
    w: number;
    h: number;
    wh: number;
    hasGlobColTbl: boolean;
    colorResolution: number;
    sortFlag: boolean;
    sizeOfGlobColTbl: number;
    bgColIndex: number;
    pxAspectRatio: number;
    globalColTbl: number[];
    frames: GifFrame[];
    appId: string;
    appAuthCode: string;
    repetitions: number;
    img: ImageData | null;
    bits: BitReader;
    codes: CodeTable;
    g: CanvasRenderingContext2D;
    constructor(gifImg?: GifImage);
    processCode1(code: number, out: number[], outPos: number): number;
    processCode(code: number, clearCode: number, endCode: number, tbl: number[][], out: number[], outPos: number): {
        pixels: number[];
        outPos: number;
    };
    decode(fr: GifFrame, activeColTbl: number[]): number[];
    deinterlace(src: number[], fr: GifFrame): number[];
    drawFrame(fr: GifFrame): void;
    getBackgroundColor(): number;
    getDelay(index: number): number;
    getFrame(index: number): ImageData;
    getFrames(): ImageData[];
    getFrameCount(): number;
    getHeight(): number;
    getWidth(): number;
    getFrameData(index: number): GifFrameData;
    getAllFramesData(): GifFrameData[];
}
export type { BitReader as BitReaderType, CodeTable as CodeTableType, GifFrame as GifFrameType, GifImage as GifImageType, GifFrameData as GifFrameDataType };
export { BitReader, CodeTable };
//# sourceMappingURL=GifImage.d.ts.map