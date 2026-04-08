
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getAssetRegistry } from "../services/AssetRegistry";
import { BackgroundAsset, OverlayAsset, BackgroundCategory, OverlayCategory } from '@/types';

const assetRegistry = getAssetRegistry();

// Use single hook pattern
export function useAssets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [assets, setAssets] = useState<{
    backgrounds: BackgroundAsset[];
    overlays: OverlayAsset[];
  }>({ backgrounds: [], overlays: [] });
  const cache = useMemo(() => new Map(), []);

  // Implement cleanup
  useEffect(() => {
    return () => {
      // Clear cached resources
      cache.forEach((value) => {
        if (typeof value === 'string') {
          URL.revokeObjectURL(value);
        }
      });
      cache.clear();
    };
  }, []);

  // Memory-efficient asset loading
  const loadAsset = useCallback(async (url: string) => {
    if (cache.has(url)) {
      return cache.get(url);
    }

    const response = await fetch(url);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    cache.set(url, objectUrl);
    return objectUrl;
  }, [cache]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const { backgrounds, overlays} = await assetRegistry.getAssets();
        setAssets({
          backgrounds: backgrounds,
          overlays: overlays
        });
        setError(null);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };
    fetchAssets();
  }, []);

  return {
    ...assets,
    loading,
    error,
    reload: () => assetRegistry.clearCache()
  };
}
