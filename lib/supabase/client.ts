'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON, SUPABASE_URL, isSupabaseConfigured } from './env';

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (!isSupabaseConfigured()) return null;
  if (!cached) cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON);
  return cached;
}
