import { GifFrame } from "./GifFrame";
import { GifImage } from "./GifImage";
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
export { read, readAppExt, readColTbl, readGraphicControlExt, readHeader, readImgData, readImgDataSize, readImgDescr, readLogicalScreenDescriptor, readTextExtension, };
//# sourceMappingURL=utils.d.ts.map