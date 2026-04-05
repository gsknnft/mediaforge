import { 
  BackgroundAsset, 
  OverlayAsset, 
  BackgroundCategory, 
  OverlayCategory,
  Environment,
  AssetMetadata
} from '../types/asset.types';
import { 
  BASE_ASSET_PATH, 
  API_ENDPOINTS,
  ENVIRONMENT,
  API_CONFIG ,
} from '../config/asset.config';

import {
  BackgroundRegistry,
  OverlayRegistry
} from '../source/SourceRegistry';

export function getTimestamp(date?: string | Date): number {
  if (!date) return Date.now();
  return typeof date === 'string' ? new Date(date).getTime() : date.getTime();
}

export function buildAssetPath(assetType: string, category: string, fileName: string): string {
    return `${BASE_ASSET_PATH}/${assetType}/${category}/${fileName}`;
  }
  

export class AssetRegistry {
  private static instance: AssetRegistry;
  private backgroundCache: Map<string, BackgroundAsset>;
  private overlayCache: Map<string, OverlayAsset>;
  private environment: Environment;
  private fetchPromises: Map<string, Promise<any>>;
  private initializedFromRegistry: boolean = false;

  private constructor() {
    this.backgroundCache = new Map(Object.entries(BackgroundRegistry));
    this.overlayCache = new Map(Object.entries(OverlayRegistry));
    this.environment = ENVIRONMENT;
    this.fetchPromises = new Map();
    this.fetchUpdates();
    this.initializeFromRegistry();

  }  
  
  private initializeFromRegistry() {
    if (this.initializedFromRegistry) return;
    
    // Add registry items with their IDs as keys
    Object.values(BackgroundRegistry).forEach(bg => {
      const id = this.getAssetId(bg);
      this.backgroundCache.set(id, { ...bg, source: 'registry' });
    });

    Object.values(OverlayRegistry).forEach(overlay => {
      const id = this.getAssetId(overlay);
      this.overlayCache.set(id, { ...overlay, source: 'registry' });
    });

    this.initializedFromRegistry = true;
    console.log('📦 Initialized from registry:', {
      backgrounds: this.backgroundCache.size,
      overlays: this.overlayCache.size
    });
  }

  public async getAssets(): Promise<{ backgrounds: BackgroundAsset[], overlays: OverlayAsset[] }> {
    return {
      backgrounds: Array.from(this.backgroundCache.values()),
      overlays: Array.from(this.overlayCache.values())
    };
  }

  private getAssetId(asset: BackgroundAsset | OverlayAsset): string {
    // Create a more unique ID that includes the source path
    const mainURL = (globalThis as any)?.importMeta?.env?.DEV
      ? "http://localhost:3000"
      : "https://apefathers.com";
    const baseName = asset.id || `${asset.type}-${asset.name.toLowerCase().replace(/\s+/g, '-')}`;
    const urlPath = new URL(asset.url, mainURL).pathname;
    return `${baseName}-${urlPath}`;
  }

  private async fetchUpdates() {
    if (this.backgroundCache.size > 0 && this.overlayCache.size > 0) {
      console.log("🚀 Cache already populated, skipping fetch.");
      return;
    }
    console.log("🔄 Fetching new asset updates...");
    
    const [backgrounds, overlays] = await Promise.all([
      this.fetchBackgrounds(),
      this.fetchOverlays()
    ]);
  
    backgrounds.forEach(bg => this.backgroundCache.set(this.getAssetId(bg), bg));
    overlays.forEach(overlay => this.overlayCache.set(this.getAssetId(overlay), overlay));
  }
  

  private async fetchBackgrounds(): Promise<BackgroundAsset[]> {
    try {
      console.log('📊 Environment:', this.environment);
      console.log('💾 Cache size:', this.backgroundCache.size);
  
      const url = API_ENDPOINTS.getBackgrounds();
      console.log('🔍 Fetching backgrounds from:', url);
  
      const response = await this.fetchWithCache(url, () => 
        this.fetchWithTimeout(url, {
          headers: {
            ...API_CONFIG.headers,
            'X-Asset-Environment': this.environment
          }
        })
      );
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const backgrounds = await response.json();
  
      // Filter out duplicates based on ID
      const uniqueBackgrounds = backgrounds.filter((bg: BackgroundAsset) => {
        const id = this.getAssetId(bg);
        return !this.backgroundCache.has(id) || bg.lastModified > (this.backgroundCache.get(id)?.lastModified || 0);
      });
  
      console.log('✅ Unique backgrounds:', uniqueBackgrounds.length);
      return uniqueBackgrounds;
    } catch (error) {
      console.warn('⚠️ Background update failed:', error);
      return [];
    }
  }
  

  private async fetchOverlays(): Promise<OverlayAsset[]> {
    try {
      console.log('📊 Environment:', this.environment);
      console.log('💾 Cache size:', this.overlayCache.size);
  
      const url = API_ENDPOINTS.getOverlays();
      console.log('🔍 Fetching overlays from:', url);
  
      const response = await this.fetchWithCache(url, () => 
        this.fetchWithTimeout(url, {
          headers: {
            ...API_CONFIG.headers,
            'X-Asset-Environment': this.environment
          }
        })
      );
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      const overlays = await response.json();
      console.log('✅ Fetched overlays:', overlays.length);
  
      // Ensure we only add unique overlays to cache
      const uniqueOverlays = overlays.filter((overlay: OverlayAsset) => {
        const existingOverlay = Array.from(this.overlayCache.values())
          .find(cached => cached.url === overlay.url);
        return !existingOverlay;
      });
  
      console.log('✅ Unique overlays:', uniqueOverlays.length);
      return uniqueOverlays;
    } catch (error) {
      console.warn('⚠️ Overlay update failed:', error);
      return [];
    }
  }
  

