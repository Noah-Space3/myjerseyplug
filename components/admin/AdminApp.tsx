'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCatalog } from '@/lib/catalog-store';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { Logo } from '@/components/layout/Logo';
import { SIZES_TOP } from '@/lib/constants';
import { formatNGN } from '@/lib/format';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/icons';
import type { Order, Product, SizeTop } from '@/lib/types';

const ADMIN_CODE = 'admin';
type Tab = 'overview' | 'products' | 'pricing' | 'delivery' | 'orders' | 'customers';

const TABS: { value: Tab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'products', label: 'Products' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'delivery', label: 'Delivery' },
  { value: 'orders', label: 'Orders' },
  { value: 'customers', label: 'Customers' },
];

export function AdminApp() {
  const sb = getSupabaseBrowser();
  const catalog = useCatalog();
  const [demoUnlocked, setDemoUnlocked] = useState(false);
  const [session, setSession] = useState<{ user?: { email?: string } } | null | undefined>(undefined);
  const [role, setRole] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [tab, setTab] = useState<Tab>('overview');

  useEffect(() => {
    if (!sb) {
      setSession(null);
      if (typeof window !== 'undefined' && sessionStorage.getItem('mjp_admin') === '1') setDemoUnlocked(true);
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (!data.session) {
        setSession(null);
        return;
      }
      setSession(data.session);
      sb.from('profiles').select('role').eq('id', data.session!.user.id).maybeSingle().then(({ data: r }) => setRole(r?.role ?? null));
    });
  }, [sb]);

  function unlock() {
    if (code === ADMIN_CODE) {
      sessionStorage.setItem('mjp_admin', '1');
      setDemoUnlocked(true);
    } else {
      setCodeError('Incorrect code.');
    }
  }

  // ---- Gate ----
  if (sb && session === undefined) {
    return <div className="shell py-16"><div className="h-40 animate-pulse rounded-lg bg-paper-3" /></div>;
  }
  if (sb && !session) {
    return (
      <div className="shell max-w-sm py-16 text-center">
        <h1 className="text-h2 text-ink">Admin</h1>
        <p className="mt-2 text-body text-ink-muted">Sign in with an admin account to continue.</p>
        <Link href="/account" className="btn-primary mt-6">Sign in</Link>
      </div>
    );
  }
  if (sb && session && role !== 'admin') {
    return (
      <div className="shell max-w-sm py-16 text-center">
        <h1 className="text-h2 text-ink">Not authorized</h1>
        <p className="mt-2 text-body text-ink-muted">Your account does not have admin access.</p>
        <Link href="/" className="btn-outline mt-6">Back to store</Link>
      </div>
    );
  }
  if (!sb && !demoUnlocked) {
    return (
      <div className="shell flex min-h-[70vh] items-center justify-center py-16">
        <div className="w-full max-w-sm rounded-lg border border-line bg-white p-8 text-center">
          <Logo />
          <h1 className="mt-4 text-h3 text-ink">MyJerseyPlug Admin</h1>
          <p className="mt-1 text-small text-ink-muted">Enter the demo passcode to continue.</p>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && unlock()}
            type="password"
            placeholder="Passcode"
            className="input mt-5 text-center"
            aria-label="Admin passcode"
          />
          {codeError && <p className="mt-2 text-small text-danger">{codeError}</p>}
          <Button onClick={unlock} fullWidth className="mt-4">Unlock</Button>
          <p className="mt-3 text-[11px] text-ink-muted">Demo code: <span className="font-mono">admin</span> · not real authentication.</p>
          <Link href="/" className="mt-3 inline-block text-small text-accent-dark hover:underline">Back to store</Link>
        </div>
      </div>
    );
  }

  const adminMode = Boolean(sb); // true = Supabase-backed, false = localStorage demo

  return (
    <div className="shell flex flex-col gap-8 py-10 lg:flex-row lg:py-14">
      <aside className="lg:w-56 lg:shrink-0">
        <div className="lg:sticky lg:top-24">
          <div className="flex items-center gap-2">
            <Logo />
            <span className="text-[15px] font-bold tracking-tight">Admin</span>
          </div>
          <nav className="mt-5 flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
            {TABS.map((t) => (
              <button
                key={t.value}
                onClick={() => setTab(t.value)}
                className={cn(
                  'whitespace-nowrap rounded-full px-4 py-2 text-small font-semibold transition-colors',
                  tab === t.value ? 'bg-ink text-white' : 'text-ink-muted hover:bg-paper-2 hover:text-ink',
                )}
                aria-current={tab === t.value}
              >
                {t.label}
              </button>
            ))}
          </nav>
          <Link href="/" className="mt-6 hidden items-center gap-1.5 text-small font-semibold text-accent-dark hover:underline lg:flex">
            View store <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        {tab === 'overview' && <OverviewTab adminMode={adminMode} />}
        {tab === 'products' && <ProductsTab adminMode={adminMode} />}
        {tab === 'pricing' && <PricingTab />}
        {tab === 'delivery' && <DeliveryTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'customers' && <CustomersTab />}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-white p-5">
      <p className="text-label uppercase text-ink-muted">{label}</p>
      <p className="mt-2 text-h2 text-ink">{value}</p>
    </div>
  );
}

