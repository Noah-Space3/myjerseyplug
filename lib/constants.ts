import type { KitOption, SizeShorts, SizeSocks, SizeTop, SleeveType } from './types';

export const SITE = {
  name: 'MyJerseyPlug',
  domain: 'myjerseyplug.ng',
  tagline: 'Your Jersey. Your Style.',
  description:
    'MyJerseyPlug is a premium Nigerian jersey store for authentic football jerseys and fully customizable kits — designed, personalized and delivered across Nigeria.',
  email: 'tbabashekoni@gmail.com',
  phone: '+234 704 084 1103',
  whatsapp: 'https://wa.me/2347040841103',
  instagram: 'https://instagram.com/myjerseyplug_ng',
  address: 'Lagos & Ogun, Nigeria',
  // Bank-transfer details shown at checkout (no payment gateway).
  bank: {
    bankName: 'Palmpay',
    accountName: 'BABATUNDE NOAH SHEKONI',
    accountNumber: '7040841103',
  },
};

export const NAV_DESKTOP = [
  { label: 'Shop', href: '/shop' },
  { label: 'Customize', href: '/customize' },
  { label: 'Collections', href: '/shop?view=collections' },
  { label: 'About', href: '/about' },
];

export const SIZES_TOP: SizeTop[] = ['S', 'M', 'L', 'XL', 'XXL'];
export const SIZES_SHORTS: SizeShorts[] = ['S', 'M', 'L', 'XL'];
export const SIZES_SOCKS: SizeSocks[] = ['S', 'M', 'L'];

export const SLEEVE_OPTIONS: { value: SleeveType; label: string }[] = [
  { value: 'short', label: 'Short Sleeve' },
  { value: 'long', label: 'Long Sleeve' },
];

// Kit presets. Additive model: a kit is the jersey top plus optional shorts and socks.
// Mapped from the brief's kit options (Jersey Top only / Jersey + Shorts / Full Kit / Full Kit + Socks).
export const KIT_OPTIONS: {
  value: KitOption;
  label: string;
  hint: string;
  items: { top: boolean; shorts: boolean; socks: boolean };
}[] = [
  { value: 'top', label: 'Jersey Top only', hint: 'Just the jersey', items: { top: true, shorts: false, socks: false } },
  { value: 'top-shorts', label: 'Jersey + Shorts', hint: 'Top and matching shorts', items: { top: true, shorts: true, socks: false } },
  { value: 'full', label: 'Full Kit', hint: 'Top, shorts and socks', items: { top: true, shorts: true, socks: true } },
  { value: 'full-socks', label: 'Full Kit + Socks', hint: 'Complete matchday kit', items: { top: true, shorts: true, socks: true } },
];

export const PATCH_OPTIONS = [
  { value: 'premier-league', label: 'Premier League' },
  { value: 'champions-league', label: 'UCL' },
  { value: 'la-liga', label: 'La Liga' },
  { value: 'world-cup', label: 'World Cup' },
  { value: 'afcon', label: 'AFCON' },
  { value: 'name-set', label: 'Name Set' },
];

export const DELIVERY_METHODS = [
  { value: 'standard', label: 'Standard (3–5 days)', fee: 2500, eta: '3–5 business days' },
  { value: 'express', label: 'Express (24–48 hrs)', fee: 5000, eta: '24–48 hours' },
  { value: 'pickup', label: 'Lagos Pickup', fee: 0, eta: 'Same day' },
];

let _deliveryMethods = DELIVERY_METHODS;
export function getDeliveryMethods() {
  return _deliveryMethods;
}
export function setDeliveryMethods(methods: typeof DELIVERY_METHODS) {
  _deliveryMethods = methods;
}

// Shop sub-links used by the mega-menu and the mobile drawer.
export const NAV_SHOP_LINKS = [
  { label: 'All Jerseys', href: '/shop' },
  { label: 'European Clubs', href: '/shop?collection=european-clubs' },
  { label: 'National Teams', href: '/shop?collection=national-teams' },
  { label: 'MLS', href: '/shop?collection=mls' },
  { label: 'Premier League', href: '/shop?league=Premier%20League' },
  { label: 'La Liga', href: '/shop?league=La%20Liga' },
  { label: 'Ligue 1', href: '/shop?league=Ligue%201' },
];

export const STATES_NG = [
  'Lagos', 'Abuja (FCT)', 'Rivers', 'Oyo', 'Kano', 'Enugu', 'Anambra',
  'Delta', 'Akwa Ibom', 'Ogun', 'Kaduna', 'Plateau', 'Imo', 'Edo', 'Other',
];
