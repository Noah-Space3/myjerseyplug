'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { PATCH_OPTIONS, SLEEVE_OPTIONS, SIZES_SHORTS, SIZES_SOCKS, SIZES_TOP } from '@/lib/constants';
import type { CartItem } from '@/lib/types';
import { formatNGN } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { CloseIcon, MinusIcon, PlusIcon, ArrowRight } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

export function CartView() {
  const { items, subtotal, updateQuantity, removeItem, hydrated, updateCustomization } = useCart();
  const [editing, setEditing] = useState<string | null>(null);

  if (!hydrated) {
    return <div className="shell py-16"><div className="h-40 animate-pulse rounded-lg bg-paper-3" /></div>;
  }

  if (items.length === 0) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="Your cart is empty"
          description="Browse authentic jerseys or build a custom kit in the configurator."
          action={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button href="/shop">Shop Jerseys</Button>
              <Button href="/customize" variant="outline">Customize a Kit</Button>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:py-14">
      <div>
        <h1 className="text-h2 text-ink">Your cart</h1>
        <p className="mt-1 text-small text-ink-muted">{items.reduce((s, i) => s + i.quantity, 0)} items</p>
        <ul className="mt-6 space-y-4">
          {items.map((item) => (
            <li key={item.lineId} className="overflow-hidden rounded-lg border border-line bg-white">
              <div className="flex gap-4 p-4">
                <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-paper-2">
                  <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-body font-semibold text-ink">{item.name}</h3>
                      {item.configurationLabel && (
                        <p className="mt-0.5 text-small text-ink-muted">{item.configurationLabel}</p>
                      )}
                    </div>
                    <button
                      onClick={() => removeItem(item.lineId)}
                      className="btn-ghost px-2 py-1 text-ink-muted hover:text-danger"
                      aria-label={`Remove ${item.name}`}
                    >
                      <CloseIcon className="h-5 w-5" />
                    </button>
                  </div>

                  {item.type === 'custom' && (
                    <button
                      onClick={() => setEditing(editing === item.lineId ? null : item.lineId)}
                      className="mt-2 text-small font-semibold text-accent-dark underline-offset-2 hover:underline"
                    >
                      {editing === item.lineId ? 'Done' : 'Edit customization'}
                    </button>
                  )}

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-full border border-line bg-white">
                      <button onClick={() => updateQuantity(item.lineId, item.quantity - 1)} className="btn-ghost px-2.5" aria-label="Decrease quantity">
                        <MinusIcon className="h-4 w-4" />
                      </button>
                      <span className="w-7 text-center text-small font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.lineId, item.quantity + 1)} className="btn-ghost px-2.5" aria-label="Increase quantity">
                        <PlusIcon className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-price text-ink">{formatNGN(item.unitPrice * item.quantity)}</span>
                  </div>
                </div>
              </div>

              {item.type === 'custom' && editing === item.lineId && item.customization && (
                <EditCustomization item={item} onUpdate={(c) => updateCustomization(item.lineId, c)} onClose={() => setEditing(null)} />
              )}
            </li>
          ))}
        </ul>
        <Link href="/shop" className="mt-6 inline-flex items-center gap-1.5 text-small font-semibold text-accent-dark hover:underline">
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <aside>
        <div className="sticky top-24 rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Order summary</h2>
          <dl className="mt-4 space-y-2 text-small">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatNGN(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="text-ink">Calculated at checkout</dd>
            </div>
          </dl>
          <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
            <span className="text-body font-semibold text-ink">Subtotal</span>
            <span className="text-price text-ink">{formatNGN(subtotal)}</span>
          </div>
          <Button href="/checkout" fullWidth className="mt-5">
            Checkout <ArrowRight className="h-4 w-4" />
          </Button>
          <p className="mt-3 text-center text-[11px] text-ink-muted">Secure checkout · pay by bank transfer</p>
        </div>
      </aside>
    </div>
  );
}

function EditCustomization({
  item,
  onUpdate,
  onClose,
}: {
  item: CartItem;
  onUpdate: (c: NonNullable<CartItem['customization']>) => void;
  onClose: () => void;
}) {
  const c = item.customization!;

  function set(patch: Partial<typeof c>) {
    onUpdate({ ...c, ...patch });
  }

  return (
    <div className="border-t border-line bg-paper-2 px-4 py-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label" htmlFor={`e-name-${item.lineId}`}>Name</label>
          <input
            id={`e-name-${item.lineId}`}
            value={c.name}
            maxLength={12}
            onChange={(e) => set({ name: e.target.value.toUpperCase() })}
            className="input"
          />
        </div>
        <div>
          <label className="label" htmlFor={`e-num-${item.lineId}`}>Number</label>
          <input
            id={`e-num-${item.lineId}`}
            value={c.number}
            maxLength={2}
            inputMode="numeric"
            onChange={(e) => set({ number: e.target.value.replace(/\D/g, '') })}
            className="input"
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="label">Sleeve</p>
        <div className="flex gap-2">
          {SLEEVE_OPTIONS.map((s) => (
            <button key={s.value} onClick={() => set({ sleeve: s.value })} className={cn('chip', c.sleeve === s.value && 'chip-active')}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div>
          <label className="label">Top</label>
          <select value={c.sizes.top} onChange={(e) => set({ sizes: { ...c.sizes, top: e.target.value as typeof c.sizes.top } })} className="input py-2 text-small">
            {SIZES_TOP.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Shorts</label>
          <select value={c.sizes.shorts} onChange={(e) => set({ sizes: { ...c.sizes, shorts: e.target.value as typeof c.sizes.shorts } })} className="input py-2 text-small">
            {SIZES_SHORTS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Socks</label>
          <select value={c.sizes.socks} onChange={(e) => set({ sizes: { ...c.sizes, socks: e.target.value as typeof c.sizes.socks } })} className="input py-2 text-small">
            {SIZES_SOCKS.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-3">
        <p className="label">Patches</p>
        <div className="flex flex-wrap gap-2">
          {PATCH_OPTIONS.map((p) => {
            const active = c.patches.includes(p.value);
            return (
              <button
                key={p.value}
                onClick={() => set({ patches: active ? c.patches.filter((x) => x !== p.value) : [...c.patches, p.value] })}
                className={cn('chip', active && 'chip-active')}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-small text-ink-muted">Updated price: <span className="font-semibold text-ink">{formatNGN(item.unitPrice)}</span></span>
        <button onClick={onClose} className="text-small font-semibold text-accent-dark hover:underline">Close</button>
      </div>
    </div>
  );
}
