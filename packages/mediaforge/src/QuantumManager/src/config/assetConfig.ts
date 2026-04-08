import {BASE_Q_PATH, Q_PATHS, CACHE_CONFIG, Q_VALIDATION} from './asset.config';
import {QConfig, QMetadata, QType, QAccess, QCategory} from '../types/quantum.types';
//import { getQFromStore } from '@vercel/edge-store';
  
  export class QLoader {
    private cache: Map<string, Buffer> = new Map();
    
    async load(path: string, metadata: QMetadata): Promise<Buffer> {
      const cacheKey = `${path}-${metadata.version}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!;
      }
      
      const asset = await fetch(`${BASE_Q_PATH}/${path}`);
      const buffer = Buffer.from(await asset.arrayBuffer());
      this.cache.set(cacheKey, buffer);
      return buffer;
    }
  }

  interface QConfigs {
    [key: string]: Record<string, QConfig>;
  }
  
  export const Q_CONFIG: QConfigs = {
    overlay: {
      'Santa Hat': {
        id: 'santa_hat',
        name: 'Santa Hat',
        category: 'overlays' as QCategory,
        path: Q_PATHS.overlays.head,
        url: Q_PATHS.overlays.head,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'santa_hat.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: Q_VALIDATION.images.allowedFormats,
        maxSize: Q_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      },
      'Xmas Sweater': {
        id: 'xmas_sweater',
        name: 'Xmas Sweater',
        category: 'overlays' as QCategory,
        url: `${Q_PATHS.overlays.clothes}/XMas_Sweater.png`,
        path: Q_PATHS.overlays.clothes,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'XMas_Sweater.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: Q_VALIDATION.images.allowedFormats,
        maxSize: Q_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      },
      'Holiday Sweater': {
        id: 'holiday_sweater',
        name: 'Holiday Sweater',
        category: 'overlays' as QCategory,
        url: `${Q_PATHS.overlays.clothes}/Holiday_Sweater.png`,
        path: Q_PATHS.overlays.clothes,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'Holiday_Sweater.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: Q_VALIDATION.images.allowedFormats,
        maxSize: Q_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      },
      '#1 Dad Hoodie': {
        id: 'dad_hoodie',
        name: '#1 Dad Hoodie',
        category: 'overlays' as QCategory,
        url: `${Q_PATHS.overlays.clothes}/DadHoodie.png`,
        path: Q_PATHS.overlays.clothes,
        access: 'private',
        format: 'png',
        type: 'overlay',
        fileName: 'DadHoodie.png',
        cacheDuration: CACHE_CONFIG.overlayDuration,
        version: '1.0',
        allowedFormats: Q_VALIDATION.images.allowedFormats,
        maxSize: Q_VALIDATION.images.maxSize,
        compress: true,
        etag: '',
        lastModified: Date.now()
      }
    },
    static: {
      'Garage': {
        id: 'garage',
        name: 'Garage',
        category: 'backgrounds' as QCategory,
        url: `${Q_PATHS.backgrounds.static}/garage.png`,
        path: Q_PATHS.backgrounds.static,
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
        category: 'backgrounds' as QCategory,
        url: `${Q_PATHS.backgrounds.static}/winter_bg.jpg`,
        path: Q_PATHS.backgrounds.static,
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
        category: 'backgrounds' as QCategory,
        url: `${Q_PATHS.backgrounds.animated}/bg3.gif`,
        path: Q_PATHS.backgrounds.animated,
        access: 'private' as QAccess,
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
        url: `${Q_PATHS.backgrounds.pixel}/pixel_kawai_bg.gif`,
        path: Q_PATHS.backgrounds.pixel,
        access: 'private' as QAccess,
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

    function validateQRequest(path: string, config: QConfig): boolean {
        const ext = path.split('.').pop() || '';
        return config.allowedFormats?.includes(`.${ext}`) || false;
      }
      
      async function compressQ(asset: Response, format: string): Promise<Buffer> {
        // Implement compression based on format
        // Return compressed buffer
        return Buffer.from(await asset.arrayBuffer());
      }

export async function getQConfig(req: any, res: any) {
    const { format, name } = req.query;
    const assetConfig = Q_CONFIG[format as string][name as string];
    res.status(200).json(assetConfig);
  }
    
  async function getQFromStore(assetPath: string, config: QConfig): Promise<Buffer> {
    const cache = await caches.open('asset-cache');
    const cacheKey = `${assetPath}-v${config.version}`;
    
    // Validate request
    if (!validateQRequest(assetPath, config)) {
      throw new Error('Invalid asset request');
    }
  
    const cachedResponse = await cache.match(cacheKey);
    const cachedJson = cachedResponse ? await cachedResponse.json() as QMetadata : undefined;
    if (cachedJson && !isQStale(cachedJson)) {
      return Buffer.from((cachedJson as any).data);
    }
  
    const asset = await fetchWithRetries(`/api/${assetPath}`, {
      headers: { 'Cache-Control': 'no-cache' }
    });
  
    if (config.compress) {
      return await compressQ(asset, config.format);
    }
  
    return Buffer.from(await asset.arrayBuffer());
  }

function isQStale(metadata: QMetadata): boolean {
    const now = Date.now();
    const maxAge = CACHE_CONFIG.defaultDuration * 1000;
    return (now - metadata.lastModified) > maxAge;
}

export const runtime = 'edge';

export default async function handler(req: any, res: any) {
  const { format, asset } = req.query;

  if (!format || !asset) {
    return res.status(400).json({ error: 'Type and asset name are required' });
  }

  const config = Q_CONFIG[format as string]?.[asset as string];

  if (!config) {
    return res.status(404).json({ error: 'Q not found' });
  }

  try {
    const assetData = await getQFromStore(config.path, config);

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


