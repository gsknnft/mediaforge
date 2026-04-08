import {BASE_ASSET_PATH, ASSET_PATHS, CACHE_CONFIG, ASSET_VALIDATION} from './asset.config';
import {Asset, AssetMetadata } from '@/types/asset.types';
//import { getAssetFromStore } from '@vercel/edge-store';

  interface AssetConfigs {
    [key: string]: Record<string, Asset>;
  }


type ApiRequestLike = {
  query: Record<string, string | string[] | undefined>;
};

type ApiResponseLike = {
  status: (code: number) => ApiResponseLike;
  json: (payload: unknown) => unknown;
  send: (payload: unknown) => unknown;
  setHeader: (name: string, value: string) => void;
};

  export class AssetLoader {
    private cache: Map<string, Buffer> = new Map();

    async load(path: string, metadata: AssetMetadata): Promise<Buffer> {
      const cacheKey = `${path}-${metadata.version}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }

      const asset = await fetch(`${BASE_ASSET_PATH}/${path}`);
      const buffer = Buffer.from(await asset.arrayBuffer());
      this.cache.set(cacheKey, buffer);
      return buffer;
    }
  }


    function validateAssetRequest(path: string, config: Asset): boolean {
        const ext = path.split('.').pop() || '';
        return config.allowedFormats?.includes(`.${ext}`) || false;
      }

      async function compressAsset(asset: Response, format: string): Promise<Buffer> {
        // Implement compression based on format
        // Return compressed buffer
        return Buffer.from(await asset.arrayBuffer());
      }

  async function getAssetFromStore(assetPath: string, config: Asset): Promise<Buffer> {
    const cache = await caches.open('asset-cache');
    const cacheKey = `${assetPath}-v${config.version}`;

    // Validate request
    if (!validateAssetRequest(assetPath, config)) {
      throw new Error('Invalid asset request');
    }

    const cachedResponse = await cache.match(cacheKey);
    if (cachedResponse && !isAssetStale(await cachedResponse.json())) {
      return Buffer.from((await cachedResponse.json()).data);
    }

    const asset = await fetchWithRetries(`/api/${assetPath}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });

    if (config.compress) {
      return await compressAsset(asset, config.format);
    }

    return Buffer.from(await asset.arrayBuffer());
  }

function isAssetStale(metadata: AssetMetadata): boolean {
    const now = Date.now();
    const maxAge = CACHE_CONFIG.defaultDuration * 1000;
    return (now - metadata.lastModified) > maxAge;
}

export const runtime = 'edge';

export default async function handler(req: ApiRequestLike, res: ApiResponseLike) {
  const { format, asset } = req.query;

  if (!format || !asset) {
    return res.status(400).json({ error: 'Type and asset name are required' });
  }
  const config = ASSET_PATHS[format as string]?.[asset as string];

  if (!config) {
    return res.status(404).json({ error: 'Asset not found' });
  }

  try {
    const assetData = await getAssetFromStore(config.path, config);

    res.setHeader('Cache-Control', `public, max-age=${config.cacheDuration || CACHE_CONFIG.defaultDuration}`);
    res.setHeader('Content-Type', getContentType(config.format));
    res.status(200).send(assetData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset' });
  }
}

async function fetchWithRetries(url: string, options: RequestInit, retries = 3): Promise<Response> {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (response.ok) return response;
        } catch (error) {
            if (i === retries - 1) throw error;
        }
        await new Promise(res => setTimeout(res, Math.pow(2, i) * 100)); // Exponential backoff
    }
    throw new Error(`Failed to fetch ${url} after ${retries} retries.`);
}


function getContentType(format: string): string {
    const types: Record<string, string> = {
        gif: 'image/gif',
        overlay: 'image/png',
        image: 'image/jpeg',
        svg: 'image/svg+xml',
        webp: 'image/webp',
    };
    return types[format] || 'application/octet-stream';
}
