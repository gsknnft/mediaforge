import { GifFrame } from "./GifFrame";
import { GifImage } from "./GifImage";

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
    const block = uintA[pos] & 0xff;
    switch (block) {
      case 0x21:
        if (pos + 1 >= uintA.length) {
          throw new Error("Unexpected end of file.");
        }
        switch (uintA[pos + 1] & 0xff) {
          case 0xfe:
            pos = readTextExtension(uintA, pos);
            break;
          case 0xff:
            pos = readAppExt(img, uintA, pos);
            break;
          case 0x01:
            frame = null;
            pos = readTextExtension(uintA, pos);
            break;
          case 0xf9:
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
      case 0x2c:
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
      case 0x3b:
        return img;
      default:
        const progress = (1.0 * pos) / uintA.length;
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
  img.appAuthCode = String.fromCharCode(
    ...Array.from(uintA.slice(i + 11, i + 14)),
  );
  i += 14;
  const subBlockSize = uintA[i] & 0xff;
  if (subBlockSize === 3) {
    img.repetitions = (uintA[i + 2] & 0xff) | ((uintA[i + 3] & 0xff) << 8);
    return i + 5;
  }
  while ((uintA[i] & 0xff) !== 0) {
    i += (uintA[i] & 0xff) + 1;
  }
  return i + 1;
}

function readColTbl(uintA: Uint8Array, colors: number[], i: number): number {
  const numColors = colors.length;
  for (let c = 0; c < numColors; c++) {
    const a = 0xff;
    const r = uintA[i++] & 0xff;
    const g = uintA[i++] & 0xff;
    const b = uintA[i++] & 0xff;
    colors[c] = (((((a << 8) | r) << 8) | g) << 8) | b;
  }
  return i;
}

function readGraphicControlExt(
  fr: GifFrame,
  uintA: Uint8Array,
  i: number,
): number {
  fr.disposalMethod = (uintA[i + 3] & 0b00011100) >>> 2;
  fr.transpColFlag = (uintA[i + 3] & 1) === 1;
  fr.delay = (uintA[i + 4] & 0xff) | ((uintA[i + 5] & 0xff) << 8);
  fr.transpColIndex = uintA[i + 6] & 0xff;
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
  const minCodeSize = uintA[i++] & 0xff;
  const clearCode = 1 << minCodeSize;
  fr.firstCodeSize = minCodeSize + 1;
  fr.clearCode = clearCode;
  fr.endOfInfoCode = clearCode + 1;
  const imgDataSize = readImgDataSize(uintA, i);
  const imgData = new Uint8Array(imgDataSize + 2);
  let imgDataPos = 0;
  let subBlockSize = uintA[i] & 0xff;
  while (subBlockSize > 0) {
    try {
      const nextSubBlockSizePos = i + subBlockSize + 1;
      const nextSubBlockSize = uintA[nextSubBlockSizePos] & 0xff;
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
  let subBlockSize = uintA[i] & 0xff;
  while (subBlockSize > 0) {
    try {
      const nextSubBlockSizePos = i + subBlockSize + 1;
      const nextSubBlockSize = uintA[nextSubBlockSizePos] & 0xff;
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
  fr.x = (uintA[++i] & 0xff) | ((uintA[++i] & 0xff) << 8);
  fr.y = (uintA[++i] & 0xff) | ((uintA[++i] & 0xff) << 8);
  fr.w = (uintA[++i] & 0xff) | ((uintA[++i] & 0xff) << 8);
  fr.h = (uintA[++i] & 0xff) | ((uintA[++i] & 0xff) << 8);
  fr.wh = fr.w * fr.h;
  const b = uintA[++i];
  fr.hasLocColTbl = (b & 0b10000000) >>> 7 === 1;
  fr.interlaceFlag = (b & 0b01000000) >>> 6 === 1;
  fr.sortFlag = (b & 0b00100000) >>> 5 === 1;
  const colTblSizePower = (b & 7) + 1;
  fr.sizeOfLocColTbl = 1 << colTblSizePower;
  return i + 1;
}

function readLogicalScreenDescriptor(
  img: GifImage,
  uintA: Uint8Array,
  i: number,
): number {
  img.w = (uintA[i++] & 0xff) | ((uintA[i++] & 0xff) << 8);
  img.h = (uintA[i++] & 0xff) | ((uintA[i++] & 0xff) << 8);
  img.wh = img.w * img.h;
  const b = uintA[i++];
  img.hasGlobColTbl = (b & 0b10000000) >>> 7 === 1;
  img.colorResolution = (b & 0b01110000) >>> 4;
  img.sortFlag = (b & 0b00001000) >>> 3 === 1;
  const colTblSizePower = (b & 7) + 1;
  img.sizeOfGlobColTbl = 1 << colTblSizePower;
  img.bgColIndex = uintA[i++] & 0xff;
  img.pxAspectRatio = uintA[i++] & 0xff;
  return i;
}

function readTextExtension(uintA: Uint8Array, i: number): number {
  while ((uintA[i] & 0xff) !== 0) {
    i += (uintA[i] & 0xff) + 1;
  }
  return i + 1;
}

export {
  read,
  readAppExt,
  readColTbl,
  readGraphicControlExt,
  readHeader,
  readImgData,
  readImgDataSize,
  readImgDescr,
  readLogicalScreenDescriptor,
  readTextExtension,
};
