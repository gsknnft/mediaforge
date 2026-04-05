class BitReader {
    private nextBitToRead: number;
    private numberOfBitsToRead: number;
    private bitMask: number;
    private bytes: Uint8Array;

    constructor(bytes: Uint8Array = new Uint8Array(0)) {
        this.nextBitToRead = 0;
        this.numberOfBitsToRead = 0;
        this.bitMask = 0;
        this.bytes = bytes;
    }

    init(bytes: Uint8Array) {
        this.bytes = bytes;
        this.nextBitToRead = 0;
    }

    read(): number {
        let byteIndex = this.nextBitToRead >>> 3;
        const bitsToShiftRight = this.nextBitToRead & 7;
        const byte0 = this.bytes[byteIndex++] & 0xFF;
        const byte1 = this.bytes[byteIndex++] & 0xFF;
        const byte2 = this.bytes[byteIndex] & 0xFF;
        const buffer = ((byte2 << 8 | byte1) << 8 | byte0) >>> bitsToShiftRight;
        this.nextBitToRead += this.numberOfBitsToRead;
        return buffer & this.bitMask;
    }

    setNumberOfBitsToRead(numberOfBitsToRead: number) {
        this.numberOfBitsToRead = numberOfBitsToRead;
        this.bitMask = (1 << numberOfBitsToRead) - 1;
    }
}

type CodeTableType = typeof CodeTable;

class CodeTable {
    public table: number[][];
    private initTableSize: number;
    private initCodeSize: number;
    private initCodeLimit: number;
    private codeSize: number;
    public nextCode: number;
    private nextCodeLimit: number;
    private bitReader: BitReader;

    constructor(table?: CodeTable) {
        if (!table) {
            this.table = new Array(4096).fill(0).map(() => []);
            this.initTableSize = 0;
            this.initCodeSize = 0;
            this.initCodeLimit = 0;
            this.codeSize = 0;
            this.nextCode = 0;
            this.nextCodeLimit = 0;
            this.bitReader = new BitReader();
            return;
        }
        this.table = table.table;
        this.initTableSize = this.table.length;
        this.initCodeSize = table.initCodeSize!;
        this.initCodeLimit = table.initCodeLimit!;
        this.codeSize = table.codeSize!;
        this.nextCode = table.nextCode!;
        this.nextCodeLimit = table.nextCodeLimit!;
        this.bitReader = new BitReader();
    }

    add(indices: number[]): number {
        if (this.nextCode < 4096) {
            if (this.nextCode === this.nextCodeLimit && this.codeSize < 12) {
                this.codeSize++;
                this.bitReader.setNumberOfBitsToRead(this.codeSize);
                this.nextCodeLimit = (1 << this.codeSize) - 1;
            }
            this.table[this.nextCode++] = indices;
        }
        return this.codeSize;
    }

    clear(): number {
        this.codeSize = this.initCodeSize;
        this.bitReader.setNumberOfBitsToRead(this.codeSize);
        this.nextCodeLimit = this.initCodeLimit;
        this.nextCode = this.initTableSize;
        return this.codeSize;
    }

    init(fr: GifFrame, activeColTbl: number[], br: BitReader) {
        this.bitReader = br;
        const numColors = activeColTbl.length;
        this.initCodeSize = fr.firstCodeSize;
        this.initCodeLimit = (1 << this.initCodeSize) - 1;
        this.initTableSize = fr.endOfInfoCode + 1;
        this.nextCode = this.initTableSize;
        for (let c = numColors - 1; c >= 0; c--) {
            this.table[c][0] = activeColTbl[c];
        }
        this.table[fr.clearCode] = [fr.clearCode];
        this.table[fr.endOfInfoCode] = [fr.endOfInfoCode];
        if (fr.transpColFlag && fr.transpColIndex < numColors) {
            this.table[fr.transpColIndex][0] = 0;
        }
    }
}

