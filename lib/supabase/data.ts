import { createClient } from '@supabase/supabase-js';
import type { CartItem, Order, Product } from '@/lib/types';
import { PRODUCTS } from '@/lib/products';
import { getOrder, getAllOrders } from '@/lib/orderStore';
import { getSupabaseAdmin } from './admin';
import { SUPABASE_ANON, SUPABASE_URL, isSupabaseConfigured } from './env';

let _public: any = null;
// Cookie-free anon client for public reads — safe during static generation / build.
function getSupabasePublic(): any {
  if (!isSupabaseConfigured()) return null;
  if (!_public) {
    _public = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });
  }
  return _public;
}

function mapProduct(r: any): Product {
  return {
    id: r.id,
    slug: r.slug,
    name: r.name,
    team: r.team,
    league: r.league,
    collection: r.collection,
    type: r.type,
    price: r.price,
    currency: 'NGN',
    colors: r.colors ?? [],
    images: r.images,
    sizes: r.sizes ?? ['S', 'M', 'L', 'XL', 'XXL'],
    sleeveTypes: r.sleeve_types ?? ['short', 'long'],
    customizable: r.customizable ?? true,
    customization: r.customization ?? { name: true, number: true, patches: [] },
    bestseller: r.bestseller ?? false,
    isNew: r.is_new ?? false,
    inStock: r.in_stock ?? true,
    description: r.description ?? '',
    details: r.details ?? [],
    delivery: r.delivery ?? 'Delivered nationwide.',
  };
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return PRODUCTS;
  try {
    const sb = getSupabasePublic();
    if (!sb) return PRODUCTS;
    const { data, error } = await sb.from('products').select('*').order('created_at', { ascending: true });
    if (error || !data?.length) return PRODUCTS;
    return data.map(mapProduct);
  } catch {
    return PRODUCTS;
  }
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return PRODUCTS.find((p) => p.slug === slug);
  try {
    const sb = getSupabasePublic();
    if (!sb) return PRODUCTS.find((p) => p.slug === slug);
    const { data, error } = await sb.from('products').select('*').eq('slug', slug).maybeSingle();
    if (error || !data) return PRODUCTS.find((p) => p.slug === slug);
    return mapProduct(data);
  } catch {
    return PRODUCTS.find((p) => p.slug === slug);
  }
}

export async function insertOrderSupabase(order: Order): Promise<string | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return null;
  const { error } = await sb.from('orders').insert({
    id: order.id,
    created_at: order.createdAt,
    items: order.items as any,
    subtotal: order.subtotal,
    delivery_fee: order.deliveryFee,
    total: order.total,
    status: order.status,
    customer: order.customer as any,
    delivery: order.delivery as any,
    payment_ref: order.paymentRef ?? null,
  });
  if (error) {
    console.error('insertOrderSupabase failed', error.message);
    return null;
  }
  return order.id;
}

export async function getOrderSupabase(id: string): Promise<Order | null> {
  const sb = getSupabaseAdmin();
  if (!sb) return getOrder(id) ?? null;
  const { data, error } = await sb.from('orders').select('*').eq('id', id).maybeSingle();
  if (error || !data) return getOrder(id) ?? null;
  return rowToOrder(data);
}

export async function getOrdersSupabase(): Promise<Order[]> {
  const sb = getSupabaseAdmin();
  if (!sb) return getAllOrders();
  const { data, error } = await sb.from('orders').select('*').order('created_at', { ascending: false });
  if (error || !data) return getAllOrders();
  return data.map(rowToOrder);
}

export async function confirmOrderSupabase(id: string): Promise<boolean> {
  const sb = getSupabaseAdmin();
  if (!sb) return false;
  const { error } = await sb.from('orders').update({ status: 'paid', payment_ref: 'bank-transfer' }).eq('id', id);
  return !error;
}

function rowToOrder(r: any): Order {
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
