export class BitReader {
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
    const byte0 = this.bytes[byteIndex++] & 0xff;
    const byte1 = this.bytes[byteIndex++] & 0xff;
    const byte2 = this.bytes[byteIndex] & 0xff;
    const buffer = ((((byte2 << 8) | byte1) << 8) | byte0) >>> bitsToShiftRight;
    this.nextBitToRead += this.numberOfBitsToRead;
    return buffer & this.bitMask;
  }

  setNumberOfBitsToRead(numberOfBitsToRead: number) {
    this.numberOfBitsToRead = numberOfBitsToRead;
    this.bitMask = (1 << numberOfBitsToRead) - 1;
  }
}