class GifFrame {
    disposalMethod: number = 0;
    transpColFlag: boolean = false;
    delay: number = 0;
    transpColIndex: number = 0;
    x: number = 0;
    y: number = 0;
    w: number = 0;
    h: number = 0;
    wh: number = 0;
    hasLocColTbl: boolean = false;
    interlaceFlag: boolean = false;
    sortFlag: boolean = false;
    sizeOfLocColTbl: number = 0;
    localColTbl: number[] = [];
    firstCodeSize: number = 0;
    clearCode: number = 0;
    endOfInfoCode: number = 0;
    data: Uint8Array = new Uint8Array(0);
    img: ImageData = new ImageData(0, 0);

    constructor(gifFrame?: GifFrame) {
        if (!gifFrame) {
            this.setDefaultValues();
            return;
        }
        this.disposalMethod = gifFrame.disposalMethod!
        this.transpColFlag = gifFrame.transpColFlag!;
        this.delay = gifFrame.delay!;
        this.transpColIndex = gifFrame.transpColIndex!;
        this.x = gifFrame.x!;
        this.y = gifFrame.y!;
        this.w = gifFrame.w!;
        this.h = gifFrame.h!;
        this.wh = gifFrame.wh!;
        this.hasLocColTbl = gifFrame.hasLocColTbl!;
        this.interlaceFlag = gifFrame.interlaceFlag!;
        this.sortFlag = gifFrame.sortFlag!;
        this.sizeOfLocColTbl = gifFrame.sizeOfLocColTbl!;
        this.localColTbl = gifFrame.localColTbl!;
        this.firstCodeSize = gifFrame.firstCodeSize!;
        this.clearCode = gifFrame.clearCode!;
        this.endOfInfoCode = gifFrame.endOfInfoCode!;
        this.data = gifFrame.data || new Uint8Array(0);
        this.img = gifFrame.img || new ImageData(0, 0);
    }

    setDefaultValues() {
        this.disposalMethod = 0;
        this.transpColFlag = false;
        this.delay = 0;
        this.transpColIndex = 0;
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.wh = 0;
        this.hasLocColTbl = false;
        this.interlaceFlag = false;
        this.sortFlag = false;
        this.sizeOfLocColTbl = 0;
        this.localColTbl = [];
        this.firstCodeSize = 0;
        this.clearCode = 0;
        this.endOfInfoCode = 0;
        this.data = new Uint8Array(0);
        this.img = new ImageData(0, 0);
    }
}


class GifImage {
    header: string = "";
    w: number = 0;
    h: number = 0;
    wh: number = 0;
    hasGlobColTbl: boolean = false;
    colorResolution: number = 0;
    sortFlag: boolean = false;
    sizeOfGlobColTbl: number = 0;
    bgColIndex: number = 0;
    pxAspectRatio: number = 0;
    globalColTbl: number[] = [];
    frames: GifFrame[] = [];
    appId: string = "";
    appAuthCode: string = "";
    repetitions: number = 0;
    img: ImageData | null = null;
    bits: BitReader = new BitReader();
    codes: CodeTable = new CodeTable();
    g: CanvasRenderingContext2D = document.createElement('canvas').getContext('2d', { willReadFrequently: true}) as CanvasRenderingContext2D;

    constructor(gifImg?: GifImage) {
        if (!gifImg) {
            return;
        }
        Object.assign(this, gifImg);
        this.header = gifImg.header;
        this.w = gifImg.w;
        this.h = gifImg.h;
        this.wh = gifImg.wh;
        this.hasGlobColTbl = gifImg.hasGlobColTbl;
        this.colorResolution = gifImg.colorResolution;
        this.sortFlag = gifImg.sortFlag;
        this.sizeOfGlobColTbl = gifImg.sizeOfGlobColTbl;
        this.bgColIndex = gifImg.bgColIndex;
        this.pxAspectRatio = gifImg.pxAspectRatio;
        this.globalColTbl = gifImg.globalColTbl;
        this.g = document.createElement('canvas').getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;
    }

