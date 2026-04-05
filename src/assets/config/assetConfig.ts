import {BASE_ASSET_PATH, ASSET_PATHS, CACHE_CONFIG, ASSET_VALIDATION} from './asset.config';
import {AssetConfig, AssetMetadata, AssetType, AssetAccess, AssetCategory} from '../types/asset.types';
//import { getAssetFromStore } from '@vercel/edge-store';

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

  interface AssetConfigs {
    [key: string]: Record<string, AssetConfig>;
  }
  
  export const ASSET_CONFIG: AssetConfigs = {
    overlay: {
      'Santa Hat': {
        id: 'santa_hat',
        name: 'Santa Hat',
        category: 'overlays' as AssetCategory,
        path: ASSET_PATHS.overlays.head,
        url: ASSET_PATHS.overlays.head,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'santa_hat.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: ASSET_VALIDATION.images.allowedFormats,
        maxSize: ASSET_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      },
      'Xmas Sweater': {
        id: 'xmas_sweater',
        name: 'Xmas Sweater',
        category: 'overlays' as AssetCategory,
        url: `${ASSET_PATHS.overlays.clothes}/XMas_Sweater.png`,
        path: ASSET_PATHS.overlays.clothes,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'XMas_Sweater.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: ASSET_VALIDATION.images.allowedFormats,
        maxSize: ASSET_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      },
      'Holiday Sweater': {
        id: 'holiday_sweater',
        name: 'Holiday Sweater',
        category: 'overlays' as AssetCategory,
        url: `${ASSET_PATHS.overlays.clothes}/Holiday_Sweater.png`,
        path: ASSET_PATHS.overlays.clothes,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'Holiday_Sweater.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: ASSET_VALIDATION.images.allowedFormats,
        maxSize: ASSET_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      },
      '#1 Dad Hoodie': {
        id: 'dad_hoodie',
        name: '#1 Dad Hoodie',
        category: 'overlays' as AssetCategory,
        url: `${ASSET_PATHS.overlays.clothes}/DadHoodie.png`,
        path: ASSET_PATHS.overlays.clothes,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'DadHoodie.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: ASSET_VALIDATION.images.allowedFormats,
        maxSize: ASSET_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      }
    },
    static: {
      'Garage': {
        id: 'garage',
        name: 'Garage',
        category: 'backgrounds' as AssetCategory,
        url: `${ASSET_PATHS.backgrounds.static}/garage.png`,
        path: ASSET_PATHS.backgrounds.static,
        access: 'private',
        format: 'png',
        type: 'background',
        fileName: 'garage.png',
        cacheDuration: CACHE_CONFIG.defaultDuration,
        maxSize: 2048,
        version: '1.0',
        etag: '',
        lastModified: Date.now()
      },
      'Winter': {
        id: 'winter',
        name: 'Winter',
        category: 'backgrounds' as AssetCategory,
        url: `${ASSET_PATHS.backgrounds.static}/winter_bg.jpg`,
        path: ASSET_PATHS.backgrounds.static,
        access: 'private',
        format: 'png',
        type: 'background',
        fileName: 'winter_bg.jpg',
        cacheDuration: CACHE_CONFIG.defaultDuration,
        maxSize: 2048,
        version: '1.0',
        etag: '',
        lastModified: Date.now()
      }
    },
    gif: {
      'Fire': {
        id: 'fire',
        name: 'Fire',
        category: 'backgrounds' as AssetCategory,
        url: `${ASSET_PATHS.backgrounds.animated}/bg3.gif`,
        path: ASSET_PATHS.backgrounds.animated,
        access: 'private' as AssetAccess,
        format: 'gif',
        type: 'background',
        fileName: 'bg3.gif',
        cacheDuration: CACHE_CONFIG.gifDuration,
        maxSize: 15360,
        version: '1.0',
        etag: '',
        lastModified: Date.now()
      },
      'Pixel Forest': {
        id: 'pixel_forest',
        name: 'Pixel Forest',
        category: 'backgrounds',
        url: `${ASSET_PATHS.backgrounds.pixel}/pixel_kawai_bg.gif`,
        path: ASSET_PATHS.backgrounds.pixel,
        access: 'private' as AssetAccess,
        format: 'gif',
        type: 'background',
        fileName: 'pixel_kawai_bg.gif',
        cacheDuration: CACHE_CONFIG.defaultDuration,
        maxSize: 2048,
        version: '1.0',
        etag: '',
        lastModified: Date.now()
      }
    }
  };

    function validateAssetRequest(path: string, config: AssetConfig): boolean {
        const ext = path.split('.').pop() || '';
        return config.allowedFormats?.includes(`.${ext}`) || false;
      }
      
      async function compressAsset(asset: Response, format: string): Promise<Buffer> {
        // Implement compression based on format
        // Return compressed buffer
        return Buffer.from(await asset.arrayBuffer());
      }

export async function getAssetConfig(req: ApiRequestLike, res: ApiResponseLike) {
    const { format, name } = req.query;
    const assetConfig = ASSET_CONFIG[format as string][name as string];
    res.status(200).json(assetConfig);
  }
    
  async function getAssetFromStore(assetPath: string, config: AssetConfig): Promise<Buffer> {
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

  const config = ASSET_CONFIG[format as string]?.[asset as string];

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

