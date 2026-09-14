'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import { COLLECTIONS, LEAGUES } from '@/lib/products';
import { ProductGrid } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/ui/States';
import { Button } from '@/components/ui/Button';
import { CloseIcon, SearchIcon } from '@/components/ui/icons';
import { cn } from '@/lib/utils';

type Sort = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'new';

const SORTS: { value: Sort; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'new', label: 'Newest' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'name', label: 'Name: A–Z' },
];

const PRICE_BOUNDS = { min: 0, max: 50000 };

export function ShopView({
  products,
  initialQuery = '',
  initialLeague,
  initialCollection,
}: {
  products: Product[];
  initialQuery?: string;
  initialLeague?: string;
  initialCollection?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [league, setLeague] = useState<string | null>(initialLeague ?? null);
  const [collection, setCollection] = useState<string | null>(initialCollection ?? null);
  const [type, setType] = useState<Product['type'] | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(PRICE_BOUNDS.max);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState<Sort>('featured');
  const [mobileFilters, setMobileFilters] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = products.filter((p) => {
      if (q && !`${p.name} ${p.team} ${p.league}`.toLowerCase().includes(q)) return false;
      if (league && p.league !== league) return false;
      if (collection) {
        const col = COLLECTIONS.find((c) => c.id === collection);
        if (col && !col.match(p)) return false;
      }
      if (type && p.type !== type) return false;
      if (p.price > maxPrice) return false;
      if (inStockOnly && !p.inStock) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'new':
          return Number(b.isNew ?? false) - Number(a.isNew ?? false) || b.price - a.price;
        default:
          return Number(b.bestseller ?? false) - Number(a.bestseller ?? false);
      }
    });
    return list;
  }, [products, query, league, collection, type, maxPrice, inStockOnly, sort]);

  function resetAll() {
    setQuery('');
    setLeague(null);
    setCollection(null);
    setType(null);
    setMaxPrice(PRICE_BOUNDS.max);
    setInStockOnly(false);
  }

  const activeCount =
    (query ? 1 : 0) + (league ? 1 : 0) + (collection ? 1 : 0) + (type ? 1 : 0) + (maxPrice < PRICE_BOUNDS.max ? 1 : 0) + (inStockOnly ? 1 : 0);

  const Filters = (
    <div className="space-y-7">
      <div>
        <h3 className="text-label uppercase text-ink-muted">Search</h3>
        <div className="mt-2 flex items-center gap-2 rounded-md border border-line bg-white px-3">
          <SearchIcon className="h-4 w-4 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Team, league…"
            className="w-full bg-transparent py-2.5 text-small text-ink placeholder:text-ink-muted focus:outline-none"
            aria-label="Search within shop"
          />
        </div>
      </div>

      <FilterGroup title="Collection" options={COLLECTIONS.map((c) => ({ value: c.id, label: c.name }))} value={collection} onChange={(v) => setCollection(v)} />

      <FilterGroup title="League" options={LEAGUES.map((l) => ({ value: l, label: l }))} value={league} onChange={(v) => setLeague(v)} />

      <FilterGroup
        title="Jersey type"
        options={[
          { value: 'player', label: 'Player' },
          { value: 'fan', label: 'Fan' },
          { value: 'retro', label: 'Retro' },
        ]}
        value={type}
        onChange={(v) => setType(v as Product['type'])}
      />

      <div>
        <h3 className="text-label uppercase text-ink-muted">Max price</h3>
        <input
          type="range"
          min={PRICE_BOUNDS.min}
          max={PRICE_BOUNDS.max}
          step={1000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-3 w-full accent-accent"
          aria-label="Maximum price"
        />
        <div className="mt-1 flex justify-between text-small text-ink-muted">
          <span>₦0</span>
          <span className="font-semibold text-ink">₦{maxPrice.toLocaleString('en-NG')}</span>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-small text-ink">
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={(e) => setInStockOnly(e.target.checked)}
          className="h-4 w-4 rounded border-line accent-accent"
        />
        In stock only
      </label>

      {activeCount > 0 && (
        <button onClick={resetAll} className="text-small font-semibold text-accent-dark underline-offset-2 hover:underline">
          Clear all filters ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[260px_1fr] lg:py-14">
      <aside className="hidden lg:block">
        <div className="sticky top-24">{Filters}</div>
      </aside>

      <div>
        <div className="flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-h2 text-ink">Shop Jerseys</h1>
            <p className="mt-1 text-small text-ink-muted" aria-live="polite">
              {filtered.length} {filtered.length === 1 ? 'jersey' : 'jerseys'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileFilters(true)}>
              Filters{activeCount > 0 ? ` (${activeCount})` : ''}
            </Button>
            <label className="sr-only" htmlFor="sort">Sort</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="input w-auto py-2 text-small"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-8">
            <EmptyState
              title="No jerseys match your filters"
              description="Try widening your price range or clearing a filter."
              action={
                <Button variant="outline" onClick={resetAll}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          <div className="mt-8">
            <ProductGrid products={filtered} />
          </div>
        )}
      </div>

      {/* Mobile filters drawer */}
      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileFilters(false)} />
          <div className="absolute right-0 top-0 h-full w-[86%] max-w-sm overflow-y-auto bg-paper-warm p-5 shadow-lift">
            <div className="flex items-center justify-between">
              <h2 className="text-h3 text-ink">Filters</h2>
              <button className="btn-ghost px-2" onClick={() => setMobileFilters(false)} aria-label="Close filters">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-5">{Filters}</div>
            <div className="mt-8">
              <Button fullWidth onClick={() => setMobileFilters(false)}>
                Show {filtered.length} results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div>
      <h3 className="text-label uppercase text-ink-muted">{title}</h3>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            onClick={() => onChange(value === o.value ? null : o.value)}
            className={cn('chip', value === o.value && 'chip-active')}
            aria-pressed={value === o.value}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