    processCode1(code: number, out: number[], outPos: number): number {
        const tbl = this.codes.table;
        if (code < this.codes.nextCode) {
            const pixels = tbl[code];
            pixels.forEach((pixel, index) => out[outPos + index] = pixel);
            return pixels.length;
        } else {
            throw new Error(`Invalid code encountered: ${code}`);
        }
    }

    processCode(code: number, clearCode: number, endCode: number, tbl: number[][], out: number[], outPos: number): { pixels: number[]; outPos: number } {
        if (code === clearCode) {
            this.codes.clear();
            return { pixels: [], outPos };
        } else if (code === endCode) {
            throw new Error("End of GIF decoding");
        }

        let pixels: number[];
        const prevCode = this.bits.read();
        const prevVals = tbl[prevCode];
        const prevValsAndK = [...prevVals, 0];

        if (code < this.codes.nextCode) {
            pixels = tbl[code];
            prevValsAndK[prevVals.length] = pixels[0];
        } else {
            prevValsAndK[prevVals.length] = prevVals[0];
            pixels = prevValsAndK;
        }

        // Add the new sequence to the code table
        this.codes.add(prevValsAndK);

        // Write decoded pixels to output
        pixels.forEach((pixel, index) => {
            out[outPos + index] = pixel;
        });

        return { pixels, outPos: outPos + pixels.length };
    }

    decode(fr: GifFrame, activeColTbl: number[]): number[] {
        this.codes.init(fr, activeColTbl, this.bits);
        this.bits.init(fr.data);
        const clearCode = fr.clearCode, endCode = fr.endOfInfoCode;
        const out = new Array(this.wh).fill(0);
        const tbl = this.codes.table;
        let outPos = 0;
        this.codes.clear();
        this.bits.read();
        let code = this.bits.read();
        let pixels = tbl[code];
        pixels.forEach((pixel, index) => out[outPos + index] = pixel);
        outPos += pixels.length;
        try {
            while (true) {
                const prevCode = code;
                code = this.bits.read();
                if (code === clearCode) {
                    this.codes.clear();
                    code = this.bits.read();
                    pixels = tbl[code];
                    pixels.forEach((pixel, index) => out[outPos + index] = pixel);
                    outPos += pixels.length;
                    continue;
                } else if (code === endCode) {
                    break;
                }
                const prevVals = tbl[prevCode];
                const prevValsAndK = [...prevVals, 0];
                if (code < this.codes.nextCode) {
                    pixels = tbl[code];
                    pixels.forEach((pixel, index) => out[outPos + index] = pixel);
                    outPos += pixels.length;
                    prevValsAndK[prevVals.length] = tbl[code][0];
                } else {
                    prevValsAndK[prevVals.length] = prevVals[0];
                    prevValsAndK.forEach((pixel, index) => out[outPos + index] = pixel);
                    outPos += prevValsAndK.length;
                }
                this.codes.add(prevValsAndK);
            }
        } catch (ignored) {}
        return out;
    }  

    deinterlace(src: number[], fr: GifFrame): number[] {
        const w = fr.w, h = fr.h, wh = fr.wh;
        const dest = new Array(src.length).fill(0);
        const set2Y = (h + 7) >>> 3;
        const set3Y = set2Y + ((h + 3) >>> 3);
        const set4Y = set3Y + ((h + 1) >>> 2);
        const set2 = w * set2Y, set3 = w * set3Y, set4 = w * set4Y;
        const w2 = w << 1, w4 = w2 << 1, w8 = w4 << 1;
        let from = 0, to = 0;
        for (; from < set2; from += w, to += w8) {
            src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
        }
        for (to = w4; from < set3; from += w, to += w8) {
            src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
        }
        for (to = w2; from < set4; from += w, to += w4) {
            src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
        }
        for (to = w; from < wh; from += w, to += w2) {
            src.slice(from, from + w).forEach((pixel, index) => dest[to + index] = pixel);
        }
        return dest;
    }

