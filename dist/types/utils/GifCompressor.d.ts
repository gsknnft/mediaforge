import { FileData } from "@ffmpeg/ffmpeg";
interface GIFCompressionSettings {
    widthScale?: number;
    fps?: number;
    quality?: number;
    maxSizeMb?: number;
}
/**
 * Automatically compresses a GIF to ensure it stays under the max size.
 * Defaults to 10MB max, reducing scale, FPS, and quality dynamically.
 * @param inputBlob - Original GIF Blob
 * @param maxSizeMb - Target max file size in MB (default: 10)
 * @returns {Promise<Blob>} - Compressed GIF Blob
 */
declare function autoCompressGIF(inputBlob: Blob, maxSizeMb?: number): Promise<Blob>;
/**
 * Compress a GIF with manual settings.
 * @param inputBlob - Original GIF Blob
 * @param settings - Compression settings (widthScale, fps, quality, maxSizeMb)
 * @returns {Promise<Blob>} - Compressed GIF Blob
 */
declare function compressGIFWithSettings(inputBlob: Blob, settings: GIFCompressionSettings): Promise<Blob>;
/**
 * File picker for selecting a GIF from the user's computer.
 */
declare function selectFileAndCompress(autoCompress?: boolean): void;
/**
 * Usage Examples:
 * 1️⃣ Auto-compress & Download GIF
 * selectFileAndCompress(true);
 *
 * 2️⃣ Manually set settings & Download GIF
 * selectFileAndCompress(false);
 */
declare function fileDataToImage(fileData: FileData): Promise<HTMLImageElement>;
/**
 * Triggers a download for a Blob.
 * @param blob - The Blob to download.
 * @param fileName - Name of the downloaded file.
 */
declare function downloadBlob(blob: Blob, fileName: string): void;
/**
 * Example Usage:
 * 1. Automatically compress (if too big)
 * 2. Manually set settings before rendering
 */
export { autoCompressGIF, compressGIFWithSettings, downloadBlob, selectFileAndCompress, fileDataToImage, };
//# sourceMappingURL=GifCompressor.d.ts.map