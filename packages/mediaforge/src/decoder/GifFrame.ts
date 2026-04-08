export class GifFrame {
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
    this.disposalMethod = gifFrame.disposalMethod!;
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
