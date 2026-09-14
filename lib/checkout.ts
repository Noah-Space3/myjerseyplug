import { PRODUCTS } from './products';
import { serverValidateUnitPrice } from './pricing';
import type { CartItem } from './types';

// Server-side guard: never trust the frontend-computed price or base price.
// Re-derive the expected base price from the catalog, then re-compute the unit total.
export function verifyItems(items: CartItem[]): { ok: boolean; subtotal: number; error?: string } {
  if (!Array.isArray(items) || items.length === 0) {
    return { ok: false, subtotal: 0, error: 'Cart is empty.' };
  }

  let subtotal = 0;
  for (const item of items) {
    const expectedBase =
      item.productId === 'custom-kit'
        ? 35000
        : PRODUCTS.find((p) => p.id === item.productId)?.price;

    if (expectedBase === undefined) {
      return { ok: false, subtotal: 0, error: `Unknown product: ${item.productId}` };
    }
    if (Math.round(item.basePrice) !== expectedBase) {
      return { ok: false, subtotal: 0, error: 'Price mismatch — please refresh and retry.' };
    }

    const serverUnit = serverValidateUnitPrice(item.basePrice, item.customization);
    if (serverUnit <= 0) {
      return { ok: false, subtotal: 0, error: 'Invalid item price.' };
    }
    subtotal += serverUnit * Math.max(1, item.quantity);
  }

  return { ok: true, subtotal };
}
