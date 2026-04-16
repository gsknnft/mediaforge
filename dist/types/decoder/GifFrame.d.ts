export declare class GifFrame {
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
//# sourceMappingURL=GifFrame.d.ts.map