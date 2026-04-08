import {
  Asset,
  AssetMetadata,
} from "@/types/asset.types";


export interface AssetConfigs {
  [key: string]: Record<string, Asset>;
}


export const ASSET_VALIDATION = {
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


function validateAssetRequest(path: string, config: Asset): boolean {
  const ext = path.split(".").pop() || "";
  return config.allowedFormats?.includes(`.${ext}`) || false;
}

async function compressAsset(asset: Response, format: string): Promise<Buffer> {
  // Implement compression based on format
  // Return compressed buffer
  return Buffer.from(await asset.arrayBuffer());
}

async function getAssetFromStore(
  assetPath: string,
  meta: Asset
): Promise<Buffer> {
  const cache = await caches.open("asset-cache");
  const cacheKey = `${assetPath}-v${meta.version}`;

  // Validate request
  if (!validateAssetRequest(assetPath, meta)) {
    throw new Error("Invalid asset request");
  }

  const cachedResponse = await cache.match(cacheKey);
  if (cachedResponse && !isAssetStale(await cachedResponse.json())) {
    return Buffer.from((await cachedResponse.json()).data);
  }

  const asset = await fetchWithRetries(`/api/${assetPath}`, {
    headers: { "Cache-Control": "no-cache" },
  });

  if (meta.compress) {
    return await compressAsset(asset, meta.format);
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
  const { format, asset, config } = req.query;

  if (!format || !asset) {
    return res.status(400).json({ error: "Type and asset name are required" });
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
