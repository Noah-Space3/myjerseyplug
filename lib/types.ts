export type JerseyType = 'player' | 'fan' | 'retro';
export type SleeveType = 'short' | 'long';
export type SizeTop = 'S' | 'M' | 'L' | 'XL' | 'XXL';
export type SizeShorts = 'S' | 'M' | 'L' | 'XL';
export type SizeSocks = 'S' | 'M' | 'L';

export type KitOption = 'top' | 'top-shorts' | 'full' | 'full-socks';

export interface ProductImageSet {
  front: string;
  back?: string;
  detail?: string;
  lifestyle?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  team: string;
  league: string;
  collection: string;
  type: JerseyType;
  price: number;
  currency: 'NGN';
  colors: { name: string; hex: string }[];
  images: ProductImageSet;
  sizes: SizeTop[];
  sleeveTypes: SleeveType[];
  customizable: boolean;
  customization: {
    name: boolean;
    number: boolean;
    patches: string[];
  };
  bestseller?: boolean;
  isNew?: boolean;
  inStock: boolean;
  description: string;
  details: { label: string; value: string }[];
  delivery: string;
}

export interface CustomizationConfig {
  kit: KitOption;
  sleeve: SleeveType;
  name: string;
  number: string;
  patches: string[];
  sizes: {
    top: SizeTop;
    shorts: SizeShorts;
    socks: SizeSocks;
  };
}

export interface CartItem {
  lineId: string;
  productId: string;
  name: string;
  type: 'standard' | 'custom';
  image: string;
  basePrice: number;
  customization: CustomizationConfig | null;
  customizationCost: number;
  unitPrice: number;
  quantity: number;
  configurationLabel?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: 'pending' | 'paid' | 'failed';
  paymentRef?: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
  };
  delivery: {
    method: string;
    eta: string;
  };
}
