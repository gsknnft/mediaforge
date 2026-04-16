import { EnhancedImageVals, EnhancedOverlay, OverlayCategory, OverlayTraits } from "@/types/asset.types";
declare const backgroundImages: EnhancedImageVals[];
declare const overlayImages: EnhancedOverlay[];
declare const createOverlay: (props: {
    name: string;
    attribute: string;
    url: string;
    value: string;
    category: OverlayCategory;
    disAllowedTraits: OverlayTraits;
    dims: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    tags: Array<string>;
}) => EnhancedOverlay;
declare const overlayArray: EnhancedOverlay[];
export { overlayImages, backgroundImages, createOverlay, overlayArray };
//# sourceMappingURL=assetSource.d.ts.map