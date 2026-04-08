// @/components/NFTDisplay/props.tsx

import { Address } from "viem";
import type { BackgroundAsset, OverlayAsset } from "../assets/types/asset.types";
interface NFTDisplayerProps {}

export enum ImageStates {
  Original = 'Original',      // Always first state
  Backgroundless = 'Backgroundless', // Base for modifications
  NewBackground = 'NewBackground',   // Background changed
  Overlayed = 'Overlayed',    // Overlays added
  Modified = 'Modified'       // Both background and overlays
}

interface ImageStateConfig {
  getUrl: (token: TokenMetadata) => string;
  allowsBackground: boolean;
  allowsOverlays: boolean;
  isBase: boolean;
}

export const STATE_CONFIG: Record<ImageStates, ImageStateConfig> = {
  [ImageStates.Original]: {
    getUrl: (token) => token.imageUrl,
    allowsBackground: false,
    allowsOverlays: false,
    isBase: true
  },
  [ImageStates.Backgroundless]: {
    getUrl: (token) => {
      const bucket =
        (globalThis as any)?.importMeta?.env?.S3_BUCKET ||
        (typeof process !== "undefined" ? (process as any).env?.S3_BUCKET : "") ||
        "";
      return `${bucket}/${token.tokenId}.png`;
    },
    allowsBackground: true,
    allowsOverlays: true,
    isBase: true
  },
  [ImageStates.NewBackground]: {
    getUrl: () => '',
    allowsBackground: true,
    allowsOverlays: true,
    isBase: false
  },
  [ImageStates.Overlayed]: {
    getUrl: () => '',
    allowsBackground: false,
    allowsOverlays: true,
    isBase: false
  },
  [ImageStates.Modified]: {
    getUrl: () => '',
    allowsBackground: true,
    allowsOverlays: true,
    isBase: false
  }
};

interface TokenState {
  currentState: ImageStates;
  background?: string;
  overlays: OverlayAsset[];
  needsProcessing: boolean;
}

interface ImageStateType {
  [key: number]: ImageState;
}

type ImageState = (typeof ImageStates)[keyof typeof ImageStates];
interface SaveProps {
  index: number
  dataUrl: string;
  background: string;
  overlays: OverlayAsset[];
}

interface TokenMetadata {
  tokenId: bigint;
  imageUrl: string;
  metadata: Meta;
  overlayImages?: string[]; // Add this line
}

interface Meta {
    name: string;
    description: string;
    edition: number;
    attributes: Attributes[];
};




interface SelectableNFTOverlaysProps {
  tokenId: number;
  tokenMetadata: TokenMetadata;
  baseImageUrl: string;
  overlays: OverlayAsset[];
  attributes: Attributes[];
  onSave: ({ dataUrl }: { dataUrl: string }) => void;
  selectedBackground?: string | null;
  onOverlayChange: (overlay: OverlayAsset) => void;
  backgroundUrl?: string | null;
  isAllowedAddress?: boolean;
}

// Represents a user address with their associated tokens
interface UserTokens {
  address: string; // Ethereum address of the user
  tokens: TokenMeta; // Array of tokens owned by the user
}

interface CanvasRendererProps {
  bglessUrl: string;
  baseImageUrl: string;
  backgroundUrl?: string;
  overlays: string[];
}

type UsersTokenMap = Record<string, TokenMeta>; // Keyed by user address

type Metadata = {
  name: string;
  description?: string;
  edition: number;
  attributes: Attributes[];
};

type Attributes = {
  trait_type: string;
  value: string;
};

type TokenMeta = TokenMetadata[];

interface TokenItemContainerProps {
  index: number;
  address: Address;
  token: {
    tokenId: bigint;
    metadata: TokenMetadata['metadata'];
    imageUrl: string;
  };
  imageState: ImageState;
  priority?: string;
  onSelectToken: (tokenId: number) => void;
  selectedBackground: string | null; // New prop for selected background
  onBackgroundChange: (background: string) => void; // New prop for handling background changes
  onOverlayChange: (overlay: OverlayAsset) => void; // New prop for handling overlay changes
  selectedOverlays?: OverlayAsset[]; // New prop for overlay images
  overlayImages?: OverlayAsset[]; // New prop for overlay images
  toggleState: (stateUpdater: StateUpdater, index: number) => void; // New prop for toggling state
  onSave: ({ dataUrl }: { dataUrl: string }) => void;
  canvasRef: (ref: HTMLCanvasElement | null) => void; // Add this line
  isAllowedAddress?: boolean; // New prop for checking if the address is allowed
  renderMode?: 'css' | 'gif';
  onRenderModeChange?: (mode: 'css' | 'gif') => void;
  debugMode?: boolean;
}
interface TokenItemContainerPropsv2 {
  index: number;
  address: Address;
  token: {
    tokenId: bigint;
    metadata: TokenMetadata['metadata'];
    imageUrl: string;
  };
  imageState: ImageState;
  priority: string;
  onSelectToken: (tokenId: number) => void;
  selectedBackground: BackgroundAsset | null; // New prop for selected background
  onDownload: (index: number, format: 'png' | 'gif') => Promise<void>;
  onDownloadBgLess: (tokenId: number) => Promise<void>;
  onBackgroundChange?: (background: BackgroundAsset) => void; // New prop for handling background changes
  onOverlaysChange?: (overlays: OverlayAsset[]) => void;
  selectedOverlays?: OverlayAsset[]; // New prop for overlay images
  overlayImages?: OverlayAsset[]; // New prop for overlay images
  onReset?: () => void; // New prop for resetting overlay images
  toggleState?: (stateUpdater: StateUpdater, index: number) => void; // New prop for toggling state
  onSave?: ({ dataUrl }: { dataUrl: string }) => void;
  canvasRef?: (ref: HTMLCanvasElement | null) => void; // Add this line
  isAllowedAddress?: boolean; // New prop for checking if the address is allowed
  renderMode?: 'css' | 'gif';
  onRenderModeChange?: (mode: 'css' | 'gif') => void;
  debugMode?: boolean;
}

interface TokenItemProps {
  token: TokenMetadata;
  imageState: ImageState;
  selectedBackground: BackgroundAsset | null;
  selectedOverlays: OverlayAsset[];
  priority: string;
  onSelectToken: (tokenId: number) => void;
  show3d?: boolean;
  //rendererRef?: React.MutableRefObject<typeof NFT3DRenderer | null>;
}

interface TokenItemDebugProps extends TokenItemProps {
  index: number;
  address: Address;
  renderMode: 'css' | 'gif';
  overlayImages: OverlayAsset[];
  onOverlayChange?: (overlay: OverlayAsset) => void;
  onRenderModeChange?: (mode: 'css' | 'gif') => void;
  debugMode?: boolean;
}


interface StateUpdater {
  (updater: (prev: { [key: number]: boolean }) => { [key: number]: boolean }): void;
}

interface UploadedImages {
  [tokenId: number]: string[];
}

interface SelectedBackgrounds {
  [tokenId: number]: string;
}

export interface SelectedOverlays {
  [index: number]: OverlayAsset[];
}

export type {
  SaveProps,
  StateUpdater,
  UploadedImages,
  CanvasRendererProps,
  SelectedBackgrounds,
  TokenItemProps,
  TokenItemDebugProps,
  OverlayAsset,
  SelectableNFTOverlaysProps,
  Attributes,
  Metadata,
  ImageState,
  NFTDisplayerProps,
  TokenMetadata,
  TokenMeta,
  UsersTokenMap,
  UserTokens,
  TokenItemContainerProps,
  TokenItemContainerPropsv2
}
