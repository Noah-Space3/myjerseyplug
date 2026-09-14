import Image from 'next/image';
import Link from 'next/link';
import { Section } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight, PaletteIcon } from '@/components/ui/icons';

export function CustomizeSection() {
  return (
    <Section>
      <div className="shell">
        <div className="grid items-center gap-8 rounded-xl border border-line bg-ink p-6 text-paper-warm sm:p-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="text-label uppercase text-accent">Customize your kit</p>
            <h2 className="mt-3 text-h1 text-white">Build a jersey that&apos;s unmistakably yours</h2>
            <p className="mt-4 max-w-md text-body text-paper-warm/75">
              Pick your top, shorts and socks, choose short or long sleeves, then add your name, number and
              competition patches. See it update live on real product photography — and watch the price change as you go.
            </p>
            <ul className="mt-6 space-y-2.5 text-small text-paper-warm/85">
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Jersey, shorts &amp; socks in one kit</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Name, number &amp; sleeve patches</li>
              <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> Real product photos &amp; live pricing</li>
            </ul>
            <div className="mt-8">
              <Link href="/customize" className="btn-primary">
                Start customizing <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-white/5">
            <Image
              src="/jerseys/blank-template.jpg"
              alt="A blank customizable jersey template"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
              <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-accent px-3 py-1.5 text-small font-semibold text-white">
                <PaletteIcon className="h-4 w-4" /> Kit builder
              </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
