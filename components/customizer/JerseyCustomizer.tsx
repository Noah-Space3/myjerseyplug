'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { computeCustomizationPrice, kitItems, getCustomizationPricing } from '@/lib/pricing';
import {
  KIT_OPTIONS,
  PATCH_OPTIONS,
  SLEEVE_OPTIONS,
  SIZES_SHORTS,
  SIZES_SOCKS,
  SIZES_TOP,
} from '@/lib/constants';
import type { CustomizationConfig, SizeShorts, SizeSocks, SizeTop } from '@/lib/types';
import { formatNGN } from '@/lib/format';
import { cn } from '@/lib/utils';
import { ChevronDown, CheckIcon } from '@/components/ui/icons';
import { CUSTOMIZER_IMAGES, CUSTOMIZER_TEXT_COLOR } from '@/lib/customizer-assets';

const CUSTOM_BASE = 35000;

type View = 'front' | 'back';

function SectionCard({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-line bg-white">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="text-body font-semibold text-ink">{title}</span>
        <ChevronDown className={cn('h-5 w-5 text-ink-muted transition-transform', open && 'rotate-180')} />
      </button>
      {open && <div className="border-t border-line px-4 py-4">{children}</div>}
    </div>
  );
}

export function JerseyCustomizer() {
  const { addItem } = useCart();
  const [view, setView] = useState<View>('front');
  const [added, setAdded] = useState(false);
  const [config, setConfig] = useState<CustomizationConfig>({
    kit: 'top',
    sleeve: 'short',
    name: '',
    number: '',
    patches: [],
    sizes: { top: 'M', shorts: 'M', socks: 'M' },
  });

  const items = kitItems(config.kit);
  const price = computeCustomizationPrice(CUSTOM_BASE, config);

  function update(patch: Partial<CustomizationConfig>) {
    setConfig((c) => ({ ...c, ...patch }));
  }
  function updateSize(which: 'top' | 'shorts' | 'socks', value: string) {
    setConfig((c) => ({ ...c, sizes: { ...c.sizes, [which]: value as SizeTop & SizeShorts & SizeSocks } }));
  }
  function togglePatch(value: string) {
    setConfig((c) => ({
      ...c,
      patches: c.patches.includes(value) ? c.patches.filter((p) => p !== value) : [...c.patches, value],
    }));
  }

  const labelParts = [
    KIT_OPTIONS.find((k) => k.value === config.kit)?.label,
    config.sleeve === 'long' ? 'Long sleeve' : 'Short sleeve',
    (config.name.trim() || config.number.trim()) &&
      [config.name.trim() && `“${config.name.trim()}”`, config.number.trim() && `#${config.number.trim()}`].filter(Boolean).join(' '),
    `Top ${config.sizes.top}`,
    items.shorts && `Shorts ${config.sizes.shorts}`,
    items.socks && `Socks ${config.sizes.socks}`,
  ].filter(Boolean) as string[];

  function addToCart() {
    addItem({
      productId: 'custom-kit',
      name: 'Custom Kit',
      image: CUSTOMIZER_IMAGES.jersey,
      basePrice: CUSTOM_BASE,
      type: 'custom',
      customization: config,
      quantity: 1,
      configurationLabel: labelParts.join(' · '),
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  const includedItems = [
    'Jersey top',
    items.shorts && 'Shorts',
    items.socks && 'Socks',
  ].filter(Boolean) as string[];

  return (
    <div className="shell py-8 lg:py-12">
      <div className="mb-6">
        <p className="text-label uppercase text-accent-dark">Customize your kit</p>
        <h1 className="mt-2 text-h1 text-ink">Build your jersey</h1>
        <p className="mt-2 max-w-xl text-body text-ink-muted">
          Start from a real blank kit, add your name and number, choose your sleeve and pieces — and see it
          come together with live pricing.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
        {/* Real product photograph preview */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-line bg-paper-2">
            <Image
              src={CUSTOMIZER_IMAGES.jersey}
              alt={`Custom jersey, ${view} view`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              className="object-cover object-center"
            />

            {/* FRONT / BACK name + number overlay (shown on back) */}
            <div
              className={cn(
                'absolute inset-0 flex flex-col items-center transition-opacity duration-300 ease-smooth',
                view === 'back' ? 'opacity-100' : 'opacity-0',
              )}
              aria-hidden={view !== 'back'}
            >
              {config.name.trim() && (
                <span
                  className="absolute left-0 right-0 top-[26%] text-center text-[clamp(1.1rem,4.5vw,1.9rem)] font-extrabold uppercase tracking-[0.12em]"
                  style={{ color: CUSTOMIZER_TEXT_COLOR, fontFamily: 'var(--font-display)' }}
                >
                  {config.name.trim()}
                </span>
              )}
              {config.number.trim() && (
                <span
                  className="absolute left-0 right-0 top-[40%] text-center text-[clamp(3.5rem,17vw,7rem)] font-extrabold leading-none"
                  style={{ color: CUSTOMIZER_TEXT_COLOR, fontFamily: 'var(--font-display)' }}
                >
                  {config.number.trim()}
                </span>
              )}
              {config.patches.length > 0 && (
                <div className="absolute bottom-[12%] left-0 right-0 flex justify-center gap-2">
                  {config.patches.map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-ink px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                    >
                      {PATCH_OPTIONS.find((o) => o.value === p)?.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* FRONT | BACK toggle */}
            <div className="absolute right-3 top-3 flex overflow-hidden rounded-full border border-line bg-white/85 backdrop-blur">
              {(['front', 'back'] as View[]).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    'px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors',
                    view === v ? 'bg-ink text-white' : 'text-ink hover:bg-paper-2',
                  )}
                  aria-pressed={view === v}
                >
                  {v}
                </button>
              ))}
            </div>

            {/* Selection caption */}
            <div className="absolute bottom-3 left-3 rounded-full bg-white/85 px-3 py-1.5 text-[11px] font-medium text-ink backdrop-blur">
              {includedItems.join(' · ')} · {config.sleeve === 'long' ? 'Long' : 'Short'} sleeve
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <SectionCard title="Kit">
            <div className="grid grid-cols-2 gap-2">
              {KIT_OPTIONS.map((k) => (
                <button
                  key={k.value}
                  onClick={() => update({ kit: k.value })}
                  className={cn('chip text-left', config.kit === k.value && 'chip-active')}
                  aria-pressed={config.kit === k.value}
                >
                  <span className="block text-small font-semibold">{k.label}</span>
                  <span className="mt-0.5 block text-[11px] opacity-70">{k.hint}</span>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Sleeve">
            <div className="flex gap-2">
              {SLEEVE_OPTIONS.map((s) => (
                <button
                  key={s.value}
                  onClick={() => update({ sleeve: s.value })}
                  className={cn('chip', config.sleeve === s.value && 'chip-active')}
                  aria-pressed={config.sleeve === s.value}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Personalization">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="cname">Player name</label>
                <input
                  id="cname"
                  value={config.name}
                  maxLength={12}
                  onChange={(e) => update({ name: e.target.value.toUpperCase() })}
                  placeholder="NOAH"
                  className="input"
                />
              </div>
              <div>
                <label className="label" htmlFor="cnum">Number</label>
                <input
                  id="cnum"
                  value={config.number}
                  maxLength={2}
                  inputMode="numeric"
                  onChange={(e) => update({ number: e.target.value.replace(/\D/g, '') })}
                  placeholder="10"
                  className="input"
                />
              </div>
            </div>
            <p className="mt-2 text-small text-ink-muted">
              Name &amp; number are included in the kit price and shown on the back preview.
            </p>
          </SectionCard>

          <SectionCard title="Patches">
            <div className="flex flex-wrap gap-2">
              {PATCH_OPTIONS.map((p) => {
                const active = config.patches.includes(p.value);
                return (
                  <button
                    key={p.value}
                    onClick={() => togglePatch(p.value)}
                    className={cn('chip flex items-center gap-1.5', active && 'chip-active')}
                    aria-pressed={active}
                  >
                    {active && <CheckIcon className="h-3.5 w-3.5" />}
                    {p.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-small text-ink-muted">+{formatNGN(getCustomizationPricing().patch)} per patch.</p>
          </SectionCard>

          <SectionCard title="Sizes">
            <div className="space-y-3">
              <SizeRow label={`Jersey top — ${config.sizes.top}`} options={SIZES_TOP} value={config.sizes.top} onSelect={(v) => updateSize('top', v)} />
              {items.shorts && (
                <SizeRow label={`Shorts — ${config.sizes.shorts}`} options={SIZES_SHORTS} value={config.sizes.shorts} onSelect={(v) => updateSize('shorts', v)} />
              )}
              {items.socks && (
                <SizeRow label={`Socks — ${config.sizes.socks}`} options={SIZES_SOCKS} value={config.sizes.socks} onSelect={(v) => updateSize('socks', v)} />
              )}
            </div>
          </SectionCard>

          {/* Price summary (desktop) */}
          <div className="hidden rounded-lg border border-line bg-paper-2 p-5 lg:block">
            <PriceSummary price={price} />
            <button onClick={addToCart} className={cn('btn-primary mt-4 w-full', added && 'bg-accent-dark')}>
              {added ? 'Added to cart ✓' : 'Add to cart'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 backdrop-blur lg:hidden">
        <div className="shell flex items-center justify-between gap-3 py-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-ink-muted">Total</p>
            <p className="text-price text-ink">{formatNGN(price.total)}</p>
          </div>
          <button onClick={addToCart} className={cn('btn-primary flex-1 max-w-[60%]', added && 'bg-accent-dark')}>
            {added ? 'Added ✓' : 'Add to cart'}
          </button>
        </div>
      </div>
      <div className="h-20 lg:hidden" />
    </div>
  );
}

function SizeRow({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-1.5 text-small font-medium text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onSelect(o)}
            className={cn('chip min-w-[2.75rem] text-center', value === o && 'chip-active')}
            aria-pressed={value === o}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function PriceSummary({ price }: { price: ReturnType<typeof computeCustomizationPrice> }) {
  return (
    <div>
      <div className="flex items-center justify-between text-body">
        <span className="text-ink-muted">Jersey base</span>
        <span className="font-semibold text-ink">{formatNGN(price.base)}</span>
      </div>
      {price.lines.map((l, i) => (
        <div key={i} className="mt-2 flex items-center justify-between text-small">
          <span className="text-ink-muted">{l.label}</span>
          <span className="font-medium text-ink">+{formatNGN(l.amount)}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between border-t border-line pt-3">
        <span className="text-body font-semibold text-ink">Total</span>
        <span className="text-price text-ink">{formatNGN(price.total)}</span>
      </div>
    </div>
  );
}
