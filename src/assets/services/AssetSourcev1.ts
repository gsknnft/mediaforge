import { AssetBase, BackgroundAsset, OverlayAsset } from "../types/asset.types";
import { AssetConfig, AssetMetadata } from "../types/asset.types";
import { ASSET_PATHS } from "../config/asset.config";

export const ASSETS: {
  backgrounds: Record<string, BackgroundAsset>;
  overlays: Record<string, OverlayAsset>;
} = {
  backgrounds: {
    Fire: {
      name: "Fire Background",
      url: `${ASSET_PATHS.backgrounds.animated}/bg3.gif`,
      format: "gif",
      type: "background",
      category: "backgrounds",
      fileName: "bg3.gif",
      path: ASSET_PATHS.backgrounds.animated,
      version: "1.0",
      tags: ["fire", "action"],
      bgCategory: "Animated",
      access: "private",
      id: "fire-bg",
      etag: "1",
      lastModified: Date.now(),
    },
    Fire2: {
      name: "Fire Background",
      url: `${ASSET_PATHS.backgrounds.animated}/bg.gif`,
      format: "gif",
      type: "background",
      category: "backgrounds",
      fileName: "bg.gif",
      bgCategory: "Animated",
      path: ASSET_PATHS.backgrounds.animated,
      access: "private",
      id: "fire-bg",
      etag: "1",
      lastModified: Date.now(),
      version: "1.0",
      tags: ["fire", "action"],
    },
    Winter: {
      name: "Winter Background",
      url: `${ASSET_PATHS.backgrounds.static}/winter_bg.jpg`,
      format: "jpg",
      type: "background",
      category: "backgrounds",
      bgCategory: "Static",
      fileName: "winter_bg.jpg",
      path: ASSET_PATHS.backgrounds.static,
      access: "private",
      id: "winter-bg",
      etag: "1",
      lastModified: Date.now(),
      version: "1.0",
      tags: ["winter", "snow"],
    },
    Garage: {
      name: "Garage Background",
      url: `${ASSET_PATHS.backgrounds.static}/garage.png`,
      format: "png",
      type: "background",
      category: "backgrounds",
      bgCategory: "Static",
      access: "private",
      id: "garage-bg",
      etag: "1",
      lastModified: Date.now(),
      fileName: "garage.png",
      path: ASSET_PATHS.backgrounds.static,
      version: "1.0",
      tags: ["home", "workshop"],
    },
    "Pixel Forest": {
      name: "Pixel Forest Background",
      url: `${ASSET_PATHS.backgrounds.pixel}/pixel_kawai_bg.gif`,
      format: "gif",
      type: "background",
      bgCategory: "Pixel Art",
      fileName: "pixel_kawai_bg.gif",
      access: "private",
      id: "pixel-forest-bg",
      etag: "1",
      category: "backgrounds",
      lastModified: Date.now(),
      path: ASSET_PATHS.backgrounds.pixel,
      version: "1.0",
      tags: ["pixel", "forest"],
    },
    "Backyard Pixel": {
      name: "Pixel Path Background",
      url: `${ASSET_PATHS.backgrounds.pixel}/backyardpxl.gif`,
      format: "gif",
      access: "private",
      id: "backyard-pixel-bg",
      etag: "1",
      lastModified: Date.now(),
      category: "backgrounds",
      type: "background",
      bgCategory: "Pixel Art",
      fileName: "backyardpxl.gif",
      path: ASSET_PATHS.backgrounds.pixel,
      version: "1.0",
      tags: ["pixel", "path"],
    },
  },
  overlays: {
    "Santa Hat": {
      name: "Santa Hat",
      url: `${ASSET_PATHS.overlays.head}/santa_hat.png`,
      format: "png",
      type: "overlay",
      category: "overlays",
      overlayCategory: "Head",
      attribute: "Head",
      fileName: "santa_hat.png",
      path: ASSET_PATHS.overlays.head,
      version: "1.0",
      access: "private",
      id: "santa-hat",
      etag: "1",
      lastModified: Date.now(),
      disAllowedTraits: {
        Head: ["Beer Hat", "Bed Head", "Bucket Hat", "Hardhat"],
      },
      traits: {
        Head: ["Santa Hat"],
      },
      tags: ["holiday", "christmas"],
    },
    "Xmas Sweater": {
      name: "Xmas Sweater",
      url: `${ASSET_PATHS.overlays.clothes}/XMas_Sweater.png`,
      format: "png",
      type: "overlay",
      category: "overlays",
      access: "private",
      id: "xmas-sweater",
      etag: "1",
      lastModified: Date.now(),
      overlayCategory: "Clothes",
      attribute: "Clothes",
      fileName: "XMas_Sweater.png",
      path: ASSET_PATHS.overlays.clothes,
      version: "1.0",
      disAllowedTraits: {
        Clothes: ["T-Shirt", "Baby Carlos", "DadBod"],
      },
      traits: {
        Clothes: ["XMas Sweater"],
      },
      tags: ["holiday", "christmas"],
    },
    "Holiday Sweater": {
      name: "Holiday Sweater",
      url: `${ASSET_PATHS.overlays.clothes}/Holiday_Sweater.png`,
      format: "png",
      type: "overlay",
      category: "overlays",
      access: "private",
      id: "holiday-sweater",
      etag: "1",
      lastModified: Date.now(),
      overlayCategory: "Clothes",
      attribute: "Clothes",
      fileName: "Holiday_Sweater.png",
      path: ASSET_PATHS.overlays.clothes,
      version: "1.0",
      disAllowedTraits: {
        Clothes: ["T-Shirt", "Hoodie", "Sweater", "Dress"],
      },
      traits: {
        Clothes: ["Holiday Sweater"],
      },
      tags: ["holiday", "christmas"],
    },
    "#1 Dad Hoodie": {
      name: "#1 Dad Hoodie",
      url: `${ASSET_PATHS.overlays.clothes}/DadHoodie.png`,
      format: "png",
      type: "overlay",
      category: "overlays",
      access: "private",
      id: "dad-hoodie",
      etag: "1",
      lastModified: Date.now(),
      overlayCategory: "Clothes",
      attribute: "Clothes",
      fileName: "DadHoodie.png",
      path: ASSET_PATHS.overlays.clothes,
      version: "1.0",
      disAllowedTraits: {
        Clothes: ["T-Shirt", "Hoodie", "Sweater", "Dress"],
      },
      traits: {
        Clothes: ["#1 Dad Hoodie"],
      },
      tags: ["dad", "father"],
    },
  },
};

