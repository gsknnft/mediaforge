import { Address } from "viem";
import type { BackgroundAsset, OverlayAsset } from "../assets/types/asset.types";
interface NFTDisplayerProps {
}
export declare enum ImageStates {
    Original = "Original",// Always first state
    Backgroundless = "Backgroundless",// Base for modifications
    NewBackground = "NewBackground",// Background changed
    Overlayed = "Overlayed",// Overlays added
    Modified = "Modified"
}
interface ImageStateConfig {
    getUrl: (token: TokenMetadata) => string;
    allowsBackground: boolean;
    allowsOverlays: boolean;
    isBase: boolean;
}
export declare const STATE_CONFIG: Record<ImageStates, ImageStateConfig>;
type ImageState = (typeof ImageStates)[keyof typeof ImageStates];
interface SaveProps {
    index: number;
    dataUrl: string;
    background: string;
    overlays: OverlayAsset[];
}
interface TokenMetadata {
    tokenId: bigint;
    imageUrl: string;
    metadata: Meta;
    overlayImages?: string[];
}
interface Meta {
    name: string;
    description: string;
    edition: number;
    attributes: Attributes[];
}
interface SelectableNFTOverlaysProps {
    tokenId: number;
    tokenMetadata: TokenMetadata;
    baseImageUrl: string;
    overlays: OverlayAsset[];
    attributes: Attributes[];
    onSave: ({ dataUrl }: {
        dataUrl: string;
    }) => void;
    selectedBackground?: string | null;
    onOverlayChange: (overlay: OverlayAsset) => void;
    backgroundUrl?: string | null;
    isAllowedAddress?: boolean;
}
interface UserTokens {
    address: string;
    tokens: TokenMeta;
}
interface CanvasRendererProps {
    bglessUrl: string;
    baseImageUrl: string;
    backgroundUrl?: string;
    overlays: string[];
}
type UsersTokenMap = Record<string, TokenMeta>;
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
    selectedBackground: string | null;
    onBackgroundChange: (background: string) => void;
    onOverlayChange: (overlay: OverlayAsset) => void;
    selectedOverlays?: OverlayAsset[];
    overlayImages?: OverlayAsset[];
    toggleState: (stateUpdater: StateUpdater, index: number) => void;
    onSave: ({ dataUrl }: {
        dataUrl: string;
    }) => void;
    canvasRef: (ref: HTMLCanvasElement | null) => void;
    isAllowedAddress?: boolean;
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
    selectedBackground: BackgroundAsset | null;
    onDownload: (index: number, format: 'png' | 'gif') => Promise<void>;
    onDownloadBgLess: (tokenId: number) => Promise<void>;
    onBackgroundChange?: (background: BackgroundAsset) => void;
    onOverlaysChange?: (overlays: OverlayAsset[]) => void;
    selectedOverlays?: OverlayAsset[];
    overlayImages?: OverlayAsset[];
    onReset?: () => void;
    toggleState?: (stateUpdater: StateUpdater, index: number) => void;
    onSave?: ({ dataUrl }: {
        dataUrl: string;
    }) => void;
    canvasRef?: (ref: HTMLCanvasElement | null) => void;
    isAllowedAddress?: boolean;
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
    (updater: (prev: {
        [key: number]: boolean;
    }) => {
        [key: number]: boolean;
    }): void;
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
export type { SaveProps, StateUpdater, UploadedImages, CanvasRendererProps, SelectedBackgrounds, TokenItemProps, TokenItemDebugProps, OverlayAsset, SelectableNFTOverlaysProps, Attributes, Metadata, ImageState, NFTDisplayerProps, TokenMetadata, TokenMeta, UsersTokenMap, UserTokens, TokenItemContainerProps, TokenItemContainerPropsv2 };
//# sourceMappingURL=props.d.ts.map