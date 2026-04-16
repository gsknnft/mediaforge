import { BitReader } from "./BitReader";
import { GifFrame } from "./GifFrame";
export type CodeTableType = typeof CodeTable;
export declare class CodeTable {
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
//# sourceMappingURL=CodeTable.d.ts.map