export class AssetLoader {
  private cache: Map<string, Buffer> = new Map();

  async load(path: string, metadata: AssetMetadata): Promise<Buffer> {
    const cacheKey = `${path}-${metadata.version}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    const asset = await fetch(`/_assets/${path}`);
    const buffer = Buffer.from(await asset.arrayBuffer());
    this.cache.set(cacheKey, buffer);
    return buffer;
  }
}

const ASSET_VALIDATION = {
  maxSize: {
    gif: 15360, // 15MB
    overlay: 2048, // 2MB
    image: 5120, // 5MB
  },
  allowedFormats: {
    gif: [".gif"],
    overlay: [".png", ".webp"],
    image: [".jpg", ".jpeg", ".png", ".webp"],
  },
};

const CACHE_CONFIG = {
  defaultDuration: 31536000, // 1 year
  overlayDuration: 604800, // 1 week
  gifDuration: 86400, // 1 day
};

interface AssetConfigs {
  [key: string]: Record<string, AssetConfig>;
}

export const ASSET_CONFIG: AssetConfigs = {
  overlay: {
    "Santa Hat": {
      id: "santa-hat",
      name: "Santa Hat",
      category: "overlays",
      url: `${ASSET_PATHS.overlays.head}/santa_hat.png`,
      path: ASSET_PATHS.overlays.head,
      access: "private",
      format: "png",
      type: "overlay",
      etag: "1",
      lastModified: Date.now(),
      fileName: "santa_hat.png",
      cacheDuration: CACHE_CONFIG.overlayDuration,
      version: "1.0",
      allowedFormats: ASSET_VALIDATION.allowedFormats.overlay,
      maxSize: ASSET_VALIDATION.maxSize.overlay,
      compress: true,
    },
    "Xmas Sweater": {
      path: ASSET_PATHS.overlays.clothes,
      access: "private",
      etag: "1",
      lastModified: Date.now(),
      id: "xmas-sweater", 
      name: "Xmas Sweater",
      category: "overlays",
      url: `${ASSET_PATHS.overlays.clothes}/XMas_Sweater.png`,
      version: "1.0",
      cacheDuration: CACHE_CONFIG.overlayDuration,
      format: "png",
      type: "overlay",
      fileName: "XMas_Sweater.png",
    },
    "Holiday Sweater": {
      path: ASSET_PATHS.overlays.clothes,
      access: "private",
      format: "png",
      type: "overlay",
      etag: "1",
      lastModified: Date.now(),
      id: "holiday-sweater",
      version: "1.0",
      name: "Holiday Sweater",
      category: "overlays",
      url: `${ASSET_PATHS.overlays.clothes}/Holiday_Sweater.png`,
      cacheDuration: CACHE_CONFIG.overlayDuration,
      fileName: "Holiday_Sweater.png",
    },
    "#1 Dad Hoodie": {
      path: ASSET_PATHS.overlays.clothes,
      access: "private",
      id: "dad-hoodie",
      name: "#1 Dad Hoodie",
      category: "overlays",
      etag: "1",
      lastModified: Date.now(),
      url: `${ASSET_PATHS.overlays.clothes}/DadHoodie.png`,
      version: "1.0",
      cacheDuration: CACHE_CONFIG.overlayDuration,
      format: "png",
      type: "overlay",
      fileName: "DadHoodie.png",
    },
  },
  static: {
    Garage: {
      path: ASSET_PATHS.backgrounds.static,
      access: "private",
      format: "png",
      type: "background",
      id: "garage-bg",
      version: "1.0",
      name: "Garage Background",
      category: "backgrounds",
      url: `${ASSET_PATHS.backgrounds.static}/garage.png`,
      etag: "1",
      lastModified: Date.now(),
      fileName: "garage.png",
      cacheDuration: CACHE_CONFIG.defaultDuration,
      maxSize: 2048,
    },
    Winter: {
      path: ASSET_PATHS.backgrounds.static,
      access: "private",
      format: "png",
      id: "winter-bg",
      version: "1.0",
      name: "Winter Background",
      category: "backgrounds",
      url: `${ASSET_PATHS.backgrounds.static}/winter_bg.jpg`,
      etag: "1",
      lastModified: Date.now(),
      type: "background",
      fileName: "winter_bg.jpg",
      cacheDuration: CACHE_CONFIG.defaultDuration,
      maxSize: 2048,
    },
  },
  gif: {
    Fire: {
      path: ASSET_PATHS.backgrounds.animated,
      access: "private",
      format: "gif",
      type: "background",
      fileName: "bg3.gif",
      id: "fire-bg",
      version: "1.0",
      name: "Fire Background",
      etag: "1",
      lastModified: Date.now(),
      category: "backgrounds",
      url: `${ASSET_PATHS.backgrounds.animated}/bg3.gif`,
      cacheDuration: CACHE_CONFIG.gifDuration,
      maxSize: 15360,
    },
    "Pixel Forest": {
      path: ASSET_PATHS.backgrounds.pixel,
      access: "private",
      format: "gif",
      etag: "1",
      lastModified: Date.now(),
      id: "pixel-forest-bg",
      version: "1.0",
      name: "Pixel Forest Background",
      category: "backgrounds",
      url: `${ASSET_PATHS.backgrounds.pixel}/pixel_kawai_bg.gif`,
      type: "background",
      fileName: "pixel_kawai_bg.gif",
      cacheDuration: CACHE_CONFIG.defaultDuration,
      maxSize: 2048,
    },
  },
};

function validateAssetRequest(path: string, config: AssetConfig): boolean {
  const ext = path.split(".").pop() || "";
  return config.allowedFormats?.includes(`.${ext}`) || false;
}

async function compressAsset(asset: Response, format: string): Promise<Buffer> {
  // Implement compression based on format
  // Return compressed buffer
  return Buffer.from(await asset.arrayBuffer());
}

export async function getAssetConfig(
  req: any,
  res: any
) {
  const { format, name } = req.query;
  const assetConfig = ASSET_CONFIG[format as string][name as string];
  res.status(200).json(assetConfig);
}

async function getAssetFromStore(
  assetPath: string,
  config: AssetConfig
): Promise<Buffer> {
  const cache = await caches.open("asset-cache");
  const cacheKey = `${assetPath}-v${config.version}`;

  // Validate request
  if (!validateAssetRequest(assetPath, config)) {
    throw new Error("Invalid asset request");
  }

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse && !isAssetStale(await cachedResponse.json())) {
    return Buffer.from((await cachedResponse.json()).data);
  }

  const asset = await fetchWithRetries(`/api/${assetPath}`, {
    headers: { "Cache-Control": "no-cache" },
  });

  if (config.compress) {
    return await compressAsset(asset, config.format);
  }

  return Buffer.from(await asset.arrayBuffer());
}

function isAssetStale(metadata: AssetMetadata): boolean {
  const now = Date.now();
  const maxAge = CACHE_CONFIG.defaultDuration * 1000;
  return now - metadata.lastModified > maxAge;
}

export const runtime = "edge";

export default async function handler(
  req: any,
  res: any
) {
  const { format, asset } = req.query;

  if (!format || !asset) {
    return res.status(400).json({ error: "Type and asset name are required" });
  }

  const config = ASSET_CONFIG[format as string]?.[asset as string];

  if (!config) {
    return res.status(404).json({ error: "Asset not found" });
  }

  try {
    const assetData = await getAssetFromStore(config.path, config);

    res.setHeader(
      "Cache-Control",
      `public, max-age=${config.cacheDuration || CACHE_CONFIG.defaultDuration}`
    );
    res.setHeader("Content-Type", getContentType(config.format));
    res.status(200).send(assetData);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch asset" });
  }
}

async function fetchWithRetries(
  url: string,
  options: RequestInit,
  retries = 3
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
    } catch (error) {
      if (i === retries - 1) throw error;
    }
    await new Promise((res) => setTimeout(res, Math.pow(2, i) * 100)); // Exponential backoff
  }
  throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
}

export const AssetsArrays = {
  backgrounds: Object.values(ASSETS.backgrounds),
  overlays: Object.values(ASSETS.overlays),
};

function getContentType(format: string): string {
  const types: Record<string, string> = {
    gif: "image/gif",
    overlay: "image/png",
    image: "image/jpeg",
    svg: "image/svg+xml",
    webp: "image/webp",
  };
  return types[format] || "application/octet-stream";
}
