'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from './products';
import { CUSTOMIZATION_PRICING, setCustomizationPricing } from './pricing';
import { DELIVERY_METHODS, setDeliveryMethods } from './constants';
import type { Product } from './types';

interface CatalogState {
  productOverrides: Record<string, Partial<Product>>;
  customizationPricing: typeof CUSTOMIZATION_PRICING;
  deliveryMethods: typeof DELIVERY_METHODS;
}

const LS_KEY = 'mjp_catalog_v1';

const DEFAULT: CatalogState = {
  productOverrides: {},
  customizationPricing: { ...CUSTOMIZATION_PRICING },
  deliveryMethods: DELIVERY_METHODS,
};

function load(): CatalogState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...DEFAULT, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT;
}

interface CatalogContextValue {
  products: Product[];
  customizationPricing: typeof CUSTOMIZATION_PRICING;
  deliveryMethods: typeof DELIVERY_METHODS;
  updateProduct: (id: string, patch: Partial<Product>) => void;
  setCustomization: (p: typeof CUSTOMIZATION_PRICING) => void;
  setDelivery: (m: typeof DELIVERY_METHODS) => void;
  reset: () => void;
  hydrated: boolean;
}

const Ctx = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CatalogState>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const s = load();
    setState(s);
    setCustomizationPricing(s.customizationPricing);
    setDeliveryMethods(s.deliveryMethods);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) localStorage.setItem(LS_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const products = useMemo(
    () => PRODUCTS.map((p) => ({ ...p, ...(state.productOverrides[p.id] ?? {}) })),
    [state.productOverrides],
  );

  const updateProduct = useCallback((id: string, patch: Partial<Product>) => {
    setState((s) => ({
      ...s,
      productOverrides: { ...s.productOverrides, [id]: { ...(s.productOverrides[id] ?? {}), ...patch } },
    }));
  }, []);

  const setCustomization = useCallback((p: typeof CUSTOMIZATION_PRICING) => {
    setState((s) => ({ ...s, customizationPricing: p }));
    setCustomizationPricing(p);
  }, []);

  const setDelivery = useCallback((m: typeof DELIVERY_METHODS) => {
    setState((s) => ({ ...s, deliveryMethods: m }));
    setDeliveryMethods(m);
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT);
    setCustomizationPricing(DEFAULT.customizationPricing);
    setDeliveryMethods(DEFAULT.deliveryMethods);
  }, []);

  return (
    <Ctx.Provider value={{ products, customizationPricing: state.customizationPricing, deliveryMethods: state.deliveryMethods, updateProduct, setCustomization, setDelivery, reset, hydrated }}>
      {children}
    </Ctx.Provider>
  );
}

export function useCatalog() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useCatalog must be used within CatalogProvider');
  return ctx;
}
