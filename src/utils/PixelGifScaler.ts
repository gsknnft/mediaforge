import { ParsedFrame } from 'gifuct-js';

interface ScalingMetrics {
  maxWidth: number;
  maxHeight: number;
  baseScale: number;
  frameScales: number[];
}

export class PixelGifScaler {
  private targetSize: number;

  constructor(targetSize: number) {
    this.targetSize = targetSize;
  }

  calculateScaling(frames: ParsedFrame[]): ScalingMetrics {
    // Find original dimensions
    const dimensions = frames.map(f => ({
      width: f.dims.width,
      height: f.dims.height
    }));

    const maxWidth = Math.max(...dimensions.map(d => d.width));
    const maxHeight = Math.max(...dimensions.map(d => d.height));

    // Calculate base scale that maintains pixel aspect ratio
    const baseScale = Math.floor(Math.min(
      this.targetSize / maxWidth,
      this.targetSize / maxHeight
    ));

    // Calculate individual frame scales relative to largest frame
    const frameScales = dimensions.map(d => ({
      widthScale: maxWidth / d.width,
      heightScale: maxHeight / d.height
    })).map(({ widthScale, heightScale }) => 
      Math.min(widthScale, heightScale)
    );

    return {
      maxWidth,
      maxHeight,
      baseScale,
      frameScales
    };
  }

  scaleFrame(
    frame: ParsedFrame, 
    frameIndex: number,
    metrics: ScalingMetrics
  ): ImageData {
    const { maxWidth, maxHeight, baseScale, frameScales } = metrics;
    const scale = frameScales[frameIndex] * baseScale;
    
    // Calculate centered position
    const scaledWidth = Math.round(frame.dims.width * scale);
    const scaledHeight = Math.round(frame.dims.height * scale);
    const x = Math.floor((maxWidth * baseScale - scaledWidth) / 2);
    const y = Math.floor((maxHeight * baseScale - scaledHeight) / 2);

    // Create scaled ImageData
    const scaledData = new ImageData(
      maxWidth * baseScale,
      maxHeight * baseScale
    );

    // Scale pixels maintaining perfect pixel ratio
    for (let sy = 0; sy < scaledHeight; sy++) {
      for (let sx = 0; sx < scaledWidth; sx++) {
        const sourceX = Math.floor(sx / scale);
        const sourceY = Math.floor(sy / scale);
        const sourceIndex = (sourceY * frame.dims.width + sourceX) * 4;
        const targetIndex = ((sy + y) * scaledData.width + (sx + x)) * 4;

        // Copy pixel data
        scaledData.data[targetIndex] = frame.patch[sourceIndex];
        scaledData.data[targetIndex + 1] = frame.patch[sourceIndex + 1];
        scaledData.data[targetIndex + 2] = frame.patch[sourceIndex + 2];
        scaledData.data[targetIndex + 3] = frame.patch[sourceIndex + 3];
      }
    }

    return scaledData;
  }
}
