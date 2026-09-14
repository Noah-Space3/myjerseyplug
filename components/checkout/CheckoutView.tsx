'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { DELIVERY_METHODS, STATES_NG, getDeliveryMethods, SITE } from '@/lib/constants';
import { formatNGN } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import { cn } from '@/lib/utils';

type Errors = Partial<Record<'fullName' | 'email' | 'phone' | 'address' | 'state', string>>;

export function CheckoutView() {
  const router = useRouter();
  const { items, subtotal, clear, hydrated } = useCart();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [method, setMethod] = useState(DELIVERY_METHODS[0].value);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (hydrated && items.length === 0) {
    return (
      <div className="shell py-16">
        <EmptyState
          title="Nothing to check out"
          description="Add a jersey or build a custom kit first."
          action={<Button href="/shop">Shop Jerseys</Button>}
        />
      </div>
    );
  }

  const fee = getDeliveryMethods().find((d) => d.value === method)?.fee ?? 0;
  const total = subtotal + fee;

  function validate(): boolean {
    const e: Errors = {};
    if (!fullName.trim()) e.fullName = 'Required';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) e.email = 'Enter a valid email';
    if (!/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) e.phone = 'Enter a valid phone number';
    if (!address.trim()) e.address = 'Required';
    if (!state) e.state = 'Select a state';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setFormError('');
    if (!validate()) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          customer: { fullName, email, phone, address, city, state },
          delivery: { method },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setFormError(data.error ?? 'Something went wrong. Please try again.');
        setSubmitting(false);
        return;
      }
      // Bank transfer: order is created pending. Send the customer to the order page.
      clear();
      router.push(`/order/${data.orderId}`);
    } catch {
      setFormError('Network error. Please check your connection and retry.');
      setSubmitting(false);
    }
  }

  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_360px] lg:py-14">
      <form id="checkout-form" onSubmit={submit} noValidate className="space-y-8">
        <h1 className="text-h2 text-ink">Checkout</h1>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Contact &amp; delivery</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" error={errors.fullName}>
              <input className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Chidi Okafor" />
            </Field>
            <Field label="Email" error={errors.email}>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
            </Field>
            <Field label="City">
              <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Lagos" />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Delivery address" error={errors.address}>
                <input className="input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Street, area, landmark" />
              </Field>
            </div>
            <Field label="State" error={errors.state}>
              <select className="input" value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">Select state…</option>
                {STATES_NG.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Delivery method</h2>
          <div className="mt-4 space-y-2.5">
            {getDeliveryMethods().map((d) => (
              <label
                key={d.value}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 rounded-md border p-3.5 transition-colors',
                  method === d.value ? 'border-ink bg-paper-2' : 'border-line',
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="delivery"
                    checked={method === d.value}
                    onChange={() => setMethod(d.value)}
                    className="h-4 w-4 accent-accent"
                  />
                  <span>
                    <span className="block text-small font-semibold text-ink">{d.label}</span>
                    <span className="block text-small text-ink-muted">{d.eta}</span>
                  </span>
                </span>
                <span className="text-small font-semibold text-ink">{d.fee === 0 ? 'Free' : formatNGN(d.fee)}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-line bg-paper-2 p-5">
          <h2 className="text-h3 text-ink">Payment</h2>
          <p className="mt-2 text-small text-ink-muted">
            We accept <span className="font-semibold text-ink">bank transfer</span>. After you place the order you’ll see our
            account details and your order number — use it as the transfer reference. We confirm your order once payment is received.
          </p>
          <div className="mt-3 rounded-md bg-white p-3 text-small">
            <p><span className="text-ink-muted">Bank:</span> <span className="font-semibold text-ink">{SITE.bank.bankName}</span></p>
            <p><span className="text-ink-muted">Account:</span> <span className="font-semibold text-ink">{SITE.bank.accountName}</span></p>
            <p><span className="text-ink-muted">Number:</span> <span className="font-semibold text-ink">{SITE.bank.accountNumber}</span></p>
          </div>
        </section>

        {formError && (
          <p role="alert" className="rounded-md bg-danger/10 px-4 py-3 text-small font-medium text-danger">
            {formError}
          </p>
        )}
      </form>

      <aside>
        <div className="sticky top-24 rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Summary</h2>
          <ul className="mt-4 space-y-2.5 border-b border-line pb-4">
            {items.map((i) => (
              <li key={i.lineId} className="flex justify-between gap-3 text-small">
                <span className="text-ink-muted">
                  {i.name}
                  {i.quantity > 1 && <span className="text-ink"> ×{i.quantity}</span>}
                </span>
                <span className="font-medium text-ink">{formatNGN(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 text-small">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Subtotal</dt>
              <dd className="font-semibold text-ink">{formatNGN(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Delivery</dt>
              <dd className="font-semibold text-ink">{fee === 0 ? 'Free' : formatNGN(fee)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3">
              <dt className="text-body font-semibold text-ink">Total</dt>
              <dd className="text-price text-ink">{formatNGN(total)}</dd>
            </div>
          </dl>
          <button type="submit" form="checkout-form" disabled={submitting} className="btn-primary mt-5 w-full">
            {submitting ? 'Placing order…' : `Place order · ${formatNGN(total)}`}
          </button>
          <p className="mt-3 text-center text-[11px] text-ink-muted">
            Prices validated server-side · pay by bank transfer
          </p>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
      {error && <p className="mt-1 text-small text-danger">{error}</p>}
    </div>
  );
}
