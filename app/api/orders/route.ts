import { NextResponse } from 'next/server';
import { getOrdersSupabase } from '@/lib/supabase/data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const orders = await getOrdersSupabase();
  return NextResponse.json({ ok: true, orders });
}
