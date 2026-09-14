import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/lib/products';
import { getProducts } from '@/lib/supabase/data';
import { ShopView } from '@/components/shop/ShopView';
import { SectionHeading } from '@/components/ui/Container';
import { ArrowRight } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Shop Jerseys',
  description:
    'Browse authentic football jerseys from the Premier League, La Liga, national teams and more. Filter by league, type and price.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { q?: string; league?: string; collection?: string; view?: string };
}) {
  if (searchParams.view === 'collections') {
    return (
      <div className="shell py-10 lg:py-14">
        <SectionHeading
          eyebrow="Collections"
          title="Shop by collection"
          description="Curated drops for the teams and leagues our customers love most."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.id}
              href={`/shop?collection=${c.id}`}
              className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-line bg-paper-2"
            >
              <Image src={c.image} alt={c.name} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
              <div className="absolute bottom-0 p-5">
                <h3 className="text-h3 text-white">{c.name}</h3>
                <p className="mt-1 text-small text-paper-warm/75">{c.description}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-small font-semibold text-white">
                  Shop <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const products = await getProducts();

  return (
    <ShopView
      products={products}
      initialQuery={searchParams.q ?? ''}
      initialLeague={searchParams.league}
      initialCollection={searchParams.collection}
    />
  );
}
