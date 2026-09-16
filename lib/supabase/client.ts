'use client';

import { createBrowserClient } from '@supabase/ssr';
import { SUPABASE_ANON, SUPABASE_URL, isSupabaseConfigured } from './env';

let cached: ReturnType<typeof createBrowserClient> | null = null;

export function getSupabaseBrowser() {
  if (!isSupabaseConfigured()) return null;
  if (!cached) {
    // Pass the browser's native fetch explicitly. Without this, the auth client's
    // internal fetch can end up undefined in the Next.js client bundle (only the
    // REST client works), which makes signInWithPassword throw
    // "Cannot read properties of undefined (reading 'fetch')" while Google (a
    // redirect, no fetch) still works.
    cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON, { global: { fetch } });
  }
  return cached;
}
