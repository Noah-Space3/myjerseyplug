import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'Frequently asked questions about MyJerseyPlug jerseys, customization, payments and delivery.',
  robots: { index: false, follow: false },
};

const FAQS = [
  { q: 'Are the jerseys authentic?', a: 'We supply licensed and replica football jerseys. Each product lists its type and customization options so you know exactly what you are ordering.' },
  { q: 'Can I customize my kit?', a: 'Yes. Use the Customize page to build a full kit with your name, number, sleeve type and patches. You can also add personalization on most ready-made jerseys.' },
  { q: 'Which payment methods do you accept?', a: 'We use secure bank transfer. After checkout you will receive our account details and a reference to include with your payment.' },
  { q: 'How long does delivery take?', a: 'Standard delivery is 3–5 business days, express 24–48 hours, and Lagos pickup is same day. Exact ETA is shown at checkout.' },
  { q: 'Can I track my order?', a: 'Sign in and open the Orders section of your account to see order status (Pending / Paid / Shipped).' },
];

export default function FaqPage() {
  return (
    <main className="shell max-w-3xl py-16">
      <h1 className="text-h2 text-ink">Frequently asked questions</h1>
      <p className="mt-2 text-body text-ink-muted">Everything you need to know about ordering, customizing and receiving your jersey.</p>
      <div className="mt-8 space-y-4">
        {FAQS.map((f) => (
          <div key={f.q} className="rounded-lg border border-line bg-white p-5">
            <h2 className="text-h3 text-ink">{f.q}</h2>
            <p className="mt-2 text-body text-ink-muted">{f.a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
