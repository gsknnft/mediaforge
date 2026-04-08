import { BitReader } from "./BitReader";
import { CodeTable } from "./CodeTable";
import { GifFrame } from "./GifFrame";
import { GifFrameData } from "../types";

export class GifImage {
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




export type {
    BitReader as BitReaderType,
    CodeTable as CodeTableType,
    GifFrame as GifFrameType,
    GifImage as GifImageType,
    GifFrameData as GifFrameDataType
};


export {
    BitReader,
    CodeTable
};
