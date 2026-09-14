import { PRODUCTS } from '@/lib/products';
import { ProductGrid } from '@/components/product/ProductCard';
import { Section, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/icons';

export function BestSellers() {
  const best = PRODUCTS.filter((p) => p.bestseller || p.isNew).slice(0, 4);
  return (
    <Section className="bg-paper-2">
      <div className="shell">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading eyebrow="Crowd favourites" title="Best Sellers" />
          <Button href="/shop" variant="ghost" className="hidden sm:inline-flex">
            View all <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-8">
          <ProductGrid products={best} />
        </div>
        <div className="mt-8 sm:hidden">
          <Button href="/shop" variant="outline" fullWidth>
            View all jerseys
          </Button>
        </div>
      </div>
    </Section>
  );
}
