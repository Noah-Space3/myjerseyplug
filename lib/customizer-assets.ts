// The customizer is driven by REAL product photography, not 3D.
//
// The preview resolves each selection to a real image from this map. Drop properly
// shot, catalogue-consistent photographs into /public/jerseys using these filenames
// to light up each option (front/back, sleeve length, shorts, socks):
//   blank-back.jpg   – back of the blank kit (BACK view)
//   blank-short.jpg  – short-sleeve variant
//   blank-long.jpg   – long-sleeve variant
//   blank-shorts.jpg – matching shorts
//   blank-socks.jpg  – matching socks
//
// Until those assets exist, the preview falls back to the base jersey photograph and
// reflects kit/sleeve choices in the price + configuration summary.

export const CUSTOMIZER_IMAGES = {
  jersey: '/jerseys/blank-template.jpg',
  jerseyBack: '/jerseys/blank-back.jpg',
  shortSleeve: '/jerseys/blank-short.jpg',
  longSleeve: '/jerseys/blank-long.jpg',
  shorts: '/jerseys/blank-shorts.jpg',
  socks: '/jerseys/blank-socks.jpg',
} as const;

// Text colour for the on-photo name/number overlay (blank kit is white -> dark ink).
// For coloured kits this can be supplied per-image in production.
export const CUSTOMIZER_TEXT_COLOR = '#0c0f0d';
