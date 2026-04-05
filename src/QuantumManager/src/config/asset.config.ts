import { BaseURL } from './constants';
import { Environment, QValidation, QType } from '../types/quantum.types';
import { getEnvMode, getEnvString, isDevMode } from "../../../utils/env";
// import * as qConvert from '../../../../qconvertX'


export const ENVIRONMENT: Environment = (getEnvMode() as Environment) || "development";

const isDev = isDevMode();
export const API_CONFIG = {
  baseUrl: isDev ? 'http://localhost:3000/api' : '/app/app/api',
  endpoints: {
    backgrounds: '/assets/backgrounds',
    overlays: '/assets/overlays',
    metadata: '/assets/metadata',
    validate: '/assets/validate',
    categories: '/assets/categories',
    fields: '/fields',
    quantum: '/qvera',
    signal: '/qvera/signal',
    aiStyle: '/ai-style'
  },
  headers: {
    'Content-Type': 'application/json',
    'X-Q-Version': '1.0',
  }
};

export const ASSET_ENV_CONFIG = {
  development: {
    apiUrl: '', // Empty string will use relative URLs in development
    assetUrl: '/_assets',
    cacheDuration: 300000,
  },
  staging: {
    apiUrl: getEnvString("NEXT_PUBLIC_API_URL", "http://localhost:3000"),
    assetUrl: getEnvString("NEXT_PUBLIC_Q_URL", "http://localhost:3000/_assets"),
    cacheDuration: 1800000,
  },
  production: {
    apiUrl: getEnvString("NEXT_PUBLIC_API_URL", String(BaseURL)),
    assetUrl: getEnvString("NEXT_PUBLIC_Q_URL", `${BaseURL}/_assets`),
    cacheDuration: 3600000,
  }
};

export const BASE_Q_PATH = isDev ? '/assets' : '/api/_assets';

export const Q_PATHS = {
  backgrounds: {
    animated: `${BASE_Q_PATH}/backgrounds/animated`,
    static: `${BASE_Q_PATH}/backgrounds/static`,
    pixel: `${BASE_Q_PATH}/backgrounds/pixel`
  },
  special: 
   `${BASE_Q_PATH}/overlays/special`,
  overlays: {
    head: `${BASE_Q_PATH}/overlays/head`,
    clothes: `${BASE_Q_PATH}/overlays/clothes`,
    special: `${BASE_Q_PATH}/overlays/special`,
    frames: `${BASE_Q_PATH}/overlays/frames`,
    traits: `${BASE_Q_PATH}/overlays/traits`,
    accessories: `${BASE_Q_PATH}/overlays/accessories`
  }
};

export const CACHE_CONFIG = {
  defaultDuration: 3600,
  overlayDuration: 1800,
  gifDuration: 7200,
  imageDuration: 3600, // Add this line
};

export const Q_VALIDATION: Record<QType, QValidation> = {
  images: {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedFormats: ['png', 'jpg', 'webp'],
    requiredDimensions: {
      width: 2800,
      height: 2800,
      aspectRatio: 1
    },
    allowCompression: true,
    isValid: true,
    message: 'Image validation implemented'
  },
  models: {
    isValid: false,
    message: 'Model validation not implemented',
    maxSize: 100 * 1024 * 1024, // 20MB
    allowedFormats: ['glb', 'gltf'],
    allowCompression: false
  },
  animations: {
    isValid: true,
    message: 'Animation validation implemented',
    maxSize: 50 * 1024 * 1024, // 10MB
    allowedFormats: ['gif'],
    allowCompression: true
  },
  textures: {
    isValid: false,
    message: 'Texture validation not implemented',
    maxSize: 2 * 1024 * 1024, // 2MB
    allowedFormats: ['png', 'jpg'],
    allowCompression: true
  }
};

export const LOADER_CONFIG = {
  defaultTimeout: 30000,
  maxRetries: 3,
  retryDelay: 1000,
  defaultPriority: 'medium' as const,
  chunkSize: 1024 * 1024, // 1MB
  maxConcurrentLoads: 5,
  cacheDuration: CACHE_CONFIG.defaultDuration
};

// Update API_ENDPOINTS to use API_CONFIG
export const API_ENDPOINTS = {
  getQ: (id: string) => `${API_CONFIG.baseUrl}/assets/${id}`,
  getMetadata: (id: string) => `${API_CONFIG.baseUrl}/assets/metadata/${id}`,
  validateQ: (id: string) => `${API_CONFIG.baseUrl}/assets/validate/${id}`,
  getFields: (id: string) => `${API_CONFIG.baseUrl}/fields/${id}`,
  getState: (id: string) => `${API_CONFIG.baseUrl}/qvera/signal/metadata/${id}`,
  qAnalyze: (id: string) => `${API_CONFIG.baseUrl}/assets/${id}`,
  getBackgrounds: (category?: string) => 
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.backgrounds}${category ? `?category=${category}` : ''}`,
  getOverlays: (category?: string) => 
    `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.overlays}${category ? `?category=${category}` : ''}`,
} as const;

export const SUPPORTED_FORMATS = {
  images: ['.png', '.jpg', '.jpeg', '.webp'],
  models: ['.glb', '.gltf'],
  animations: ['.fbx', '.bvh'],
  textures: ['.png', '.jpg', '.jpeg'],
  data: ['.json', '.csv']
};