function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/api/orders')
      .then((r) => r.json())
      .then((d) => setOrders(d.orders ?? []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);
  return { orders, loading };
}

function OverviewTab({ adminMode }: { adminMode: boolean }) {
  const catalog = useCatalog();
  const { orders } = useOrders();
  const products = adminMode ? catalog.products : catalog.products;
  const inStock = products.filter((p) => p.inStock).length;
  const paid = orders.filter((o) => o.status === 'paid');
  const revenue = paid.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h1 className="text-h2 text-ink">Overview</h1>
      <p className="mt-1 text-small text-ink-muted">Store health at a glance.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Products" value={String(products.length)} />
        <StatCard label="In stock" value={String(inStock)} />
        <StatCard label="Orders" value={String(orders.length)} />
        <StatCard label="Revenue" value={formatNGN(revenue)} />
      </div>
      {!adminMode && (
        <div className="mt-6 rounded-lg border border-line bg-paper-2 p-5 text-small text-ink-muted">
          <p className="font-semibold text-ink">Demo mode</p>
          <p className="mt-1">Supabase is not configured, so product, pricing and delivery changes persist in this browser only. Connect Supabase to make them server-side and shared.</p>
        </div>
      )}
    </div>
  );
}

function ProductsTab({ adminMode }: { adminMode: boolean }) {
  const catalog = useCatalog();
  const sb = getSupabaseBrowser();
  const [prods, setProds] = useState<Product[]>([]);
  const [uploadingId, setUploadingId] = useState<string | null>(null);

  useEffect(() => {
    if (adminMode && sb) {
      sb.from('products').select('*').order('created_at', { ascending: true }).then(({ data, error }) => {
        if (!error && data) setProds(data.map(mapRow));
      });
    }
  }, [adminMode, sb]);

  const display = adminMode ? prods : catalog.products;

  function update(id: string, patch: Partial<Product>) {
    if (adminMode && sb) {
      setProds((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      sb.from('products').update(patch as any).eq('id', id);
    } else {
      catalog.updateProduct(id, patch);
    }
  }

  async function uploadImage(p: Product, file: File) {
    if (!sb) return;
    setUploadingId(p.id);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `products/${p.id}-${Date.now()}.${ext}`;
      const { error } = await sb.storage.from('product-images').upload(path, file, { contentType: file.type, upsert: false });
      if (error) {
        alert('Upload failed: ' + error.message);
        return;
      }
      const { data } = sb.storage.from('product-images').getPublicUrl(path);
      const url = data.publicUrl;
      const images = { ...p.images, front: url };
      if (p.images.back === p.images.front) images.back = url;
      if (p.images.detail === p.images.front) images.detail = url;
      update(p.id, { images });
    } finally {
      setUploadingId(null);
    }
  }

  return (
    <div>
      <h1 className="text-h2 text-ink">Products</h1>
      <p className="mt-1 text-small text-ink-muted">
        Edit price, stock, personalization, sizes and images. Changes save automatically.
      </p>
      {adminMode && (
        <div className="mt-4 rounded-lg border border-line bg-paper-2 p-4 text-small text-ink-muted">
          <p className="font-semibold text-ink">Image uploads</p>
          <p className="mt-1">
            Uploads are stored in the Supabase <code className="font-mono">product-images</code> bucket (public). Ensure the bucket
            and its policies from <code className="font-mono">supabase/schema.sql</code> exist.
          </p>
        </div>
      )}
      <div className="mt-6 space-y-4">
        {display.map((p) => (
          <div key={p.id} className="rounded-lg border border-line bg-white p-4">
            <div className="flex gap-4">
              <div className="flex shrink-0 flex-col items-center gap-2">
                <div className="relative h-20 w-16 overflow-hidden rounded-md bg-paper-2">
                  <Image src={p.images.front} alt={p.name} fill sizes="64px" className="object-cover" />
                </div>
                {adminMode ? (
                  <label className="btn-outline cursor-pointer px-2 py-1 text-[11px]">
                    {uploadingId === p.id ? 'Uploading…' : 'Upload'}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) uploadImage(p, f);
                        e.target.value = '';
                      }}
                    />
                  </label>
                ) : (
                  <span className="px-2 text-[11px] text-ink-muted">demo</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-ink">{p.name}</p>
                <p className="text-small text-ink-muted">{p.team} · {p.league}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <label className="flex items-center gap-2 text-small text-ink">
                    Price
                    <input
                      type="number"
                      value={p.price}
                      onChange={(e) => update(p.id, { price: Math.max(0, Number(e.target.value)) })}
                      className="input w-28 py-1.5 text-small"
                    />
                  </label>
                  <Toggle label="In stock" value={p.inStock} onChange={(v) => update(p.id, { inStock: v })} />
                  <Toggle label="Customizable" value={p.customizable} onChange={(v) => update(p.id, { customizable: v })} />
                </div>
                <div className="mt-3">
                  <p className="mb-1.5 text-small font-medium text-ink">Sizes</p>
                  <div className="flex flex-wrap gap-2">
                    {SIZES_TOP.map((s) => {
                      const on = p.sizes.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => update(p.id, { sizes: on ? p.sizes.filter((x) => x !== s) : [...p.sizes, s as SizeTop] })}
                          className={cn('chip min-w-[2.75rem] text-center', on && 'chip-active')}
                          aria-pressed={on}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>
                {!adminMode && (
                  <div className="mt-3">
                    <label className="text-small font-medium text-ink">Image URL</label>
                    <input
                      value={p.images.front}
                      onChange={(e) => update(p.id, { images: { ...p.images, front: e.target.value } })}
                      className="input mt-1 w-full py-1.5 text-small"
                      placeholder="https://…"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function mapRow(r: any): Product {
  return {
    id: r.id, slug: r.slug, name: r.name, team: r.team, league: r.league, collection: r.collection,
    type: r.type, price: r.price, currency: 'NGN', colors: r.colors ?? [], images: r.images,
    sizes: r.sizes ?? ['S', 'M', 'L', 'XL', 'XXL'], sleeveTypes: r.sleeve_types ?? ['short', 'long'],
    customizable: r.customizable ?? true, customization: r.customization ?? { name: true, number: true, patches: [] },
    bestseller: r.bestseller ?? false, isNew: r.is_new ?? false, inStock: r.in_stock ?? true,
    description: r.description ?? '', details: r.details ?? [], delivery: r.delivery ?? 'Delivered nationwide.',
  };
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center gap-2 text-small font-medium text-ink" aria-pressed={value}>
      <span className={cn('relative h-5 w-9 rounded-full transition-colors', value ? 'bg-accent' : 'bg-paper-3')}>
        <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform', value ? 'left-4' : 'left-0.5')} />
      </span>
      {label}
    </button>
  );
}

function PricingTab() {
  const { customizationPricing, setCustomization } = useCatalog();
  const [local, setLocal] = useState(customizationPricing);
  useEffect(() => setLocal(customizationPricing), [customizationPricing]);

  const fields: { key: keyof typeof customizationPricing; label: string }[] = [
    { key: 'nameNumber', label: 'Name + number' },
    { key: 'patch', label: 'Per patch' },
    { key: 'shorts', label: 'Shorts add-on' },
    { key: 'socks', label: 'Socks add-on' },
  ];

  return (
    <div>
      <h1 className="text-h2 text-ink">Customization pricing</h1>
      <p className="mt-1 text-small text-ink-muted">These drive live pricing in the customizer and on cart totals.</p>
      <div className="mt-6 max-w-md space-y-4 rounded-lg border border-line bg-white p-5">
        {fields.map((f) => (
          <label key={f.key} className="flex items-center justify-between gap-4 text-small">
            <span className="font-medium text-ink">{f.label}</span>
            <input
              type="number"
              value={local[f.key]}
              onChange={(e) => setLocal((l) => ({ ...l, [f.key]: Math.max(0, Number(e.target.value)) }))}
              className="input w-32 py-1.5 text-right text-small"
            />
          </label>
        ))}
        <Button onClick={() => setCustomization(local)} className="mt-2">Save pricing</Button>
      </div>
    </div>
  );
}

function DeliveryTab() {
  const { deliveryMethods, setDelivery } = useCatalog();
  const [local, setLocal] = useState(deliveryMethods);
  useEffect(() => setLocal(deliveryMethods), [deliveryMethods]);

  return (
    <div>
      <h1 className="text-h2 text-ink">Delivery settings</h1>
      <p className="mt-1 text-small text-ink-muted">Fees and ETAs shown at checkout.</p>
      <div className="mt-6 max-w-xl space-y-4 rounded-lg border border-line bg-white p-5">
        {local.map((m, i) => (
          <div key={m.value} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <input
              value={m.label}
              onChange={(e) => setLocal((l) => l.map((x, idx) => (idx === i ? { ...x, label: e.target.value } : x)))}
              className="input py-1.5 text-small sm:col-span-2"
            />
            <label className="flex items-center gap-2 text-small text-ink">
              Fee
              <input
                type="number"
                value={m.fee}
                onChange={(e) => setLocal((l) => l.map((x, idx) => (idx === i ? { ...x, fee: Math.max(0, Number(e.target.value)) } : x)))}
                className="input w-20 py-1.5 text-small"
              />
            </label>
            <input
              value={m.eta}
              onChange={(e) => setLocal((l) => l.map((x, idx) => (idx === i ? { ...x, eta: e.target.value } : x)))}
              className="input py-1.5 text-small"
              placeholder="ETA"
            />
          </div>
        ))}
        <Button onClick={() => setDelivery(local)} className="mt-2">Save delivery</Button>
      </div>
    </div>
  );
}

function OrdersTab() {
  const { orders, loading } = useOrders();
  if (loading) return <p className="text-small text-ink-muted">Loading orders…</p>;
  if (orders.length === 0) return <p className="text-small text-ink-muted">No orders yet.</p>;

  async function confirm(id: string) {
    await fetch('/api/admin/confirm-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderId: id }),
    });
    location.reload();
  }

  return (
    <div>
      <h1 className="text-h2 text-ink">Orders</h1>
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div key={o.id} className="rounded-lg border border-line bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-body font-semibold text-ink">{o.id}</p>
                <p className="text-small text-ink-muted">
                  {o.customer.fullName} · {o.items.length} item{o.items.length > 1 ? 's' : ''} · {o.createdAt.slice(0, 10)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={cn('rounded-full px-2.5 py-0.5 text-[11px] font-semibold', o.status === 'paid' ? 'bg-accent-soft text-accent-dark' : 'bg-paper-3 text-ink-muted')}>
                  {o.status}
                </span>
                <span className="text-price text-ink">{formatNGN(o.total)}</span>
              </div>
            </div>
            {o.status !== 'paid' && (
              <button onClick={() => confirm(o.id)} className="btn-outline mt-3">Mark as paid (bank transfer received)</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CustomersTab() {
  const { orders, loading } = useOrders();
  const customers = new Map<string, { name: string; email: string; phone: string; orders: number }>();
  orders.forEach((o) => {
    const c = customers.get(o.customer.email);
    if (c) c.orders += 1;
    else customers.set(o.customer.email, { name: o.customer.fullName, email: o.customer.email, phone: o.customer.phone, orders: 1 });
  });

  if (loading) return <p className="text-small text-ink-muted">Loading…</p>;
  if (customers.size === 0) return <p className="text-small text-ink-muted">No customers yet.</p>;

  return (
    <div>
      <h1 className="text-h2 text-ink">Customers</h1>
      <div className="mt-6 overflow-hidden rounded-lg border border-line bg-white">
        <table className="w-full text-left text-small">
          <thead className="bg-paper-2 text-ink-muted">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Phone</th>
              <th className="px-4 py-3 font-semibold">Orders</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {Array.from(customers.values()).map((c) => (
              <tr key={c.email}>
                <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                <td className="px-4 py-3 text-ink-muted">{c.email}</td>
                <td className="px-4 py-3 text-ink-muted">{c.phone}</td>
                <td className="px-4 py-3 text-ink">{c.orders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
