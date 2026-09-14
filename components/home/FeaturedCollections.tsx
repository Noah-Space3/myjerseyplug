import Image from 'next/image';
import Link from 'next/link';
import { COLLECTIONS } from '@/lib/products';
import { Section, SectionHeading } from '@/components/ui/Container';
import { ArrowRight } from '@/components/ui/icons';

export function FeaturedCollections() {
  return (
    <Section>
      <div className="shell">
        <SectionHeading
          eyebrow="Shop by collection"
          title="Featured Collections"
          description="From the European elite to the Super Eagles — find the shirt that speaks for you."
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.id}
              href={`/shop?collection=${c.id}`}
              className="group relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-paper-2 sm:aspect-[3/4]"
            >
              <Image
                src={c.image}
                alt={c.name}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 ease-smooth group-hover:scale-[1.04]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-h3 text-white">{c.name}</h3>
                <p className="mt-1 text-small text-paper-warm/75">{c.description}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-small font-semibold text-white">
                  Shop now <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Section>
  );
}
