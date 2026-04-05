import { ParsedFrame } from 'gifuct-js';
import { PixelGifScaler } from './PixelGifScaler';

export async function scalePixelFrames(
  frames: ParsedFrame[],
  targetSize: number
): Promise<ParsedFrame[]> {
  const scaler = new PixelGifScaler(targetSize);
  const metrics = scaler.calculateScaling(frames);
  
  return frames.map((frame, index) => {
    const scaledData = scaler.scaleFrame(frame, index, metrics);
    
    return {
      ...frame,
      patch: scaledData.data,
      dims: {
        width: scaledData.width,
        height: scaledData.height,
        top: 0,
        left: 0
      }
    };
  });
}
