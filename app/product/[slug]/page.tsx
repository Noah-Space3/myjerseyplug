import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { PRODUCTS, getProduct } from '@/lib/products';
import { getProductBySlug, getProducts } from '@/lib/supabase/data';
import { ProductDetail } from '@/components/product/ProductDetail';
import { SITE } from '@/lib/constants';

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Jersey not found' };
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      title: product.name,
      description: product.description,
      images: [{ url: product.images.front, width: 800, height: 1000, alt: product.name }],
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id && p.league === product.league).slice(0, 4);
  const fallbackRelated = all.filter((p) => p.id !== product.id).slice(0, 4);
  const suggestions = related.length ? related : fallbackRelated;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: [product.images.front],
    description: product.description,
    brand: { '@type': 'Brand', name: product.team },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'NGN',
      price: product.price,
      availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: `https://${SITE.domain}/product/${product.slug}`,
    },
  };

  return (
    <div className="shell py-8 lg:py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav className="mb-6 text-small text-ink-muted" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-ink">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/shop" className="hover:text-ink">Shop</Link>
        <span className="mx-1.5">/</span>
        <span className="text-ink">{product.team}</span>
      </nav>

      <ProductDetail product={product} related={suggestions} />
    </div>
  );
}
