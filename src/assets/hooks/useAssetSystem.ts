import { useState, useEffect, useMemo } from 'react';
import { AssetRegistry, assetRegistry } from '../services/AssetRegistry';
import { AssetLoader } from '../services/AssetLoader';
import { BackgroundAsset, OverlayAsset, AssetCat, AssetCategories, AssetCategory } from '../types/asset.types';

interface UseAssetSystemProps {
  category: AssetCategories;
  tag?: string;
  type: AssetCat | AssetCategories;
  assetName?: string;
}
interface AssetSystemOutput {
    assets: {
      backgrounds: BackgroundAsset[];
      overlays: OverlayAsset[];
    },
    currentAsset:  Buffer<ArrayBufferLike> | null,
    loading: boolean,
    error: Error | null,
    registry: AssetRegistry,
    loader: AssetLoader
  };

  
export const useAssetSystem = ({ category, tag, type = 'All', assetName }: UseAssetSystemProps): AssetSystemOutput => {
  const [backgrounds, setBackgrounds] = useState<BackgroundAsset[]>([]);
  const [overlays, setOverlays] = useState<OverlayAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentAsset, setCurrentAsset] = useState<Buffer | null>(null);

  // Memoized filtered assets
  const filteredAssets = useMemo(() => {
    let filteredBgs = backgrounds;
    let filteredOverlays = overlays;

    if (category && category !== 'All') {  // Only filter if category is specified and not 'All'
      filteredBgs = filteredBgs.filter(bg => bg.category === category);
      filteredOverlays = filteredOverlays.filter(overlay => overlay.category === category);
    }

    if (tag) {
      filteredBgs = filteredBgs.filter(bg => bg.tags?.includes(tag));
      filteredOverlays = filteredOverlays.filter(overlay => overlay.tags?.includes(tag));
    }

    return {
      backgrounds: filteredBgs,
      overlays: filteredOverlays
    };
  }, [backgrounds, overlays, category, tag]);

  // Load asset registry data
  useEffect(() => {
    const loadAssets = async () => {
      try {
        // Always load both types for 'All'
        if (type === 'All') {
          setBackgrounds(await assetRegistry.getAllBackgrounds());
          setOverlays(await assetRegistry.getAllOverlays());
        } else if (type === 'background' || type === 'backgrounds') {
          setBackgrounds(await assetRegistry.getAllBackgrounds());
        } else if (type === 'overlay' || type === 'overlays') {
          setOverlays(await assetRegistry.getAllOverlays());
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadAssets();
  }, [type]);

  // Load specific asset if assetName is provided
  useEffect(() => {
    if (!assetName) return;

    const loadSpecificAsset = async () => {
      try {
        setLoading(true);
        const asset = (type === 'background' 
          ? await assetRegistry.getBackground(assetName) as BackgroundAsset
          : await assetRegistry.getOverlay(assetName) as OverlayAsset);

        if (!asset) throw new Error(`Asset ${assetName} not found`);

        const assetData = await AssetLoader.load(
          asset.url,
          {
            id: asset.name,
            name: asset.name,
            format: asset.format,
            category: asset.category,
            version: asset.version,
            etag: '',
            lastModified: asset.lastModified,
            url: asset.url,
            type: type as AssetCat,
            fileName: asset.fileName,
            path: asset.path,
          }
        );

        setCurrentAsset(assetData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    loadSpecificAsset();
  }, [assetName, type]);

  return {
    assets: filteredAssets,
    currentAsset,
    loading,
    error,
    registry: assetRegistry,
    loader: new AssetLoader()
  };
};
