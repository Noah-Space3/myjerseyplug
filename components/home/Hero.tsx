import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from '@/components/ui/icons';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="/hero.jpg"
          alt="A curated collection of premium football jerseys"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/40 to-transparent" />
      </div>

      <div className="shell relative flex min-h-[78svh] flex-col justify-end pb-16 pt-28 sm:min-h-[82svh] sm:justify-center sm:pb-0 sm:pt-32">
        <div className="max-w-2xl">
          <p className="text-label uppercase text-accent">Authentic · Customizable · Nigeria-wide</p>
          <h1 className="mt-4 text-display text-white">
            Your Jersey.
            <br />
            Your Style.
          </h1>
          <p className="mt-5 max-w-md text-body text-paper-warm/80 sm:text-[1.05rem]">
            Shop authentic football jerseys from the world&apos;s biggest clubs, or build a kit that&apos;s
            entirely yours — name, number and all. Designed and delivered across Nigeria.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/shop" className="btn-primary">
              Shop Jerseys
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/customize" className="btn-outline border-white/20 bg-white/5 text-white hover:bg-white/10">
              Customize Your Kit
            </Link>
          </div>
          <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-small text-paper-warm/70">
            <div>
              <dt className="sr-only">Delivery</dt>
              <dd>3–5 day delivery nationwide</dd>
            </div>
            <div>
              <dt className="sr-only">Payment</dt>
              <dd>Pay by secure bank transfer</dd>
            </div>
            <div>
              <dt className="sr-only">Personalization</dt>
              <dd>Free name &amp; number on custom kits</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