    drawFrame(fr: GifFrame) {
        const activeColTbl = fr.hasLocColTbl ? fr.localColTbl : this.globalColTbl;
        let pixels = this.decode(fr, activeColTbl);
        if (fr.interlaceFlag) {
            pixels = this.deinterlace(pixels, fr);
        }
        const frame = new ImageData(new Uint8ClampedArray(pixels), fr.w, fr.h);
        this.g.putImageData(frame, fr.x, fr.y);
        const prevPx = new Array(this.wh).fill(0);
        if (this.img) {
            this.img.data.forEach((pixel, index) => prevPx[index] = pixel);
        }
        fr.img = new ImageData(new Uint8ClampedArray(prevPx), this.w, this.h);
        if (fr.disposalMethod === 2) {
            this.g.clearRect(fr.x, fr.y, fr.w, fr.h);
        } else if (fr.disposalMethod === 3) {
            if (this.img) {
                if (this.img) {
                    prevPx.forEach((pixel, index) => this.img!.data[index] = pixel);
                }
            }
        }
    }

    getBackgroundColor(): number {
        const frame = this.frames[0];
        if (frame.hasLocColTbl) {
            return frame.localColTbl[this.bgColIndex];
        } else if (this.hasGlobColTbl) {
            return this.globalColTbl[this.bgColIndex];
        }
        return 0;
    }

    getDelay(index: number): number {
        return this.frames[index].delay;
    }

    getFrame(index: number): ImageData {
        if (this.img === null) {
            this.img = new ImageData(this.w, this.h);
            const canvas = document.createElement('canvas');
            canvas.width = this.w;
            canvas.height = this.h;
            const context = canvas.getContext('2d');
            if (!context) {
                throw new Error("Failed to get 2D context");
            }
            this.g = context;
            this.g.fillStyle = 'rgba(0,0,0,0)';
        }
        let fr = this.frames[index];
        if (fr.img === null) {
            for (let i = 0; i <= index; i++) {
                fr = this.frames[i];
                if (fr.img === null) {
                    this.drawFrame(fr);
                }
            }
        }
        return fr.img;
    }
    
    getFrames(): ImageData[] {
        const frames: ImageData[] = [];
        for (let i = 0; i < this.frames.length; i++) {
            frames.push(this.getFrame(i));
        }
        return frames;
    }

    getFrameCount(): number {
        return this.frames.length;
    }

    getHeight(): number {
        return this.h;
    }

    getWidth(): number {
        return this.w;
    }

    getFrameData(index: number): GifFrameData {
        const frame = this.frames[index];
        const imageData = this.getFrame(index);
        
        return {
            width: frame.w,
            height: frame.h,
            data: imageData.data,
            delay: frame.delay,
            disposalMethod: frame.disposalMethod,
            transparencyIndex: frame.transpColFlag ? frame.transpColIndex : null
        };
    }
    
    getAllFramesData(): GifFrameData[] {
        return this.frames.map((_, index) => this.getFrameData(index));
    }
}

const DEBUG_MODE = false;

