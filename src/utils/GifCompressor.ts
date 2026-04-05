import { FFmpeg, FileData } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import GIF from "gif.js.optimized";

interface GIFCompressionSettings {
  widthScale?: number; // Scale factor for resolution (e.g., 0.8 = 80% of original)
  fps?: number; // Frames per second
  quality?: number; // GIF encoding quality (lower = smaller file)
  maxSizeMb?: number; // Maximum file size in MB
}

/**
 * Automatically compresses a GIF to ensure it stays under the max size.
 * Defaults to 10MB max, reducing scale, FPS, and quality dynamically.
 * @param inputBlob - Original GIF Blob
 * @param maxSizeMb - Target max file size in MB (default: 10)
 * @returns {Promise<Blob>} - Compressed GIF Blob
 */
async function autoCompressGIF(inputBlob: Blob, maxSizeMb = 10): Promise<Blob> {
  let widthScale = 1.0;
  let fps = 24;
  let quality = 10;

  let compressedBlob = inputBlob;
  let iteration = 0;

  while (compressedBlob.size > maxSizeMb * 1024 * 1024) {
    iteration++;
    widthScale -= 0.1; // Reduce resolution
    fps -= 5; // Lower FPS
    quality += 10; // Increase compression

    console.log(
      `🛠️ Auto-Compress Iteration #${iteration}: Scale=${widthScale}, FPS=${fps}, Quality=${quality}`,
    );

    compressedBlob = await compressGIFWithSettings(inputBlob, {
      widthScale,
      fps,
      quality,
      maxSizeMb,
    });

    if (widthScale <= 0.4 || fps <= 10) break; // Prevent over-compression
  }

  return compressedBlob;
}

/**
 * Compress a GIF with manual settings.
 * @param inputBlob - Original GIF Blob
 * @param settings - Compression settings (widthScale, fps, quality, maxSizeMb)
 * @returns {Promise<Blob>} - Compressed GIF Blob
 */
async function compressGIFWithSettings(
  inputBlob: Blob,
  settings: GIFCompressionSettings,
): Promise<Blob> {
  const { widthScale = 0.8, fps = 15, quality = 20, maxSizeMb = 10 } = settings;

  // Step 1: Compress with gif.js.optimized
  const inputImage = await createImageBitmap(inputBlob);
  const width = inputImage.width * widthScale;
  const height = inputImage.height * widthScale;

  const offscreenCanvas = new OffscreenCanvas(width, height);
  const ctx = offscreenCanvas.getContext("2d")!;
  ctx.drawImage(inputImage, 0, 0, width, height);

  const gif = new GIF({
    workers: 2,
    quality,
    debug: true,
    width,
    height,
  });

  gif.addFrame(ctx, { delay: 100 });

  const gifJsBlob: Blob = await new Promise((resolve) => {
    gif.on("finished", (blob: Blob) => resolve(blob));
    gif.render();
  });

  console.log(
    `📏 gif.js.optimized compressed size: ${gifJsBlob.size / 1024 / 1024} MB`,
  );

  // Step 2: Further compress with FFmpeg
  const ffmpeg = new FFmpeg();
  if (!ffmpeg.loaded) await ffmpeg.load();

  const inputName = "input.gif";
  const outputName = "output.gif";
  await ffmpeg.writeFile(inputName, await fetchFile(gifJsBlob));
  // Getting duration of a video in seconds: ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 video.avi -o output.txt

  await ffmpeg.exec([
    "-i",
    inputName,
    "-vf",
    `fps=${fps},scale=w=iw*${widthScale}:h=-1:flags=lanczos`,
    "-c:v",
    "gif",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);
  const compressedBlob = fileDataToGifBlob(data);

  console.log(
    `✅ Final compressed size: ${compressedBlob.size / 1024 / 1024} MB`,
  );

  if (compressedBlob.size > maxSizeMb * 1024 * 1024) {
    console.warn("⚠️ GIF size still exceeds limit after FFmpeg compression.");
  }

  return compressedBlob;
}

/**
 * File picker for selecting a GIF from the user's computer.
 */
function selectFileAndCompress(autoCompress = true): void {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/gif";

  input.addEventListener("change", async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    console.log(
      `📂 Selected File: ${file.name} (${file.size / 1024 / 1024} MB)`,
    );

    let compressedBlob: Blob;

    if (autoCompress) {
      compressedBlob = await autoCompressGIF(file, 10);
    } else {
      compressedBlob = await compressGIFWithSettings(file, {
        widthScale: 0.7,
        fps: 10,
        quality: 30,
        maxSizeMb: 5,
      });
    }

    downloadBlob(compressedBlob, "compressed_" + file.name);
  });

  input.click();
}

/**
 * Usage Examples:
 * 1️⃣ Auto-compress & Download GIF
 * selectFileAndCompress(true);
 *
 * 2️⃣ Manually set settings & Download GIF
 * selectFileAndCompress(false);
 */

function fileDataToImage(fileData: FileData): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(fileDataToGifBlob(fileData));
  });
}

function fileDataToGifBlob(fileData: FileData): Blob {
  if (typeof fileData === "string") {
    return new Blob([fileData], { type: "image/gif" });
  }

  if (fileData instanceof Uint8Array) {
    if (fileData.buffer instanceof ArrayBuffer) {
      const arrayBufferView = fileData as Uint8Array<ArrayBuffer>;
      return new Blob([arrayBufferView], { type: "image/gif" });
    }

    // Fallback for non-ArrayBuffer-backed views (e.g. SharedArrayBuffer).
    const normalized = new Uint8Array(fileData.byteLength);
    normalized.set(fileData);
    return new Blob([normalized], { type: "image/gif" });
  }

  throw new Error(`Unsupported FFmpeg file data type: ${typeof fileData}`);
}

/**
 * Triggers a download for a Blob.
 * @param blob - The Blob to download.
 * @param fileName - Name of the downloaded file.
 */

function downloadBlob(blob: Blob, fileName: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Example Usage:
 * 1. Automatically compress (if too big)
 * 2. Manually set settings before rendering
 */
// autoCompressGIF(inputGIFBlob).then(downloadBlob);
// compressGIFWithSettings(inputGIFBlob, { widthScale: 0.7, fps: 10, quality: 30 }).then(downloadBlob);

export {
  autoCompressGIF,
  compressGIFWithSettings,
  downloadBlob,
  selectFileAndCompress,
};
