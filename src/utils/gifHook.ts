import { useCallback, useMemo, useState } from "react";
import { GIFProcessor } from "../GifProcessor";
import type { OverlayAsset } from "../types/asset.types";

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
