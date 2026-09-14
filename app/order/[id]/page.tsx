import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getOrderSupabase } from '@/lib/supabase/data';
import { getOrder } from '@/lib/orderStore';
import { formatNGN } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { CheckIcon, TruckIcon } from '@/components/ui/icons';
import { SITE } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Order',
  robots: { index: false, follow: false },
};

export default async function OrderPage({ params }: { params: { id: string } }) {
  const order = (await getOrderSupabase(params.id)) ?? getOrder(params.id);
  if (!order) notFound();

  const paid = order.status === 'paid';

  return (
    <div className="shell max-w-2xl py-12 lg:py-16">
      <div className="text-center">
        <span
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
            paid ? 'bg-accent-soft text-accent-dark' : 'bg-paper-3 text-ink-muted'
          }`}
        >
          <CheckIcon className="h-7 w-7" />
        </span>
        <h1 className="mt-5 text-h2 text-ink">{paid ? 'Order confirmed' : 'Awaiting payment'}</h1>
        <p className="mt-2 text-body text-ink-muted">
          {paid
            ? 'Thanks! We’ve received your payment and will start preparing your order.'
            : 'Place your bank transfer using the details below, then we’ll confirm your order.'}
        </p>
        <p className="mt-1 text-small text-ink-muted">
          Order number <span className="font-semibold text-ink">{order.id}</span>
        </p>
      </div>

      {!paid && (
        <div className="mt-8 rounded-lg border border-line bg-paper-2 p-5">
          <h2 className="text-h3 text-ink">Pay by bank transfer</h2>
          <dl className="mt-3 space-y-2 text-small">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Bank</dt>
              <dd className="font-semibold text-ink">{SITE.bank.bankName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Account name</dt>
              <dd className="font-semibold text-ink">{SITE.bank.accountName}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-muted">Account number</dt>
              <dd className="font-semibold text-ink">{SITE.bank.accountNumber}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-ink-muted">Amount</dt>
              <dd className="font-semibold text-ink">{formatNGN(order.total)}</dd>
            </div>
          </dl>
          <p className="mt-3 text-small text-ink-muted">
            Use your order number as the transfer reference. We’ll confirm within 24 hours of receiving payment.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-lg border border-line bg-white p-5">
        <div className="flex items-center justify-between border-b border-line pb-4">
          <span className="text-label uppercase text-ink-muted">Payment status</span>
          <span
            className={`rounded-full px-3 py-1 text-small font-semibold ${
              paid ? 'bg-accent-soft text-accent-dark' : 'bg-paper-3 text-ink-muted'
            }`}
          >
            {paid ? 'Paid' : 'Pending'}
          </span>
        </div>

        <ul className="mt-4 space-y-3">
          {order.items.map((i) => (
            <li key={i.lineId} className="flex justify-between gap-3 text-small">
              <span className="text-ink">
                {i.name}
                {i.quantity > 1 && <span className="text-ink-muted"> ×{i.quantity}</span>}
                {i.configurationLabel && <span className="block text-ink-muted">{i.configurationLabel}</span>}
              </span>
              <span className="font-medium text-ink">{formatNGN(i.unitPrice * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-line pt-4 text-small">
          <div className="flex justify-between">
            <dt className="text-ink-muted">Subtotal</dt>
            <dd className="font-medium text-ink">{formatNGN(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-muted">Delivery</dt>
            <dd className="font-medium text-ink">{order.deliveryFee === 0 ? 'Free' : formatNGN(order.deliveryFee)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3">
            <dt className="text-body font-semibold text-ink">Total</dt>
            <dd className="text-price text-ink">{formatNGN(order.total)}</dd>
          </div>
        </dl>
      </div>

      <div className="mt-5 rounded-lg border border-line bg-paper-2 p-5">
        <div className="flex items-start gap-3">
          <TruckIcon className="mt-0.5 h-5 w-5 text-accent-dark" />
          <div>
            <p className="text-small font-semibold text-ink">Delivery</p>
            <p className="text-small text-ink-muted">
              {order.delivery.method} · {order.delivery.eta}
            </p>
            <p className="mt-1 text-small text-ink-muted">
              {order.customer.fullName}, {order.customer.address}, {order.customer.city} {order.customer.state}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/shop" variant={paid ? 'primary' : 'outline'}>
          Continue shopping
        </Button>
        <Button href="/account" variant="ghost">
          View in account
        </Button>
      </div>
    </div>
  );
}
