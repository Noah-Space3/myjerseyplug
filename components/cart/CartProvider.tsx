'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import type { CartItem, CustomizationConfig } from '@/lib/types';
import { computeCustomizationPrice } from '@/lib/pricing';

interface AddStandardArgs {
  productId: string;
  name: string;
  image: string;
  basePrice: number;
  type?: 'standard' | 'custom';
  customization?: CustomizationConfig | null;
  quantity?: number;
  configurationLabel?: string;
}

interface CartContextValue {
  items: CartItem[];
  count: number;
  subtotal: number;
  addItem: (args: AddStandardArgs) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
  updateCustomization: (lineId: string, customization: CustomizationConfig) => void;
  clear: () => void;
  hydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'mjp_cart_v1';

type Action =
  | { type: 'hydrate'; items: CartItem[] }
  | { type: 'add'; item: CartItem }
  | { type: 'setQty'; lineId: string; quantity: number }
  | { type: 'remove'; lineId: string }
  | { type: 'updateCustomization'; lineId: string; customization: CustomizationConfig }
  | { type: 'clear' };

function makeLineId(): string {
  return 'li_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'hydrate':
      return action.items;
    case 'add':
      return [...state, action.item];
    case 'setQty':
      return state.map((i) =>
        i.lineId === action.lineId ? { ...i, quantity: Math.max(1, action.quantity) } : i,
      );
    case 'remove':
      return state.filter((i) => i.lineId !== action.lineId);
    case 'updateCustomization': {
      return state.map((i) => {
        if (i.lineId !== action.lineId) return i;
        const cost = computeCustomizationPrice(i.basePrice, action.customization).total - i.basePrice;
        return {
          ...i,
          customization: action.customization,
          customizationCost: Math.max(0, cost),
          unitPrice: computeCustomizationPrice(i.basePrice, action.customization).total,
        };
      });
    }
    case 'clear':
      return [];
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, dispatch] = useReducer(reducer, []);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: 'hydrate', items: JSON.parse(raw) as CartItem[] });
    } catch {
      /* ignore malformed storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore quota errors */
    }
  }, [items, hydrated]);

  const addItem = useCallback((args: AddStandardArgs) => {
    const customizationCost = args.customization
      ? computeCustomizationPrice(args.basePrice, args.customization).total - args.basePrice
      : 0;
    const unitPrice = args.basePrice + customizationCost;
    const item: CartItem = {
      lineId: makeLineId(),
      productId: args.productId,
      name: args.name,
      type: args.type ?? 'standard',
      image: args.image,
      basePrice: args.basePrice,
      customization: args.customization ?? null,
      customizationCost: Math.max(0, customizationCost),
      unitPrice,
      quantity: args.quantity ?? 1,
      configurationLabel: args.configurationLabel,
    };
    dispatch({ type: 'add', item });
  }, []);

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    dispatch({ type: 'setQty', lineId, quantity });
  }, []);

  const removeItem = useCallback((lineId: string) => {
    dispatch({ type: 'remove', lineId });
  }, []);

  const updateCustomization = useCallback((lineId: string, customization: CustomizationConfig) => {
    dispatch({ type: 'updateCustomization', lineId, customization });
  }, []);

  const clear = useCallback(() => dispatch({ type: 'clear' }), []);

  const count = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((s, i) => s + i.unitPrice * i.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    count,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    updateCustomization,
    clear,
    hydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
