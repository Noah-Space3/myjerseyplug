import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { SITE } from '@/lib/constants';

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line bg-ink text-paper-warm">
      <div className="shell grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-small text-paper-warm/70">
            Authentic football jerseys and fully customizable kits, designed and delivered across Nigeria.
          </p>
        </div>

        <div>
          <h4 className="text-label uppercase text-paper-warm/60">Shop</h4>
          <ul className="mt-4 space-y-2.5 text-small">
            <li><Link href="/shop" className="text-paper-warm/80 hover:text-white">All Jerseys</Link></li>
            <li><Link href="/customize" className="text-paper-warm/80 hover:text-white">Customize Your Kit</Link></li>
            <li><Link href="/shop?league=Premier%20League" className="text-paper-warm/80 hover:text-white">Premier League</Link></li>
            <li><Link href="/shop?league=National" className="text-paper-warm/80 hover:text-white">National Teams</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-label uppercase text-paper-warm/60">Company</h4>
          <ul className="mt-4 space-y-2.5 text-small">
            <li><Link href="/about" className="text-paper-warm/80 hover:text-white">About</Link></li>
            <li><Link href="/account" className="text-paper-warm/80 hover:text-white">My Account</Link></li>
            <li><Link href="/shop?view=collections" className="text-paper-warm/80 hover:text-white">Collections</Link></li>
            <li><Link href="/admin" className="text-paper-warm/80 hover:text-white">Admin</Link></li>
            <li><a href={SITE.whatsapp} className="text-paper-warm/80 hover:text-white">WhatsApp</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-label uppercase text-paper-warm/60">Contact</h4>
          <ul className="mt-4 space-y-2.5 text-small text-paper-warm/80">
            <li>{SITE.address}</li>
            <li><a href={`tel:${SITE.phone.replace(/\s/g, '')}`} className="hover:text-white">{SITE.phone}</a></li>
            <li><a href={`mailto:${SITE.email}`} className="hover:text-white">{SITE.email}</a></li>
            <li><a href={SITE.instagram} className="hover:text-white">Instagram</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col items-center justify-between gap-2 py-5 text-xs text-paper-warm/50 sm:flex-row">
          <p>© {year} {SITE.name}. All rights reserved.</p>
          <p>Secure bank-transfer checkout. Prices in NGN.</p>
        </div>
      </div>
    </footer>
  );
}
