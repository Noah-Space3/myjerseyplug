'use client';

import { useMemo, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { CUSTOMIZATION_PRICING, getCustomizationPricing } from '@/lib/pricing';
import { SIZES_TOP, SLEEVE_OPTIONS } from '@/lib/constants';
import type { Product, SizeTop, SleeveType } from '@/lib/types';
import { formatNGN } from '@/lib/format';
import { cn } from '@/lib/utils';
import { MinusIcon, PlusIcon } from '@/components/ui/icons';

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [size, setSize] = useState<SizeTop | null>(null);
  const [sleeve, setSleeve] = useState<SleeveType>(product.sleeveTypes[0] ?? 'short');
  const [personalize, setPersonalize] = useState(false);
  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [qty, setQty] = useState(1);
  const [error, setError] = useState('');
  const [added, setAdded] = useState(false);

  const personalizationCost = personalize && (name.trim() || number.trim()) ? getCustomizationPricing().nameNumber : 0;
  const unit = product.price + personalizationCost;

  const label = useMemo(() => {
    const parts = [`Size ${size ?? '—'}`, `${sleeve === 'long' ? 'Long' : 'Short'} sleeve`];
    if (personalize && (name.trim() || number.trim())) {
      parts.push([name.trim() && `“${name.trim()}”`, number.trim() && `#${number.trim()}`].filter(Boolean).join(' '));
    }
    return parts.join(' · ');
  }, [size, sleeve, personalize, name, number]);

  function add() {
    if (!size) {
      setError('Please select a size to continue.');
      return;
    }
    setError('');
    addItem({
      productId: product.id,
      name: product.name,
      image: product.images.front,
      basePrice: product.price,
      type: personalize ? 'custom' : 'standard',
      customization: personalize
        ? {
            kit: 'top',
            sleeve,
            name: name.trim(),
            number: number.trim(),
            patches: [],
            sizes: { top: size, shorts: 'M', socks: 'M' },
          }
        : null,
      quantity: qty,
      configurationLabel: label,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (!product.inStock) {
    return (
      <div className="rounded-lg border border-line bg-paper-2 p-5 text-center">
        <p className="text-body font-semibold text-ink">Currently out of stock</p>
        <p className="mt-1 text-small text-ink-muted">We restock popular sizes often — tap Notify me on WhatsApp.</p>
        <a href="https://wa.me/2348012345678" className="btn-outline mt-4">Notify me</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <span className="text-price text-ink">{formatNGN(unit)}</span>
        {personalizationCost > 0 && (
          <span className="ml-2 text-small text-ink-muted">incl. {formatNGN(personalizationCost)} personalization</span>
        )}
      </div>

      <div>
        <p className="label">Size</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Select size">
          {product.sizes.map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={cn('chip min-w-[3rem] text-center', size === s && 'chip-active')}
              aria-pressed={size === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {product.sleeveTypes.length > 1 && (
        <div>
          <p className="label">Sleeve</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Select sleeve type">
            {SLEEVE_OPTIONS.filter((o) => product.sleeveTypes.includes(o.value)).map((o) => (
              <button
                key={o.value}
                onClick={() => setSleeve(o.value)}
                className={cn('chip', sleeve === o.value && 'chip-active')}
                aria-pressed={sleeve === o.value}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {product.customizable && (
        <div className="rounded-lg border border-line bg-paper-2 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-3">
            <span>
              <span className="block text-body font-semibold text-ink">Add your name &amp; number</span>
              <span className="block text-small text-ink-muted">+{formatNGN(getCustomizationPricing().nameNumber)}</span>
            </span>
            <input
              type="checkbox"
              checked={personalize}
              onChange={(e) => setPersonalize(e.target.checked)}
              className="h-5 w-5 accent-accent"
            />
          </label>
          {personalize && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="pname">Name</label>
                <input
                  id="pname"
                  value={name}
                  maxLength={12}
                  onChange={(e) => setName(e.target.value.toUpperCase())}
                  placeholder="E.g. OKAFOR"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="pnum">Number</label>
                <input
                  id="pnum"
                  value={number}
                  maxLength={2}
                  inputMode="numeric"
                  onChange={(e) => setNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="E.g. 9"
                  className="input"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <p role="alert" className="text-small font-medium text-danger">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border border-line bg-white">
          <button onClick={() => setQty(Math.max(1, qty - 1))} className="btn-ghost px-3" aria-label="Decrease quantity">
            <MinusIcon className="h-4 w-4" />
          </button>
          <span className="w-8 text-center text-body font-semibold" aria-live="polite">{qty}</span>
          <button onClick={() => setQty(qty + 1)} className="btn-ghost px-3" aria-label="Increase quantity">
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>
        <button onClick={add} className={cn('btn-primary flex-1', added && 'bg-accent-dark')}>
          {added ? 'Added to cart ✓' : 'Add to cart'}
        </button>
      </div>
    </div>
  );
}
