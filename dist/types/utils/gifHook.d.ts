import type { OverlayAsset } from "../assets/types/asset.types";
export declare const useGIFProcessing: () => {
    processGIF: (gifUrl: string, bglessUrl: string, overlays?: OverlayAsset[]) => Promise<Blob>;
    isProcessing: boolean;
    currentBackground: string;
    setCurrentBackground: import("react").Dispatch<import("react").SetStateAction<string>>;
    currentOverlays: OverlayAsset[];
    setCurrentOverlays: import("react").Dispatch<import("react").SetStateAction<OverlayAsset[]>>;
};
//# sourceMappingURL=gifHook.d.ts.map