function read(uintA: Uint8Array): GifImage {
    const img = new GifImage();
    let frame: GifFrame | null = null;
    let pos = readHeader(uintA, img);
    pos = readLogicalScreenDescriptor(img, uintA, pos);
    if (img.hasGlobColTbl) {
        img.globalColTbl = new Array(img.sizeOfGlobColTbl).fill(0);
        pos = readColTbl(uintA, img.globalColTbl, pos);
    }
    while (pos < uintA.length) {
        const block = uintA[pos] & 0xFF;
        switch (block) {
            case 0x21:
                if (pos + 1 >= uintA.length) {
                    throw new Error("Unexpected end of file.");
                }
                switch (uintA[pos + 1] & 0xFF) {
                    case 0xFE:
                        pos = readTextExtension(uintA, pos);
                        break;
                    case 0xFF:
                        pos = readAppExt(img, uintA, pos);
                        break;
                    case 0x01:
                        frame = null;
                        pos = readTextExtension(uintA, pos);
                        break;
                    case 0xF9:
                        if (frame === null) {
                            frame = new GifFrame();
                            img.frames.push(frame);
                        }
                        pos = readGraphicControlExt(frame, uintA, pos);
                        break;
                    default:
                        throw new Error("Unknown extension at " + pos);
                }
                break;
            case 0x2C:
                if (frame === null) {
                    frame = new GifFrame();
                    img.frames.push(frame);
                }
                pos = readImgDescr(frame, uintA, pos);
                if (frame.hasLocColTbl) {
                    frame.localColTbl = new Array(frame.sizeOfLocColTbl).fill(0);
                    pos = readColTbl(uintA, frame.localColTbl, pos);
                }
                pos = readImgData(frame, uintA, pos);
                frame = null;
                break;
            case 0x3B:
                return img;
            default:
                const progress = 1.0 * pos / uintA.length;
                if (progress < 0.9) {
                    throw new Error("Unknown block at: " + pos);
                }
                pos = uintA.length;
        }
    }
    return img;
}

function readAppExt(img: GifImage, uintA: Uint8Array, i: number): number {
    img.appId = String.fromCharCode(...Array.from(uintA.slice(i + 3, i + 11)));
    img.appAuthCode = String.fromCharCode(...Array.from(uintA.slice(i + 11, i + 14)));
    i += 14;
    const subBlockSize = uintA[i] & 0xFF;
    if (subBlockSize === 3) {
        img.repetitions = uintA[i + 2] & 0xFF | (uintA[i + 3] & 0xFF) << 8;
        return i + 5;
    }
    while ((uintA[i] & 0xFF) !== 0) {
        i += (uintA[i] & 0xFF) + 1;
    }
    return i + 1;
}

function readColTbl(uintA: Uint8Array, colors: number[], i: number): number {
    const numColors = colors.length;
    for (let c = 0; c < numColors; c++) {
        const a = 0xFF;
        const r = uintA[i++] & 0xFF;
        const g = uintA[i++] & 0xFF;
        const b = uintA[i++] & 0xFF;
        colors[c] = ((a << 8 | r) << 8 | g) << 8 | b;
    }
    return i;
}

function readGraphicControlExt(fr: GifFrame, uintA: Uint8Array, i: number): number {
    fr.disposalMethod = (uintA[i + 3] & 0b00011100) >>> 2;
    fr.transpColFlag = (uintA[i + 3] & 1) === 1;
    fr.delay = uintA[i + 4] & 0xFF | (uintA[i + 5] & 0xFF) << 8;
    fr.transpColIndex = uintA[i + 6] & 0xFF;
    return i + 8;
}

function readHeader(uintA: Uint8Array, img: GifImage): number {
    if (uintA.length < 6) {
        throw new Error("Image is truncated.");
    }
    img.header = String.fromCharCode(...Array.from(uintA.slice(0, 6)));
    if (img.header !== "GIF87a" && img.header !== "GIF89a") {
        throw new Error("Invalid GIF header.");
    }
    return 6;
}

function readImgData(fr: GifFrame, uintA: Uint8Array, i: number): number {
    const fileSize = uintA.length;
    const minCodeSize = uintA[i++] & 0xFF;
    const clearCode = 1 << minCodeSize;
    fr.firstCodeSize = minCodeSize + 1;
    fr.clearCode = clearCode;
    fr.endOfInfoCode = clearCode + 1;
    const imgDataSize = readImgDataSize(uintA, i);
    const imgData = new Uint8Array(imgDataSize + 2);
    let imgDataPos = 0;
    let subBlockSize = uintA[i] & 0xFF;
    while (subBlockSize > 0) {
        try {
            const nextSubBlockSizePos = i + subBlockSize + 1;
            const nextSubBlockSize = uintA[nextSubBlockSizePos] & 0xFF;
            imgData.set(uintA.slice(i + 1, i + 1 + subBlockSize), imgDataPos);
            imgDataPos += subBlockSize;
            i = nextSubBlockSizePos;
            subBlockSize = nextSubBlockSize;
        } catch (e) {
            subBlockSize = fileSize - i - 1;
            imgData.set(uintA.slice(i + 1, i + 1 + subBlockSize), imgDataPos);
            imgDataPos += subBlockSize;
            i += subBlockSize + 1;
            break;
        }
    }
    fr.data = imgData;
    i++;
    return i;
}

