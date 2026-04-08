import { useCallback, useMemo, useState } from "react";
import type { OverlayAsset } from "../types/asset.types";
import { GIFProcessor } from "../GifProcessor";

export const useGIFProcessing = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string>("");
  const [currentOverlays, setCurrentOverlays] = useState<OverlayAsset[]>([]);
  const processor = useMemo(() => GIFProcessor.getInstance(), []);

  const processGIF = useCallback(
    async (
      gifUrl: string,
      bglessUrl: string,
      overlays?: OverlayAsset[],
    ): Promise<Blob> => {
      setIsProcessing(true);
      try {
        const frames = await processor.extractFrames(gifUrl);
        if (!overlays) {
          const result = await processor.generateGIF(frames, bglessUrl);
          return result;
        }

        const result = await processor.generateGIF(frames, bglessUrl, overlays);
        return result;
      } catch (error) {
        console.error("Error processing GIF:", error);
        throw error;
      } finally {
        setIsProcessing(false);
      }
    },
    [processor],
  );

  return {
    processGIF,
    isProcessing,
    currentBackground,
    setCurrentBackground,
    currentOverlays,
    setCurrentOverlays,
  };
};

  const htmlToCanvas = useCallback(async (html: HTMLImageElement): Promise<HTMLCanvasElement> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    if (!ctx) {
      throw new Error('Could not create canvas context');
    }
    const img = new Image();
    img.src = html.src;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = (err) => reject(err);
    });
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    return canvas;
  }, []);

  const bulkHtmlToCanvas = useCallback(async (htmls: HTMLImageElement[]): Promise<HTMLCanvasElement[]> => {
    const canvases = await Promise.all(htmls.map(async (html) => {
      return await htmlToCanvas(html);
    }));
    return canvases;
  }, [htmlToCanvas]);
