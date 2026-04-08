import { AssetMetadata } from "../types/asset.types";
import { QualityPresetKey } from "../types";

export interface IArtManager {
  selectOptimalQuality(metadata: AssetMetadata): QualityPresetKey;
}

export class ArtManager implements IArtManager {
  private static instance: ArtManager | null = null;
  private readonly qualityOptions: {
    checkQuality: QualityPresetKey;
    allowAutoDetect: boolean;
  };

  constructor() {
    this.qualityOptions = {
      checkQuality: "HIGH",
      allowAutoDetect: true,
    };
  }

  public extractCharacteristics(metadata: AssetMetadata) {
    return {
      name: metadata.name,
      format: metadata.format,
      type: metadata.type,
      width: metadata.width,
      height: metadata.height,
      isMap: metadata.isMap,
      loading: metadata.loading,
      naturalHeight: metadata.naturalHeight,
      naturalWidth: metadata.naturalWidth,
      sizes: metadata.sizes,
      useMap: metadata.useMap,
      x: metadata.x,
      y: metadata.y,
    };
  }

  public selectOptimalQuality(metadata: AssetMetadata): QualityPresetKey {
    const characteristics = this.extractCharacteristics(metadata);
    if (!this.qualityOptions.allowAutoDetect) {
      return this.qualityOptions.checkQuality;
    }
    // Enhanced quality selection logic based on asset metadata
    if (characteristics.format === "gif") {
      if (characteristics.type === "ANIMATION") {
        return "HIGH";
      }
      if (characteristics.type === "image") {
        return "PIXEL";
      }
    }
    if (characteristics.format === "png" && characteristics.type === "image") {
      return "HIGHRES";
    }
    if (characteristics.format === "jpg" && characteristics.type === "image") {
      return "HIGHRESPIXEL";
    }
    return "HIGH";
  }

  public static getInstance(): ArtManager {
    if (!this.instance) {
      this.instance = new ArtManager();
    }

    return this.instance;
  }

  public static destroyInstance(): void {
    this.instance = null;
  }
}

export default ArtManager;
