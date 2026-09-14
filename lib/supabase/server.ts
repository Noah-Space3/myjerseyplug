import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { SUPABASE_ANON, SUPABASE_URL, isSupabaseConfigured } from './env';

export function getSupabaseServer() {
  if (!isSupabaseConfigured()) return null;
  const store = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return store.getAll().map((c) => ({ name: c.name, value: c.value }));
      },
      setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => store.set(name, value, options as any));
        } catch {
          /* called from a Server Component; safe to ignore */
        }
      },
    },
  });
}
