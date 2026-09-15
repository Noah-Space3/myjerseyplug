import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getSupabaseServer } from '@/lib/supabase/server';
import { AdminApp } from '@/components/admin/AdminApp';

export const metadata: Metadata = {
  title: 'Admin',
  description: 'MyJerseyPlug back office — products, pricing, inventory, delivery and orders.',
  robots: { index: false, follow: false },
};

// Server-side authorization for the /admin route. The browser client persists the
// session in cookies, so the server can read it here. This is the primary gate;
// AdminApp also re-checks on the client as defense in depth. RLS additionally
// enforces every data mutation regardless of what the UI does.
export default async function AdminPage() {
  const sb = getSupabaseServer();
  // Misconfigured (no env) → fall back to the client's config notice.
  if (!sb) return <AdminApp />;

  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect('/account');

  const { data: profile } = await sb
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();
  if (profile?.role !== 'admin') redirect('/account');

  return <AdminApp />;
}
