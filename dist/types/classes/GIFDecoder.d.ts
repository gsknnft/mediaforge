declare class BitReader {
    private nextBitToRead;
    private numberOfBitsToRead;
    private bitMask;
    private bytes;
    constructor(bytes?: Uint8Array);
    init(bytes: Uint8Array): void;
    read(): number;
    setNumberOfBitsToRead(numberOfBitsToRead: number): void;
}
declare class CodeTable {
    table: number[][];
    private initTableSize;
    private initCodeSize;
    private initCodeLimit;
    private codeSize;
    nextCode: number;
    private nextCodeLimit;
    private bitReader;
    constructor(table?: CodeTable);
    add(indices: number[]): number;
    clear(): number;
    init(fr: GifFrame, activeColTbl: number[], br: BitReader): void;
}
declare class GifFrame {
    disposalMethod: number;
    transpColFlag: boolean;
    delay: number;
    transpColIndex: number;
    x: number;
    y: number;
    w: number;
    h: number;
    wh: number;
    hasLocColTbl: boolean;
    interlaceFlag: boolean;
    sortFlag: boolean;
    sizeOfLocColTbl: number;
    localColTbl: number[];
    firstCodeSize: number;
    clearCode: number;
    endOfInfoCode: number;
    data: Uint8Array;
    img: ImageData;
    constructor(gifFrame?: GifFrame);
    setDefaultValues(): void;
}
declare class GifImage {
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
declare function read(uintA: Uint8Array): GifImage;
declare function readAppExt(img: GifImage, uintA: Uint8Array, i: number): number;
declare function readColTbl(uintA: Uint8Array, colors: number[], i: number): number;
declare function readGraphicControlExt(fr: GifFrame, uintA: Uint8Array, i: number): number;
declare function readHeader(uintA: Uint8Array, img: GifImage): number;
declare function readImgData(fr: GifFrame, uintA: Uint8Array, i: number): number;
declare function readImgDataSize(uintA: Uint8Array, i: number): number;
declare function readImgDescr(fr: GifFrame, uintA: Uint8Array, i: number): number;
declare function readLogicalScreenDescriptor(img: GifImage, uintA: Uint8Array, i: number): number;
declare function readTextExtension(uintA: Uint8Array, i: number): number;
export type { BitReader as BitReaderType, CodeTable as CodeTableType, GifFrame as GifFrameType, GifImage as GifImageType, GifFrameData as GifFrameDataType };
interface GifFrameData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    delay: number;
    disposalMethod: number;
    transparencyIndex: number | null;
}
export { BitReader, CodeTable, GifImage, GifFrame, readAppExt, readColTbl, readGraphicControlExt, readHeader, readImgData, readImgDataSize, readImgDescr, readLogicalScreenDescriptor, readTextExtension, read, };
//# sourceMappingURL=GIFDecoder.d.ts.map