'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { getMyOrders } from '@/lib/supabase/client-data';
import { formatNGN } from '@/lib/format';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/States';
import type { Order } from '@/lib/types';

interface Address {
  id: string;
  label: string;
  line: string;
  city: string;
  state: string;
}

export function AccountView() {
  const sb = getSupabaseBrowser();
  const router = useRouter();
  const [mode, setMode] = useState<'loading' | 'guest' | 'auth'>('loading');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [busy, setBusy] = useState(false);

  // Supabase mode
  const [userId, setUserId] = useState<string | null>(null);
  const [profileName, setProfileName] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!sb) {
      setMode('guest');
      return;
    }
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUserId(data.session.user.id);
        setMode('auth');
        loadProfile(data.session.user.id, data.session.user.email ?? '');
        loadOrders(data.session.user.email ?? '');
      } else {
        setMode('guest');
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setMode('auth');
        loadProfile(session.user.id, session.user.email ?? '');
        loadOrders(session.user.email ?? '');
      } else {
        setMode('guest');
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sb]);

  async function loadProfile(uid: string, mail: string) {
    if (!sb) return;
    const { data } = await sb.from('profiles').select('full_name, phone').eq('id', uid).maybeSingle();
    setProfileName(data?.full_name ?? '');
    setPhone(data?.phone ?? '');
    const { data: addr } = await sb.from('addresses').select('*').eq('user_id', uid);
    setAddresses((addr ?? []) as Address[]);
  }

  async function loadOrders(mail: string) {
    const all = await getMyOrders(mail);
    setOrders(all);
  }

  async function submitAuth(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) {
      setAuthError('Sign-in is unavailable — Supabase is not configured.');
      return;
    }
    setBusy(true);
    setAuthError('');
    try {
      const fn = authMode === 'signup' ? sb.auth.signUp : sb.auth.signInWithPassword;
      const { data, error } = await fn({ email, password });
      if (error) {
        setAuthError(error.message);
        return;
      }
      // Supabase may return a user without a session when email confirmation is required.
      if (authMode === 'signup' && !data.session) {
        setAuthError('Account created. Check your email to confirm your address, then sign in.');
        return;
      }
      // Resolve the session explicitly so the UI updates even if the
      // onAuthStateChange listener is slow or has been torn down.
      const { data: sess } = await sb.auth.getSession();
      const user = sess.session?.user;
      if (!user) return;
      setUserId(user.id);
      setMode('auth');
      loadProfile(user.id, user.email ?? '');
      loadOrders(user.email ?? '');
      // Admin users land on the admin dashboard.
      const { data: prof } = await sb
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
      if (prof?.role === 'admin') router.push('/admin');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to connect to the authentication service.');
    } finally {
      setBusy(false);
    }
  }

  async function signInWithGoogle() {
    if (!sb) {
      setAuthError('Sign-in is unavailable — Supabase is not configured.');
      return;
    }
    setBusy(true);
    setAuthError('');
    try {
      const { error } = await sb.auth.signInWithOAuth({
        provider: 'google',
        // Works for both login and signup: a new Google email creates an account
        // (our handle_new_user trigger adds a profiles row with role='customer').
        options: { redirectTo: window.location.origin + '/account' },
      });
      if (error) {
        setAuthError(error.message);
        setBusy(false);
      }
      // On success the browser navigates to Google; the component unmounts.
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Unable to connect to Google.');
      setBusy(false);
    }
  }

  async function signOut() {
    if (sb) await sb.auth.signOut();
    setUserId(null);
    setMode('guest');
  }

  if (mode === 'loading') {
    return <div className="shell max-w-md py-16"><div className="h-40 animate-pulse rounded-lg bg-paper-3" /></div>;
  }

  if (mode === 'guest') {
    return (
      <div className="shell max-w-md py-16">
        <h1 className="text-h2 text-ink">Account</h1>
        <p className="mt-2 text-body text-ink-muted">Sign in to view orders and saved addresses.</p>
        <form onSubmit={submitAuth} className="mt-6 space-y-4 rounded-lg border border-line bg-white p-5">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
          </div>
          {authError && <p className="text-small text-danger">{authError}</p>}
          <Button type="submit" fullWidth disabled={busy}>{busy ? 'Please wait…' : authMode === 'signup' ? 'Create account' : 'Sign in'}</Button>
          <div className="relative my-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-line" /></div>
            <div className="relative flex justify-center"><span className="bg-white px-2 text-[11px] text-ink-muted">or</span></div>
          </div>
          <button
            type="button"
            onClick={signInWithGoogle}
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 py-2.5 text-small font-medium text-ink transition-colors hover:bg-paper-2"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.61l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6.01C43.68 39.1 46.98 33.85 46.98 24.55z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6.01c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Continue with Google
          </button>
          <p className="text-center text-[11px] text-ink-muted">
            {sb ? (
              <button type="button" className="underline" onClick={() => setAuthMode(authMode === 'signup' ? 'signin' : 'signup')}>
                {authMode === 'signup' ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            ) : (
              'Sign-in is unavailable — Supabase is not configured.'
            )}
          </p>
        </form>
      </div>
    );
  }

  // Authenticated
  return (
    <div className="shell grid gap-8 py-10 lg:grid-cols-[1fr_340px] lg:py-14">
      <div className="space-y-8">
        <section className="rounded-lg border border-line bg-white p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-h3 text-ink">Profile</h2>
            <button onClick={signOut} className="text-small font-semibold text-ink-muted hover:text-danger">Sign out</button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Name</label>
              <input className="input" value={profileName} onChange={(e) => setProfileName(e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="label">Phone</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08012345678" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Email</label>
              <input className="input bg-paper-2" value={email} disabled />
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-line bg-white p-5">
          <h2 className="text-h3 text-ink">Saved addresses</h2>
          <ul className="mt-4 space-y-3">
            {addresses.length === 0 && <p className="text-small text-ink-muted">No saved addresses yet.</p>}
            {addresses.map((a) => (
              <li key={a.id} className="rounded-md border border-line p-3">
                <p className="text-small font-semibold text-ink">{a.label}</p>
                <p className="text-small text-ink-muted">{a.line}, {a.city} {a.state}</p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside>
        <h2 className="text-h3 text-ink">Orders</h2>
        {orders.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="No orders yet" description="Your orders will appear here." action={<Button href="/shop">Shop now</Button>} />
          </div>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.map((o) => (
              <li key={o.id}>
                <Link href={`/order/${o.id}`} className="block rounded-lg border border-line bg-white p-4 hover:border-ink/30">
                  <div className="flex items-center justify-between">
                    <span className="text-small font-semibold text-ink">{o.id}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${o.status === 'paid' ? 'bg-accent-soft text-accent-dark' : 'bg-paper-3 text-ink-muted'}`}>
                      {o.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-small text-ink-muted">
                    <span>{o.items.length} item{o.items.length > 1 ? 's' : ''}</span>
                    <span className="font-semibold text-ink">{formatNGN(o.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
