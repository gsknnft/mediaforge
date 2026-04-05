type BackgroundCategory = 'Animated' | 'Static' | 'Pixel Art' | 'Special';
type OverlayCategory = 'Special Effects' | 'Borders' | 'Frames' | 'Clothes' | 'Head' | 'Body' | 'Eyes' | 'Extra' | 'Accessories' | 'All';
type OverlayTraits = Record<string, string[]>;
type BGCategories = BackgroundCategory | 'All';
interface ImageVals {
    name: string;
    url: string;
    value: string;
    dims?: {
        x?: number;
        y?: number;
        width?: number;
        height?: number;
    };
}
interface EnhancedImageVals extends ImageVals {
    category?: BackgroundCategory | OverlayCategory;
    tags?: string[];
}
interface Overlay extends EnhancedImageVals {
    attribute: string;
    disAllowedTraits: {
        [key: string]: string[];
    };
}
interface EnhancedOverlay extends Overlay {
    compatibilityRules?: {
        required?: OverlayTraits;
        forbidden?: OverlayTraits;
    };
}
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
export type { ImageVals, EnhancedImageVals, Overlay, EnhancedOverlay, OverlayCategory, OverlayTraits, BackgroundCategory, BGCategories };
export { overlayImages, backgroundImages, createOverlay, overlayArray };
//# sourceMappingURL=assetSource.d.ts.map