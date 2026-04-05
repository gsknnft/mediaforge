// 'use client'

// import { useState, useEffect } from 'react';
// import { assetLoader } from '../services/AssetLoader';
// import { BASE_ASSET_PATH } from '../config/asset.config';
// import { AssetMetadata, AssetFormat, AssetCat, AssetCategory } from '../types/asset.types';

// interface UseAssetManagementProps {
//   assetFormat: AssetFormat;
//   assetType: AssetCat;
//   assetName: string;
//   category: AssetCategory;
//   cacheAsset?: boolean;
// }

// export const useAssetManagement = ({ 
//   assetFormat,
//   assetType, 
//   assetName, 
//   category,
//   cacheAsset = true 
// }: UseAssetManagementProps) => {
//   const [asset, setAsset] = useState<Buffer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<Error | null>(null);
//   function buildAssetPath(assetType: AssetCat, category: AssetCategory, fileName: string): string {
//     return `${BASE_ASSET_PATH}/${assetType}/${fileName}.${assetFormat}`;
//   }
  
//   useEffect(() => {
//     if (!assetType || !assetName) return;
//     let metadata: AssetMetadata;
//     const loadAsset = async () => {
//       try {
//         const assetPath = buildAssetPath(assetType, category, assetName);
//         setLoading(true);
//         metadata = {
//           id: assetName,
//           name: assetName,
//           format: assetFormat,
//           category: category,
//           version: '1.0',
//           etag: '',
//           lastModified: Date.now(),
//           url: assetPath,
//           type: assetType,
//           fileName: assetName,
//           path: assetPath,
//         };

//         const assetData = await assetLoader.load(assetPath, metadata, {
//           cache: cacheAsset,
//         });

//         setAsset(assetData);
//       } catch (err) {
//         setError(err as Error);
//         console.error('Asset loading error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadAsset();
//   }, [assetType, assetName, category, cacheAsset]);

//   return { 
//     asset, 
//     loading, 
//     error,
//     reload: () => {
//       setError(null);
//       setLoading(true);
//       assetLoader.clearCache();
//     }
//   };
// };