import type { Metadata } from 'next';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the MyJerseyPlug team for orders, customization and support.',
  robots: { index: false, follow: false },
};

export default function ContactPage() {
  return (
    <main className="shell max-w-3xl py-16">
      <h1 className="text-h2 text-ink">Contact us</h1>
      <p className="mt-2 text-body text-ink-muted">Questions about an order, a custom kit or a product? Reach out and we will get back to you quickly.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">WhatsApp</h2>
          <a href={SITE.whatsapp} className="mt-1 block text-body font-semibold text-accent-dark hover:underline">{SITE.whatsapp.replace('https://wa.me/', '')}</a>
        </div>
        <div className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Email</h2>
          <a href={`mailto:${SITE.email}`} className="mt-1 block text-body font-semibold text-accent-dark hover:underline">{SITE.email}</a>
        </div>
        <div className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Phone</h2>
          <p className="mt-1 text-body font-semibold text-ink">{SITE.phone}</p>
        </div>
        <div className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Address</h2>
          <p className="mt-1 text-body font-semibold text-ink">{SITE.address}</p>
        </div>
      </div>
    </main>
  );
}
