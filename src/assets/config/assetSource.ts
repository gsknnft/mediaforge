import { BackgroundCategory, EnhancedImageVals, EnhancedOverlay, Overlay, OverlayCategory, OverlayTraits } from "@/types/asset.types";

// Organized background data
const backgroundImages: EnhancedImageVals[] = [
  {
    name: 'Fire Background',
    url: './@/assets/backgrounds/bg.gif',
    value: 'Firey ApeFathers',
    category: 'Animated',
    tags: ['fire', 'action']
  },
  {
    name: 'Fire2 Background',
    url: './@/assets/backgrounds/bg3.gif',
    value: 'Firey ApeFathers 2',
    category: 'Animated',
    tags: ['fire', 'action']
  },
  // {
  //   name: 'Space Background',
  //   url: './@/assets/backgrounds/space_bg.gif',
  //   value: 'Space',
  //   category: 'Animated',
  //   tags: ['stars', 'galaxy']
  // },
  {
    name: 'Snowy Background',
    url: './@/assets/backgrounds/snowy_bg.jpg',
    value: 'Snow',
    category: 'Static',
    tags: ['winter', 'peaceful']
  },
  {
    name: 'Garage Background',
    url: './@/assets/backgrounds/garage.png',
    value: 'Garage',
    category: 'Static',
    tags: ['home', 'workshop']
  },
  {
    name: 'Backyard Background',
    url: './@/assets/backgrounds/backyardpxl.gif',
    value: 'Backyard',
    category: 'Pixel Art',
    tags: ['outdoor', 'nature']
  },
  {
    name: 'Path Background',
    url: './@/assets/backgrounds/pixel_kawai_bg.gif',
    value: 'Path',
    category: 'Pixel Art',
    tags: ['trail', 'kawaii']
  },
  {
    name: 'Winter Background',
    url: './@/assets/backgrounds/winter_bg.gif',
    value: 'Winter',
    category: 'Animated',
    tags: ['snow', 'cold']
  },
];


// Organized overlay data
const overlayImages: EnhancedOverlay[] = [
  {
    name: 'Santa Hat',
    url: './@/assets/overlay/traits/head/SantaHat.png',
    value: 'Santa Hat',
    attribute: 'Head',
    category: 'Accessories',
    disAllowedTraits: { Head: ['Beer Hat', 'Bed Head', 'Bucket Hat', 'Hardhat'] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ['holiday', 'christmas']
  },
  {
    name: 'Xmas Sweater',
    url: './@/assets/overlay/traits/clothes/XMas_Sweater.png',
    value: 'Xmas Sweater',
    attribute: 'Clothes',
    category: 'Clothes',
    disAllowedTraits: { Mouth: ['Messy Beard'], Clothes: ['Puffer', 'DadBod'] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ['holiday', 'christmas']
  },
  {
    name: 'Holiday Sweater',
    url: './@/assets/overlay/traits/clothes/Holiday_Sweater.png',
    value: 'Holiday Sweater',
    attribute: 'Clothes',
    category: 'Clothes',
    disAllowedTraits: { Clothes: ['Puffer', 'DadBod'] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ['holiday', 'christmas']
  },
  {
    name: '#1 Dad Hoodie',
    url: './@/assets/overlay/traits/clothes/DadHoodie.png',
    value: '#1 Dad Hoodie',
    attribute: 'Clothes',
    category: 'Clothes',
    disAllowedTraits: { Clothes: ['Puffer', 'DadBod'] },
    dims: { x: 0, y: 0, width: 2800, height: 2800 },
    tags: ['dad', 'father', 'hoodie']
  },
];


  const createOverlay = (props: {name: string, attribute: string, url: string, value: string, category: OverlayCategory, disAllowedTraits: OverlayTraits, dims: { x: number, y: number, width: number, height: number }, tags: Array<string>}): EnhancedOverlay => ({
    name: props.name,
    attribute: props.attribute,
    url: props.url,
    value: props.value,
    category: props.category,
    disAllowedTraits: props.disAllowedTraits,
    dims: props.dims,
    tags: props.tags
  });

  const createBackgroundOG = (props: {name: string, url: string, value: string, category: BackgroundCategory, tags: Array<string>}): EnhancedImageVals => ({
    name: props.name,
    url: props.url,
    value: props.value,
    category: props.category,
    tags: props.tags,
  });


const createOverlayOG = (name: string, attribute: string, url: string, traits: OverlayTraits, value: string, disAllowedTraits: { [key: string]: string[] }, category?: OverlayCategory,): Overlay => ({
    name,
    attribute,
    url,
    value,
    category,
    disAllowedTraits,
    dims: {
      x: 0,
      y: 0,
      width: 2800,
      height: 2800,
    }
  });


  const overlayArray: EnhancedOverlay[] = [
    createOverlayOG('Santa Hat', 'Head', '/assets/traits/head/SantaHat.png', { Head: ['Santa Hat'] }, 'Santa Hat', { Head: ['Beer Hat', 'Santa Hat', 'Bucket Hat', 'Hardhat'] }),
    createOverlayOG('Xmas Sweater', 'Clothes', '/assets/traits/clothes/Xmas_Sweater.png', { Clothes: ['Xmas Sweater']} , 'Xmas Sweater', { clothes: ['Puffer', 'DadBod'], extra: ['Baby Carlos'] }),
    createOverlayOG('Holiday Sweater', 'Clothes', '/assets/traits/clothes/Holiday_Sweater.png', {Clothes: ['Holiday Sweater']} , 'Holiday Sweater', { Clothes: ['Puffer', 'DadBod'], extra: ['Baby Carlos'] }),
    createOverlayOG('#1 Dad Hoodie', 'Clothes', '/assets/traits/clothes/DadHoodie.png', { Clothes: ['#1 Dad Hoodie']} , '#1 Dad Hoodie', { Clothes: ['Puffer', 'DadBod'], extra: ['Baby Carlos'] }),
    //createOverlayOG('#1 Dad Hoodie', 'Clothes', '/assets/traits/clothes/DadHoodie.png',{ Clothes: ['#1 Dad Hoodie']} , '' , { clothes: ['Puffer', 'DadBod'], extra: ['Baby Carlos'] }),
    ];


export { overlayImages, backgroundImages, createOverlay, overlayArray };
