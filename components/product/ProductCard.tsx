import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { formatNGN } from '@/lib/format';
import { cn } from '@/lib/utils';

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block focus:outline-none"
      aria-label={`${product.name}, ${formatNGN(product.price)}`}
    >
      <article className="overflow-hidden rounded-lg border border-line bg-white transition-shadow duration-300 hover:shadow-card">
        <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
          <Image
            src={product.images.front}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover object-center transition-transform duration-500 ease-smooth group-hover:scale-[1.03]"
            priority={priority}
          />
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {product.isNew && (
              <span className="rounded-full bg-ink px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                New
              </span>
            )}
            {product.bestseller && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                Bestseller
              </span>
            )}
          </div>
          {!product.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <span className="rounded-full bg-ink px-3 py-1.5 text-small font-semibold text-white">
                Out of stock
              </span>
            </div>
          )}
        </div>

        <div className="p-4">
          <p className="text-label uppercase text-ink-muted">{product.team}</p>
          <h3 className="mt-1 text-body font-semibold text-ink line-clamp-1">{product.name}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-price text-ink">{formatNGN(product.price)}</span>
            <span className="text-small text-ink-muted">{product.league}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export function ProductGrid({
  products,
  className,
}: {
  products: Product[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6', className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < 4} />
      ))}
    </div>
  );
}
