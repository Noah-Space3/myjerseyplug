'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { Logo } from '@/components/layout/Logo';
import { NAV_DESKTOP, NAV_SHOP_LINKS, SITE } from '@/lib/constants';
import { getSupabaseBrowser } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  CartIcon,
  CloseIcon,
  MenuIcon,
  SearchIcon,
  UserIcon,
  ChevronDown,
} from '@/components/ui/icons';

type Profile = { full_name: string | null; avatar_id: string | null } | null;

function toggleTheme(mode: 'light' | 'dark') {
  const root = document.documentElement;
  if (mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  try {
    localStorage.setItem('mjp-theme', mode);
  } catch {
    /* ignore */
  }
}

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auth state for the account control.
  const [authed, setAuthed] = useState(false);
  const [profile, setProfile] = useState<Profile>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Resolve the signed-in user + avatar so the header can show the profile menu.
  useEffect(() => {
    const sb = getSupabaseBrowser();
    if (!sb) return;
    sb.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setAuthed(true);
        sb.from('profiles')
          .select('full_name, avatar_id')
          .eq('id', data.session.user.id)
          .maybeSingle()
          .then(({ data: p }) => setProfile(p));
      } else {
        setAuthed(false);
        setProfile(null);
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        setAuthed(true);
        sb.from('profiles')
          .select('full_name, avatar_id')
          .eq('id', session.user.id)
          .maybeSingle()
          .then(({ data: p }) => setProfile(p));
      } else {
        setAuthed(false);
        setProfile(null);
        setMenuOpen(false);
      }
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  // Close the profile menu on outside click.
  useEffect(() => {
    if (!menuOpen) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [menuOpen]);

  async function signOut() {
    const sb = getSupabaseBrowser();
    if (sb) await sb.auth.signOut();
    setAuthed(false);
    setProfile(null);
    setMenuOpen(false);
    router.push('/account');
  }

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
    setSearchOpen(false);
  }

  const isShop = pathname.startsWith('/shop') || pathname.startsWith('/product');

  return (
    <>
      <header className="sticky top-0 z-[60] border-b border-line bg-paper-warm/90 backdrop-blur-md">
        <div className="shell flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              className="btn-ghost -ml-2 px-2 lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <Link href="/" aria-label="MyJerseyPlug home">
              <Logo />
            </Link>
          </div>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {/* Shop with dropdown */}
            <div className="relative group">
              <Link
                href="/shop"
                className={cn(
                  'flex items-center gap-1 rounded-full px-3.5 py-2 text-small font-medium transition-colors hover:bg-paper-2',
                  isShop ? 'bg-paper-2 text-ink' : 'text-ink/80 hover:text-ink',
                )}
              >
                Shop <ChevronDown className="h-3.5 w-3.5" />
              </Link>
              <div className="absolute left-0 top-full hidden pt-2 group-hover:block group-focus-within:block">
                <div className="w-60 rounded-lg border border-line bg-white p-2 shadow-lift">
                  {NAV_SHOP_LINKS.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className="block rounded-md px-3 py-2 text-small font-medium text-ink/80 hover:bg-paper-2 hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {NAV_DESKTOP.filter((n) => n.label !== 'Shop').map((item) => {
              const href = item.href.split('?')[0];
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'rounded-full px-3.5 py-2 text-small font-medium transition-colors hover:bg-paper-2',
                    active ? 'bg-paper-2 text-ink' : 'text-ink/80 hover:text-ink',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <button
              className="btn-ghost px-2"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Search"
              aria-expanded={searchOpen}
            >
              <SearchIcon className="h-5 w-5" />
            </button>

            {authed ? (
              <div className="relative" ref={menuRef}>
                <button
                  className="btn-ghost relative px-2"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Account menu"
                  aria-expanded={menuOpen}
                >
                  {profile?.avatar_id ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`/avatars/${profile.avatar_id}.svg`}
                      alt=""
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <UserIcon className="h-5 w-5" />
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-lg border border-line bg-white shadow-lift">
                    <div className="border-b border-line px-4 py-3">
                      <p className="text-small font-semibold text-ink">{profile?.full_name || 'My account'}</p>
                      <p className="text-[11px] text-ink-muted">Signed in</p>
                    </div>
                    <div className="py-1">
                      <Link href="/account" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-small text-ink hover:bg-paper-2">
                        Orders
                      </Link>
                      <Link href="/account" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-small text-ink hover:bg-paper-2">
                        Account
                      </Link>
                      <Link href="/faq" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-small text-ink hover:bg-paper-2">
                        FAQ
                      </Link>
                      <Link href="/contact" onClick={() => setMenuOpen(false)} className="block px-4 py-2 text-small text-ink hover:bg-paper-2">
                        Contact
                      </Link>
                    </div>
                    <div className="border-t border-line py-1">
                      <button
                        onClick={() => {
                          toggleTheme('light');
                          setMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-small text-ink hover:bg-paper-2"
                      >
                        Light Mode
                      </button>
                      <button
                        onClick={() => {
                          toggleTheme('dark');
                          setMenuOpen(false);
                        }}
                        className="block w-full px-4 py-2 text-left text-small text-ink hover:bg-paper-2"
                      >
                        Dark Mode
                      </button>
                      <button
                        onClick={signOut}
                        className="block w-full px-4 py-2 text-left text-small font-semibold text-danger hover:bg-paper-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/account" className="btn-ghost px-2" aria-label="Account">
                <UserIcon className="h-5 w-5" />
              </Link>
            )}

            <Link
              href="/cart"
              className="btn-ghost relative px-2"
              aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
            >
              <CartIcon className="h-5 w-5" />
              {count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Search row */}
        {searchOpen && (
          <div className="border-t border-line bg-paper-warm">
            <form onSubmit={submitSearch} className="shell flex items-center gap-3 py-3">
              <SearchIcon className="h-5 w-5 text-ink-muted" />
              <input
                ref={searchInputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search teams, leagues or players…"
                className="w-full bg-transparent text-body text-ink placeholder:text-ink-muted focus:outline-none"
                aria-label="Search products"
              />
              <button type="button" className="btn-ghost px-2" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <CloseIcon className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer — sibling of <header>, not a child, so the header's
          backdrop-filter cannot become its containing block (which collapsed
          the fixed overlay into the 64px header strip). */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 flex h-full w-[86%] max-w-xs flex-col bg-paper-warm shadow-lift">
            <div className="flex h-16 items-center justify-between border-b border-line px-5">
              <Logo />
              <button className="btn-ghost px-2" onClick={() => setMobileOpen(false)} aria-label="Close menu">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <p className="px-1 text-label uppercase text-ink-muted">Shop</p>
              <div className="mt-2 space-y-1">
                {NAV_SHOP_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="block rounded-md px-3 py-2.5 text-small font-medium text-ink hover:bg-paper-2">
                    {l.label}
                  </Link>
                ))}
              </div>

              <div className="my-3 border-t border-line" />

              <p className="px-1 text-label uppercase text-ink-muted">Menu</p>
              <div className="mt-2 space-y-1">
                {NAV_DESKTOP.filter((n) => n.label !== 'Shop').map((item) => (
                  <Link key={item.label} href={item.href} className="block rounded-md px-3 py-2.5 text-small font-medium text-ink hover:bg-paper-2">
                    {item.label}
                  </Link>
                ))}
                <Link href="/account" className="block rounded-md px-3 py-2.5 text-small font-medium text-ink hover:bg-paper-2">
                  My Account
                </Link>
              </div>

              <div className="my-3 border-t border-line" />
              <div className="px-1 text-small text-ink-muted">
                <p className="font-semibold text-ink">{SITE.phone}</p>
                <p>{SITE.email}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
