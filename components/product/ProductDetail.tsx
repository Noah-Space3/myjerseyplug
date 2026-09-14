'use client';

import Link from 'next/link';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductPurchase } from '@/components/product/ProductPurchase';
import { ProductCard } from '@/components/product/ProductCard';
import { formatNGN } from '@/lib/format';
import type { Product } from '@/lib/types';
import { TruckIcon } from '@/components/ui/icons';

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery images={product.images} name={product.name} />

      <div>
        <p className="text-label uppercase text-ink-muted">{product.team} · {product.league}</p>
        <h1 className="mt-2 text-h1 text-ink">{product.name}</h1>
        <p className="mt-4 max-w-prose text-body text-ink-muted">{product.description}</p>

        <div className="mt-6">
          <ProductPurchase product={product} />
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-line bg-paper-2 p-4">
          <TruckIcon className="mt-0.5 h-5 w-5 text-accent-dark" />
          <div>
            <p className="text-small font-semibold text-ink">Delivery</p>
            <p className="text-small text-ink-muted">{product.delivery}</p>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-8 border-t border-line pt-10 lg:col-span-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h2 className="text-h3 text-ink">Product details</h2>
          <dl className="mt-4 divide-y divide-line rounded-lg border border-line bg-white">
            {product.details.map((d) => (
              <div key={d.label} className="flex justify-between gap-4 px-4 py-3">
                <dt className="text-small text-ink-muted">{d.label}</dt>
                <dd className="text-small font-medium text-ink">{d.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-h3 text-ink">Personalization</h2>
          <p className="mt-4 text-small text-ink-muted">
            This jersey can be personalized with a name and number in the customizer. Custom kits start from{' '}
            {formatNGN(35000)} with free name &amp; number.
          </p>
          <Link href="/customize" className="btn-outline mt-4">Open the customizer</Link>
        </div>
      </div>

      <div className="mt-16 lg:col-span-2">
        <h2 className="text-h2 text-ink">You may also like</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
