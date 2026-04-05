import { 
  BackgroundAsset, 
  OverlayAsset,
  SpecialAsset
} from '../types/asset.types';

import { 
  BASE_ASSET_PATH, 
  ASSET_PATHS
} from '../config/asset.config';

export function getTimestamp(date?: string | Date): number {
  if (!date) return Date.now();
  return typeof date === 'string' ? new Date(date).getTime() : date.getTime();
}

export function buildAssetPath(assetType: string, category: string, fileName: string): string {
    return `${BASE_ASSET_PATH}/${assetType}/${category}/${fileName}`;
  }

export const SpecialRegistry: Record<string, SpecialAsset> = {
  "Circle Frame": {
    name: 'Circle Frame',
    path: ASSET_PATHS.special,
    url: `${ASSET_PATHS.special}/circle_frame.gif`,
    format: 'gif',
    type: 'overlay',
    //overlayCategory: 'Special Effects',
    fileName: 'circle_frame.gif',
    version: '1.0',
    tags: ['fire frame'],
    access: 'public',
    etag: '',
    lastModified: getTimestamp(),
    hash: '',
    id: 'fireframe',
    specialCategory: 'Frames',
    //attribute: '',
    //traits: {},
    //disAllowedTraits: {},
    category: "overlays",
    validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true },
  },
};

