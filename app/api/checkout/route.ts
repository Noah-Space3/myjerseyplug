import { NextResponse } from 'next/server';
import { createOrder } from '@/lib/orderStore';
import { verifyItems } from '@/lib/checkout';
import { getDeliveryMethods } from '@/lib/constants';
import { insertOrderSupabase } from '@/lib/supabase/data';
import type { CartItem, Order } from '@/lib/types';

export const runtime = 'nodejs';

function makeId(prefix: string) {
  return prefix + '-' + Math.random().toString(36).slice(2, 7).toUpperCase() + Date.now().toString(36).slice(-3).toUpperCase();
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request body.' }, { status: 400 });
  }

  const items: CartItem[] = body.items ?? [];
  const verify = verifyItems(items);
  if (!verify.ok) {
    return NextResponse.json({ ok: false, error: verify.error }, { status: 400 });
  }

  const method = getDeliveryMethods().find((d) => d.value === body.delivery?.method) ?? getDeliveryMethods()[0];
  const deliveryFee = method.fee;
  const total = verify.subtotal + deliveryFee;

  const customer = {
    fullName: String(body.customer?.fullName ?? '').trim(),
    email: String(body.customer?.email ?? '').trim(),
    phone: String(body.customer?.phone ?? '').trim(),
    address: String(body.customer?.address ?? '').trim(),
    city: String(body.customer?.city ?? '').trim(),
    state: String(body.customer?.state ?? '').trim(),
  };

  if (!customer.fullName || !customer.email || !customer.phone || !customer.address || !customer.state) {
    return NextResponse.json({ ok: false, error: 'Please complete all required fields.' }, { status: 400 });
  }

  const order: Order = {
    id: makeId('ORD'),
    createdAt: new Date().toISOString(),
    items,
    subtotal: verify.subtotal,
    deliveryFee,
    total,
    // Bank transfer: order is created pending; admin confirms payment after receiving it.
    status: 'pending',
    customer,
    delivery: { method: method.label, eta: method.eta },
  };

  // Persist: Supabase when configured, otherwise in-memory demo store.
  const supabaseId = await insertOrderSupabase(order);
  if (!supabaseId) createOrder(order);

  return NextResponse.json({ ok: true, orderId: order.id });
}
