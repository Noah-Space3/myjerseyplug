import { createClient } from '@supabase/supabase-js';
import { SUPABASE_SERVICE, SUPABASE_URL } from './env';

let cached: any = null;

// Service-role client — server-only. Bypasses RLS for trusted writes (orders, admin).
export function getSupabaseAdmin(): any {
  if (!SUPABASE_URL || !SUPABASE_SERVICE) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_SERVICE, { auth: { persistSession: false } });
  }
  return cached;
}