  static getInstance(): AssetRegistry {
    if (!this.instance) {
      this.instance = new AssetRegistry();
    }
    return this.instance;
  }

  async getAllBackgrounds(): Promise<BackgroundAsset[]> {
    const uniqueMap = new Map<string, BackgroundAsset>();
    
    Array.from(this.backgroundCache.values()).forEach(bg => {
      const key = this.getAssetId(bg);
      if (!uniqueMap.has(key) || bg.source === 'api') {
        uniqueMap.set(key, bg);
      }
    });

    return Array.from(uniqueMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getAllOverlays(): Promise<OverlayAsset[]> {
    const uniqueMap = new Map<string, OverlayAsset>();
    
    Array.from(this.overlayCache.values()).forEach(overlay => {
      const key = this.getAssetId(overlay);
      if (!uniqueMap.has(key) || overlay.source === 'api') {
        uniqueMap.set(key, overlay);
      }
    });

    return Array.from(uniqueMap.values())
      .sort((a, b) => a.name.localeCompare(b.name));
  }


  private async fetchWithCache<T>(key: string, fetchFn: () => Promise<T>): Promise<T> {
    if (this.fetchPromises.has(key)) {
      console.log(`⏳ Returning in-flight request for ${key}`);
      return this.fetchPromises.get(key) as Promise<T>;
    }
  
    const promise = fetchFn().finally(() => this.fetchPromises.delete(key));
    this.fetchPromises.set(key, promise);
    
    return promise;
  }
  
  
  async fetchAssetMetadata(id: string): Promise<BackgroundAsset | OverlayAsset> {
    try {
      const response = await this.fetchWithCache(id, () =>
        fetch(API_ENDPOINTS.getMetadata(id), {
          headers: {
            ...API_CONFIG.headers,
            'X-Asset-Environment': this.environment
          }
        })
      );
      

      if (!response.ok) {
        throw new Error(`Failed to fetch asset metadata: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching asset metadata:', error);
      throw error;
    }
  }

  private async fetchWithTimeout(url: string, options: RequestInit, timeout = 30000): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`⌛ Request timeout for ${url}`);
      controller.abort();
    }, timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...options.headers,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`⚠️ Request aborted for ${url} after ${timeout}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getBackground(name: string): Promise<BackgroundAsset> {
    const cached = this.backgroundCache.get(name);
    if (cached) return cached;

    try {
      const asset = await this.fetchAssetMetadata(name) as BackgroundAsset;
      if (this.isBackgroundAsset(asset)) {
        this.backgroundCache.set(name, asset);
        return asset;
      }
    } catch (error) {
      console.error(`Error fetching background ${name}:`, error);
    }
    return BackgroundRegistry[name];
  }

  async getOverlay(name: string): Promise<OverlayAsset> {
    const cached = this.overlayCache.get(name);
    if (cached) return cached;

    try {
      const asset = await this.fetchAssetMetadata(name) as OverlayAsset;
      if (this.isOverlayAsset(asset)) {
        this.overlayCache.set(name, asset);
        return asset;
      }
    } catch (error) {
      console.error(`Error fetching overlay ${name}:`, error);
    }
    return OverlayRegistry[name];
  }

async getBackgroundsByCategory(category: BackgroundCategory): Promise<BackgroundAsset[]> {
  const cachedBackgrounds = await this.getAllBackgrounds();
  if (cachedBackgrounds.length) {
    console.log(`✅ Using cached backgrounds for category: ${category}`);
    return cachedBackgrounds.filter(bg => bg.bgCategory === category);
  }

  console.log(`🔍 Fetching backgrounds for category: ${category}`);
  return (await this.getAllBackgrounds()).filter(bg => bg.bgCategory === category);
}

  async getOverlaysByCategory(category: OverlayCategory): Promise<OverlayAsset[]> {
    const cachedOverlays = await this.getAllOverlays();
    if (cachedOverlays.length) {
      console.log(`✅ Using cached backgrounds for category: ${category}`);
      return cachedOverlays.filter(overlay => overlay.overlayCategory === category);
    }
  
    console.log(`🔍 Fetching backgrounds for category: ${category}`);
    return (await this.getAllOverlays()).filter(overlay => overlay.overlayCategory === category);
  }
  

  private isBackgroundAsset(asset: AssetMetadata): asset is BackgroundAsset {
    return asset && asset.type === 'background' && 'bgCategory' in asset;
  }

  private isOverlayAsset(asset: AssetMetadata): asset is OverlayAsset {
    return asset && asset.type === 'overlay' && 'overlayCategory' in asset;
  }

  clearCache() {
    this.backgroundCache.clear();
    this.overlayCache.clear();
  }
}

export const assetRegistry = AssetRegistry.getInstance();
