import { NextResponse } from 'next/server';
import { getSupabaseServer } from '@/lib/supabase/server';
import { confirmOrderSupabase } from '@/lib/supabase/data';
import { markOrderPaid } from '@/lib/orderStore';

export const runtime = 'nodejs';

// Admin-only: confirm a bank-transfer payment.
export async function POST(req: Request) {
  const sb = getSupabaseServer();
  if (sb) {
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    const { data: profile } = await sb.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 });
    }
  }

  const { orderId } = await req.json().catch(() => ({}) as any);
  if (!orderId) return NextResponse.json({ ok: false, error: 'Missing orderId' }, { status: 400 });

  const ok = await confirmOrderSupabase(orderId);
  if (ok) return NextResponse.json({ ok: true });

  // Fallback (no Supabase): in-memory store.
  const done = markOrderPaid(orderId);
  return NextResponse.json(done ? { ok: true } : { ok: false, error: 'Not found' }, { status: done ? 200 : 404 });
}
