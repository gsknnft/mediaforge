import { GIFMetadata, QualityPresetKey } from "../types/gif.types";
import MemoryManager from "./MemoryManager";

export interface IQualityManager {
  applyImageQualitySettings(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void;
  selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey;
}

export class QualityManager implements IQualityManager {
    private static instance: QualityManager | null = null;
    private readonly memoryManager: MemoryManager;
    private readonly qualityOptions: {
        forceQuality?: QualityPresetKey;
        allowAutoDetect: boolean;
        memoryAware: boolean;
    };

    constructor(memoryManager: MemoryManager) {
        this.memoryManager = memoryManager;
        this.qualityOptions = {
            allowAutoDetect: true,
            memoryAware: true
        };
    }

    public static getInstance(memoryManager: MemoryManager): QualityManager {
        if (!this.instance) {
            this.instance = new QualityManager(memoryManager);
        }

        return this.instance;
    }

    public static destroyInstance(): void {
        this.instance = null;
    }


    public applyImageQualitySettings(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): void {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
    }

    public selectOptimalQuality(metadata: GIFMetadata): QualityPresetKey {
        if (this.qualityOptions.forceQuality) {
            return this.qualityOptions.forceQuality;
        }

        if (!this.qualityOptions.allowAutoDetect) {
            return 'HIGH';
        }

        // Check for pixel art first
        if (metadata.isPixelArt) return 'PIXEL';

        // Enhanced high-res detection
        const totalPixels = metadata.width * metadata.height;
        const avgFrameSize = metadata.frameExtras.individualFrameSizes.reduce(
          (sum, size) => sum + (size.width * size.height), 0
        ) / metadata.frames;

        const isHighRes = totalPixels > 512 * 512 || avgFrameSize > 256 * 256;
        const hasHighColorDepth = metadata.colorDepth > 128;
        const hasComplexFrames = metadata.frameExtras.frameColors.some(colors => colors.size > 128);

        // Detect dominant colors
        const dominantColorAnalysis = this.analyzeDominantColors(metadata);
        const hasFireCharacteristics = dominantColorAnalysis.isFireEffect;

        if (hasFireCharacteristics && metadata.frames > 1) {
            return 'FIRE';
        }

        if (isHighRes) {
            if (hasHighColorDepth || hasComplexFrames) {
                return metadata.hasTransparency ? 'HIGHRES' : 'HIGH';
            }
            return 'HIGH';
        }

        if (metadata.width * metadata.height > 1024 * 1024) {
            return metadata.hasTransparency ? 'HIGHRES' : 'HIGH';
        }

        // Default quality levels
        if (metadata.colorDepth < 64) return 'LOW';
        if (metadata.colorDepth < 128) return 'MEDIUM';
        
        return 'HIGH';
    }

    private hasPixelArtCharacteristics(metadata: GIFMetadata): boolean {
        // Check for sharp edges and limited color palette despite high resolution
        const hasLimitedPalette = metadata.colorDepth < 128;
        const hasSharpEdges = metadata.frameExtras.frameColors.every(colors => 
            colors.size < metadata.width * metadata.height * 0.1
        );
        
        return hasLimitedPalette && hasSharpEdges;
    }

    private analyzeDominantColors(metadata: GIFMetadata): { 
        isFireEffect: boolean;
        dominantColors: Array<{ r: number, g: number, b: number, frequency: number }> 
    } {
        const colorCounts = new Map<string, number>();
        let totalPixels = 0;

        metadata.frameExtras.frameColors.forEach(colors => {
            colors.forEach(color => {
                const r = (color >> 16) & 0xFF;
                const g = (color >> 8) & 0xFF;
                const b = color & 0xFF;
                const key = `${r},${g},${b}`;
                colorCounts.set(key, (colorCounts.get(key) || 0) + 1);
                totalPixels++;
            });
        });

        const dominantColors = Array.from(colorCounts.entries())
            .map(([key, count]) => {
                const [r, g, b] = key.split(',').map(Number);
                return { r, g, b, frequency: count / totalPixels };
            })
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 5);

        const isFireEffect = dominantColors.some(color => 
            color.frequency > 0.15 && // Must be a significant portion
            color.r > color.g * 1.5 && // Red must be significantly higher
            color.r > color.b * 1.5 && // Than both green and blue
            color.r > 200 // And reasonably bright
        );

        return { isFireEffect, dominantColors };
    }
}

export default QualityManager;