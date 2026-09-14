import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Section, SectionHeading } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'About',
  description:
    'MyJerseyPlug is a Nigerian jersey store on a mission to make authentic, personalized football kits easy to get, anywhere in the country.',
  alternates: { canonical: '/about' },
};

const VALUES = [
  { title: 'Authenticity first', body: 'We quality-check every jersey before it ships. What you see is what arrives.' },
  { title: 'Made personal', body: 'Our customizer turns a blank kit into yours — name, number and patches, priced as you go.' },
  { title: 'Built for Nigeria', body: 'Fast nationwide delivery, Lagos pickup, and secure bank-transfer checkout.' },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink">
        <div className="absolute inset-0">
          <Image src="/hero.jpg" alt="" fill sizes="100vw" className="object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/30" />
        </div>
        <div className="shell relative py-20 sm:py-28">
          <p className="text-label uppercase text-accent">Our story</p>
          <h1 className="mt-3 max-w-2xl text-display text-white">Jerseys, made personal.</h1>
          <p className="mt-4 max-w-lg text-body text-paper-warm/80">
            MyJerseyPlug started with a simple idea: every fan deserves a jersey that feels like theirs — authentic,
            fairly priced, and delivered without the wait.
          </p>
        </div>
      </section>

      <Section>
        <div className="shell max-w-3xl">
          <SectionHeading
            eyebrow="Why we exist"
            title="Football is personal. Your kit should be too."
            description="Whether you rep a club from across the world or the Super Eagles at home, we make it effortless to wear your colours with pride."
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="card p-5">
                <h3 className="text-h3 text-ink">{v.title}</h3>
                <p className="mt-2 text-small text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section className="bg-paper-2">
        <div className="shell text-center">
          <h2 className="text-h2 text-ink">Ready to find your jersey?</h2>
          <p className="mx-auto mt-3 max-w-md text-body text-ink-muted">
            Shop authentic kits or build a custom one in minutes.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/shop">Shop Jerseys</Button>
            <Button href="/customize" variant="outline">Customize Your Kit</Button>
          </div>
        </div>
      </Section>
    </>
  );
}
