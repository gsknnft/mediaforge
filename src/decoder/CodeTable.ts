import { BitReader } from "./BitReader";
import { GifFrame } from "./GifFrame";

export type CodeTableType = typeof CodeTable;

export class CodeTable {
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
