export declare class BitReader {
    private nextBitToRead;
    private numberOfBitsToRead;
    private bitMask;
    private bytes;
    constructor(bytes?: Uint8Array);
    init(bytes: Uint8Array): void;
    read(): number;
    setNumberOfBitsToRead(numberOfBitsToRead: number): void;
}
//# sourceMappingURL=BitReader.d.ts.map