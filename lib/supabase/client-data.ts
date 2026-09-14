'use client';

import { getSupabaseBrowser } from './client';
import type { CartItem, Order } from '@/lib/types';

function mapRow(r: any): Order {
  return {
    id: r.id,
    createdAt: r.created_at,
    items: r.items as CartItem[],
    subtotal: r.subtotal,
    deliveryFee: r.delivery_fee,
    total: r.total,
    status: r.status,
    customer: r.customer,
    delivery: r.delivery,
    paymentRef: r.payment_ref ?? undefined,
  };
}

// Client-safe: reads the caller's own orders via RLS. Falls back to the API when
// Supabase isn't configured (in-memory demo store).
export async function getMyOrders(email: string): Promise<Order[]> {
  const sb = getSupabaseBrowser();
  if (!sb) {
    const res = await fetch('/api/orders').then((r) => r.json()).catch(() => ({ orders: [] }));
    return (res.orders ?? []).filter((o: Order) => o.customer.email.toLowerCase() === email.toLowerCase());
  }
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error || !data) return [];
  return data
    .map(mapRow)
    .filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
}