export const BackgroundRegistry: Record<string, BackgroundAsset> = {
    'OG Fire': {
      id: 'og-fire',
      name: 'OG Fire Background',
      url: `${ASSET_PATHS.backgrounds.animated}/bg.gif`,
      format: 'gif',
      type: 'background',
      bgCategory: 'Animated',
      fileName: 'bg.gif',
      path: ASSET_PATHS.backgrounds.animated,
      version: '1.0',
      tags: ['fire', 'action', 'original'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      category: 'backgrounds',
      validation: { 
        isValid: true, 
        message: '', 
        maxSize: 15 * 1024 * 1024, // 15MB for GIFs
        allowedFormats: ['gif'], 
        allowCompression: true 
      }
    },
    'Fire': {
      id: 'fire',
      name: 'Fire Background',
      url: `${ASSET_PATHS.backgrounds.animated}/bg2.gif`,
      format: 'gif',
      type: 'background',
      bgCategory: 'Animated',
      fileName: 'bg2.gif',
      path: ASSET_PATHS.backgrounds.animated,
      version: '1.0',
      tags: ['fire', 'action', 'flame'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      category: 'backgrounds',
      validation: { 
        isValid: true, 
        message: '', 
        maxSize: 15 * 1024 * 1024,
        allowedFormats: ['gif'], 
        allowCompression: true 
      }
    },
    'Winter': {
      id: 'winter',
      name: 'Winter Background',
      url: `${ASSET_PATHS.backgrounds.animated}/winter_bg.gif`,
      format: 'gif',
      type: 'background',
      bgCategory: 'Animated',
      fileName: 'winter_bg.gif',
      path: ASSET_PATHS.backgrounds.animated,
      version: '1.0',
      tags: ['winter', 'snow', 'cold'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      category: 'backgrounds',
      validation: { 
        isValid: true, 
        message: '', 
        maxSize: 20 * 1024 * 1024,
        allowedFormats: ['gif'], 
        allowCompression: true 
      }
    },
    'Garage': {
      name: 'Garage Background',
      url: `${ASSET_PATHS.backgrounds.static}/garage.png`,
      format: 'png',
      type: 'background',
      bgCategory: 'Static',
      fileName: 'garage.png',
      path: ASSET_PATHS.backgrounds.static,
      version: '1.0',
      tags: ['home', 'workshop'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(new Date()),
      hash: '',
      id: 'garage',
      category: 'backgrounds',
      validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['png'], allowCompression: true }
  },
  'Snowy Background': {
  name: 'Snowy Background',
    url: `${ASSET_PATHS.backgrounds.static}/snowy_bg.jpg`,
    format: 'jpg',
      type: 'background',
      bgCategory: 'Static',
      fileName: 'snowy_bg.jpg',
      path: ASSET_PATHS.backgrounds.static,
      version: '1.0',
      tags: ['winter', 'peaceful'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(new Date()),
      id: 'snowy',
      category: 'backgrounds',
      validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['jpg'], allowCompression: true }
  },
  'Backyard Background': {
      name: 'Backyard Background',
      url: `${ASSET_PATHS.backgrounds.pixel}/backyardpxl.gif`,
      format: 'gif',
      type: 'background',
      bgCategory: 'Pixel Art',
      fileName: 'backyardpxl.gif',
      path: ASSET_PATHS.backgrounds.pixel,
      version: '1.0',
    tags: ['outdoor', 'nature'],
    access: 'public',
    etag: '',
    lastModified: getTimestamp(),
    id: 'backyard',
    category: 'backgrounds',
    validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true }
  },
    'Path Background': {
      name: 'Path Background',
      url: `${ASSET_PATHS.backgrounds.pixel}/pixel_kawai_bg.gif`,
      format: 'gif',
      type: 'background',
      bgCategory: 'Pixel Art',
      fileName: 'pixel_kawai_bg.gif',
      path: ASSET_PATHS.backgrounds.pixel,
      version: '1.0',
      tags: ['trail', 'kawaii'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      id: 'path',
      category: 'backgrounds',
      validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true }
  },
   'Xmas Pixel Background':{
    name: 'Xmas Pixell Background',
    url: `${ASSET_PATHS.backgrounds.pixel}/xmas_pixel_bg.gif`,
    format: 'gif',
    type: 'background',
    bgCategory: 'Pixel Art',
    fileName: 'xmas_pixel_bg.gif',
    path: ASSET_PATHS.backgrounds.animated,
    version: '1.0',
    tags: ['snow', 'cold'],
    access: 'public',
    etag: '',
    lastModified: getTimestamp(new Date()),
    id: 'xmas-pixel',
    category: 'backgrounds',
    validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true }
  },
  "Gold" : {
    name: 'Gold Background',
    url: `${ASSET_PATHS.backgrounds.animated}/gold.gif`,
    format: 'gif',
    type: 'background',
    bgCategory: 'Animated',
    fileName: 'gold.gif',
    path: ASSET_PATHS.backgrounds.animated,
    version: '1.0',
    tags: ['gold', 'shiny'],
    access: 'public',
    etag: '',
    lastModified: getTimestamp(),
    id: 'gold',
    category: 'backgrounds',
    validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true },
    allowedTokenIds: [1]
  },
  'Retro Sunset' : {
    name: 'Retro Sunset Background',
    url: `${ASSET_PATHS.backgrounds.animated}/retro_sun.gif`,
    format: 'gif',
    type: 'background',
    bgCategory: 'Animated',
    fileName: 'retro_sun.gif',
    path: ASSET_PATHS.backgrounds.animated,
    version: '1.0',
    tags: ['sunset', 'retro'],
    access: 'public',
    etag: '',
    lastModified: getTimestamp(),
    id: 'retro-sunset',
    category: 'backgrounds',
    validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true }
  },
  'Retro Sunset SideScroll': {
    name: 'Retro Sunset SideScroll Background',
    url: `${ASSET_PATHS.backgrounds.animated}/retro_sun_ss.gif`,
    format: 'gif',
    type: 'background',
    bgCategory: 'Animated',
    fileName: 'retro_sun_ss.gif',
    path: ASSET_PATHS.backgrounds.animated,
    version: '1.0',
    tags: ['sunset', 'retro', 'scroll'],
    access: 'public',
    etag: '',
    lastModified: getTimestamp(),
    id: 'retro-sunset-ss',
    category: 'backgrounds',
    validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true }
  },
  'Pixel Night' : {
      name: 'Pixel Night Background',
      url: `${ASSET_PATHS.backgrounds.pixel}/pixel_night_bg.gif`,
      format: 'gif',
      type: 'background',
      bgCategory: 'Pixel Art',
      fileName: 'pixel_night_bg.gif',
      path: ASSET_PATHS.backgrounds.pixel,
      version: '1.0',
      tags: ['night', 'dark'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      id: 'pixel-night',
      category: 'backgrounds',
      validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['gif'], allowCompression: true }
  },
  };
  
  export const OverlayRegistry: Record<string, OverlayAsset> = {   
    'Santa Hat': {
      id: 'santa-hat',
      name: 'Santa Hat',
      url: `${ASSET_PATHS.overlays.head}/SantaHat.png`,
      format: 'png',
      type: 'overlay',
      overlayCategory: 'Head',
      attribute: 'Head',
      fileName: 'SantaHat.png',
      path: ASSET_PATHS.overlays.head,
      version: '1.0',
      category: 'overlays',
      disAllowedTraits: {
        Head: [ 'Santa Hat', 'Beer Hat', 'Bed Head', 'Bucket Hat', 'Hardhat', 'Chef Hat', 'Hockey Helmet']
      },
      traits: {
        Head: ['Santa Hat']
      },
      tags: ['holiday', 'christmas', 'winter'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      validation: {
        isValid: true,
        message: '',
        maxSize: 5 * 1024 * 1024, // 5MB for PNGs
        allowedFormats: ['png', 'webp'],
        allowCompression: true
      }
    },
    'Xmas Sweater': {
      id: 'xmas-sweater',
      name: 'Xmas Sweater',
      url: `${ASSET_PATHS.overlays.clothes}/XMas_Sweater.png`,
      format: 'png',
      type: 'overlay',
      overlayCategory: 'Clothes',
      attribute: 'Clothes',
      fileName: 'XMas_Sweater.png',
      path: ASSET_PATHS.overlays.clothes,
      version: '1.0',
      category: 'overlays',
      disAllowedTraits: {
        Clothes: [ 'Baby Carlos', 'DadBod', 'Xmas Sweater', 'Holiday Sweater', '#1 Dad Hoodie']
      },
      traits: {
        Clothes: ['Xmas Sweater']
      },
      tags: ['holiday', 'christmas', 'winter'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      validation: {
        isValid: true,
        message: '',
        maxSize: 5 * 1024 * 1024,
        allowedFormats: ['png', 'webp'],
        allowCompression: true
      }
    },
    'Holiday Sweater': {
      id: 'holiday-sweater',
      name: 'Holiday Sweater',
      path: ASSET_PATHS.overlays.clothes,
      url: `${ASSET_PATHS.overlays.clothes}/Holiday_Sweater.png`,
      format: 'png',
      category: 'overlays',
      type: 'overlay',
      overlayCategory: 'Clothes',
      attribute: 'Clothes',
      fileName: 'Holiday_Sweater.png',
      version: '1.0',
      disAllowedTraits: { 
        Clothes: ['XMas Sweater', 'Holiday Sweater', '#1 Dad Hoodie', 'Baby Carlos', 'DadBod'] 
      },
      traits: { 
        Clothes: ['Holiday Sweater'] 
      },
      tags: ['holiday', 'christmas'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
  
    },
    '#1 Dad Hoodie': {
      name: '#1 Dad Hoodie',
      path: ASSET_PATHS.overlays.clothes,
      url: `${ASSET_PATHS.overlays.clothes}/DadHoodie.png`,
      format: 'png',
      type: 'overlay',
      overlayCategory: 'Clothes',
      attribute: 'Clothes',
      fileName: 'DadHoodie.png',
      version: '1.0',
      disAllowedTraits: { 
        Clothes: ['T-Shirt', 'Hoodie', 'Jacket', 'Sweater'] 
      },
      traits: { 
        Clothes: ['#1 Dad Hoodie'] 
      },
      tags: ['dad', 'father'],
      access: 'public',
      etag: '',
      lastModified: getTimestamp(),
      hash: '',
      id: 'dad-hoodie',
      category: "overlays",
      validation: { isValid: true, message: '', maxSize: 5242880, allowedFormats: ['png', 'jpg', 'jpg', 'gif'], allowCompression: true },
      },
  };
  