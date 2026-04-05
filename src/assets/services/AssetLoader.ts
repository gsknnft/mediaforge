import { 
  AssetMetadata, 
  LoaderOptions, 
  Environment, 
  AssetError,
  AssetStatus 
} from '../types/asset.types';

import { ASSET_ENV_CONFIG, ENVIRONMENT, LOADER_CONFIG } from '../config/asset.config';

export class AssetLoader {
  static cache: Map<string, { data: Buffer; metadata: AssetMetadata }>;
  static environment: Environment;
  static loadingQueue: Set<string>;

  constructor(environment: Environment = ENVIRONMENT) {
    AssetLoader.cache = new Map();
    AssetLoader.environment = environment;
    AssetLoader.loadingQueue = new Set();
  }

  static createAssetError(message: string, assetId: string, code: string): AssetError {
    return {
      name: 'AssetError',
      message,
      code,
      context: {
        assetId,
        environment: AssetLoader.environment,
        attempt: 0,
        timestamp: Date.now()
      }
    } as AssetError;
  }


 static async load(
    assetPath: string,
    metadata: AssetMetadata,
    options: LoaderOptions = {}
  ): Promise<Buffer> {
    const cacheKey = `${metadata.id}-${metadata.version}-${AssetLoader.environment}`;
    const envConfig = ASSET_ENV_CONFIG[AssetLoader.environment];
    
    if (options.cache !== false) {
      const cached = AssetLoader.getCachedAsset(cacheKey, metadata);
      if (cached) return cached;
    }

    if (AssetLoader.loadingQueue.has(cacheKey)) {
      throw AssetLoader.createAssetError(
        'Asset is already being loaded',
        metadata.id,
        'ASSET_LOADING_DUPLICATE'
      );
    }

    AssetLoader.loadingQueue.add(cacheKey);
    
    try {
      const url = assetPath || metadata.cdnUrl || metadata.url;
      const response = await AssetLoader.fetchWithRetry(url, metadata, options);
      const buffer = Buffer.from(await response.arrayBuffer());
            
      AssetLoader.cache.set(cacheKey, { 
        data: buffer, 
        metadata: {
          ...metadata,
          lastModified: Date.now(),
        }
      });

      return buffer;
    } finally {
      AssetLoader.loadingQueue.delete(cacheKey);
    }
  }

  static async fetchWithRetry(
    url: string, 
    metadata: AssetMetadata, 
    options: LoaderOptions
  ): Promise<Response> {
    const maxRetries = options.retries ?? LOADER_CONFIG.maxRetries;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await fetch(url, {
          headers: {
            'If-None-Match': metadata.etag,
            'If-Modified-Since': new Date(metadata.lastModified).toUTCString(),
          },
          signal: AbortSignal.timeout(options.timeout || LOADER_CONFIG.defaultTimeout),
        });

        if (response.ok) return response;
        
        throw AssetLoader.createAssetError(
          `Failed to load asset: ${response.statusText}`,
          metadata.id,
          `HTTP_${response.status}`
        );
      } catch (error) {
        attempt++;
        if (attempt === maxRetries) throw error;
        await new Promise(resolve => setTimeout(resolve, LOADER_CONFIG.retryDelay));
      }
    }

    throw AssetLoader.createAssetError(
      'Max retries exceeded',
      metadata.id,
      'MAX_RETRIES_EXCEEDED'
    );
  }

  static getCachedAsset(key: string, metadata: AssetMetadata): Buffer | null {
    const cached = AssetLoader.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.metadata.lastModified > LOADER_CONFIG.cacheDuration) {
      AssetLoader.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  static clearCache() {
    AssetLoader.cache.clear();
  }
}

export function getAssetLoader(environment: Environment = ENVIRONMENT): AssetLoader {
  return new AssetLoader(environment);
}