function readImgDataSize(uintA: Uint8Array, i: number): number {
    const fileSize = uintA.length;
    let imgDataPos = 0;
    let subBlockSize = uintA[i] & 0xFF;
    while (subBlockSize > 0) {
        try {
            const nextSubBlockSizePos = i + subBlockSize + 1;
            const nextSubBlockSize = uintA[nextSubBlockSizePos] & 0xFF;
            imgDataPos += subBlockSize;
            i = nextSubBlockSizePos;
            subBlockSize = nextSubBlockSize;
        } catch (e) {
            subBlockSize = fileSize - i - 1;
            imgDataPos += subBlockSize;
            break;
        }
    }
    return imgDataPos;
}

function readImgDescr(fr: GifFrame, uintA: Uint8Array, i: number): number {
    fr.x = uintA[++i] & 0xFF | (uintA[++i] & 0xFF) << 8;
    fr.y = uintA[++i] & 0xFF | (uintA[++i] & 0xFF) << 8;
    fr.w = uintA[++i] & 0xFF | (uintA[++i] & 0xFF) << 8;
    fr.h = uintA[++i] & 0xFF | (uintA[++i] & 0xFF) << 8;
    fr.wh = fr.w * fr.h;
    const b = uintA[++i];
    fr.hasLocColTbl = (b & 0b10000000) >>> 7 === 1;
    fr.interlaceFlag = (b & 0b01000000) >>> 6 === 1;
    fr.sortFlag = (b & 0b00100000) >>> 5 === 1;
    const colTblSizePower = (b & 7) + 1;
    fr.sizeOfLocColTbl = 1 << colTblSizePower;
    return i + 1;
}

function readLogicalScreenDescriptor(img: GifImage, uintA: Uint8Array, i: number): number {
    img.w = uintA[i++] & 0xFF | (uintA[i++] & 0xFF) << 8;
    img.h = uintA[i++] & 0xFF | (uintA[i++] & 0xFF) << 8;
    img.wh = img.w * img.h;
    const b = uintA[i++];
    img.hasGlobColTbl = (b & 0b10000000) >>> 7 === 1;
    img.colorResolution = (b & 0b01110000) >>> 4;
    img.sortFlag = (b & 0b00001000) >>> 3 === 1;
    const colTblSizePower = (b & 7) + 1;
    img.sizeOfGlobColTbl = 1 << colTblSizePower;
    img.bgColIndex = uintA[i++] & 0xFF;
    img.pxAspectRatio = uintA[i++] & 0xFF;
    return i;
}

function readTextExtension(uintA: Uint8Array, i: number): number {
    while ((uintA[i] & 0xFF) !== 0) {
        i += (uintA[i] & 0xFF) + 1;
    }
    return i + 1;
}

export type {
    BitReader as BitReaderType,
    CodeTable as CodeTableType,
    GifFrame as GifFrameType,
    GifImage as GifImageType,
    GifFrameData as GifFrameDataType
};

interface GifFrameData {
    width: number;
    height: number;
    data: Uint8ClampedArray;
    delay: number;
    disposalMethod: number;
    transparencyIndex: number | null;
}

export {
    BitReader,
    CodeTable,
    GifImage,
    GifFrame,
    readAppExt,
    readColTbl,
    readGraphicControlExt,
    readHeader,
    readImgData,
    readImgDataSize,
    readImgDescr,
    readLogicalScreenDescriptor,
    readTextExtension,
    read,
};

