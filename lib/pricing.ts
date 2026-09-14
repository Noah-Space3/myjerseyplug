import { KIT_OPTIONS, PATCH_OPTIONS } from './constants';
import type { CustomizationConfig, KitOption } from './types';

// Centralized, data-driven pricing. Never hard-code prices in UI components.
// Overridable at runtime (see setCustomizationPricing) so the admin can adjust
// personalization pricing and have it reflect across the storefront.
export const CUSTOMIZATION_PRICING = {
  nameNumber: 5000, // name + number personalization
  patch: 2500, // per sleeve/competition patch
  shorts: 10000, // add-on when kit includes shorts
  socks: 4000, // add-on when kit includes socks
} as const;

let _customizationPricing: typeof CUSTOMIZATION_PRICING = { ...CUSTOMIZATION_PRICING };

export function getCustomizationPricing() {
  return _customizationPricing;
}

export function setCustomizationPricing(p: typeof CUSTOMIZATION_PRICING) {
  _customizationPricing = p;
}

export interface PriceLine {
  label: string;
  amount: number;
}

export interface PriceBreakdown {
  base: number;
  lines: PriceLine[];
  customizationCost: number;
  total: number;
  includesShorts: boolean;
  includesSocks: boolean;
}

export function kitItems(kit: KitOption) {
  return KIT_OPTIONS.find((k) => k.value === kit)?.items ?? KIT_OPTIONS[0].items;
}

export function patchLabel(value: string): string {
  return PATCH_OPTIONS.find((p) => p.value === value)?.label ?? value;
}

// Pure function: given a base jersey price and a config, compute a full breakdown.
export function computeCustomizationPrice(
  basePrice: number,
  config: CustomizationConfig,
): PriceBreakdown {
  const P = getCustomizationPricing();
  const items = kitItems(config.kit);
  const lines: PriceLine[] = [];

  if (items.shorts) lines.push({ label: 'Shorts', amount: P.shorts });
  if (items.socks) lines.push({ label: 'Socks', amount: P.socks });

  const nameStr = typeof config.name === 'string' ? config.name : '';
  const numStr = typeof config.number === 'string' ? config.number : '';
  const hasName = nameStr.trim().length > 0;
  const hasNumber = numStr.trim().length > 0;
  if (hasName || hasNumber) {
    const parts: string[] = [];
    if (hasName) parts.push(nameStr.trim());
    if (hasNumber) parts.push('#' + numStr.trim());
    lines.push({
      label: `Personalization (${parts.join(' ')})`,
      amount: P.nameNumber,
    });
  }

  for (const patch of config.patches) {
    lines.push({ label: `Patch — ${patchLabel(patch)}`, amount: P.patch });
  }

  const customizationCost = lines.reduce((sum, l) => sum + l.amount, 0);

  return {
    base: basePrice,
    lines,
    customizationCost,
    total: basePrice + customizationCost,
    includesShorts: items.shorts,
    includesSocks: items.socks,
  };
}

// Server-side guard: re-computes totals from trusted pricing + config only.
// Use this on the backend to never trust frontend-computed amounts.
export function serverValidateUnitPrice(basePrice: number, config: CustomizationConfig | null): number {
  if (!config) return basePrice;
  return computeCustomizationPrice(basePrice, config).total;
}
