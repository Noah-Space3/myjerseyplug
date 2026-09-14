-- MyJerseyPlug — Supabase schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- NOTE: profiles is created FIRST because later policies reference it.

create extension if not exists "pgcrypto";

-- ---------- PROFILES (create first; other policies depend on it) ----------
create table if not exists public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  full_name  text,
  phone      text,
  role       text not null default 'customer' -- 'customer' | 'admin'
);

alter table public.profiles enable row level security;

drop policy if exists "profiles readable by owner" on public.profiles;
create policy "profiles readable by owner" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles writable by owner" on public.profiles;
create policy "profiles writable by owner" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "profiles admin full" on public.profiles;
create policy "profiles admin full" on public.profiles
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- New users automatically get a profile row.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- PRODUCTS ----------
create table if not exists public.products (
  id            text primary key,
  slug          text unique not null,
  name          text not null,
  team          text not null,
  league        text not null,
  collection    text not null,
  type          text not null default 'player',
  price         integer not null check (price >= 0),
  colors        jsonb not null default '[]',
  images        jsonb not null default '{"front":""}',
  sizes         text[] not null default array['S','M','L','XL','XXL'],
  sleeve_types  text[] not null default array['short','long'],
  customizable  boolean not null default true,
  customization jsonb not null default '{"name":true,"number":true,"patches":[]}',
  bestseller    boolean not null default false,
  is_new        boolean not null default false,
  in_stock      boolean not null default true,
  description   text not null default '',
  details       jsonb not null default '[]',
  delivery      text not null default 'Delivered nationwide.',
  created_at    timestamptz not null default now()
);

create index if not exists products_league_idx on public.products (league);
create index if not exists products_collection_idx on public.products (collection);

alter table public.products enable row level security;

drop policy if exists "products readable by all" on public.products;
create policy "products readable by all" on public.products
  for select using (true);

drop policy if exists "products writable by admins" on public.products;
create policy "products writable by admins" on public.products
  for all to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ---------- ORDERS ----------
create table if not exists public.orders (
  id           text primary key,
  created_at   timestamptz not null default now(),
  items        jsonb not null default '[]',
  subtotal     integer not null default 0,
  delivery_fee integer not null default 0,
  total        integer not null default 0,
  status       text not null default 'pending', -- pending | paid | shipped | cancelled
  customer     jsonb not null,
  delivery     jsonb not null,
  payment_ref  text
);

create index if not exists orders_created_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

drop policy if exists "orders visible to owner" on public.orders;
create policy "orders visible to owner" on public.orders
  for select to authenticated
  using (customer->>'email' = auth.email());

drop policy if exists "orders insertable by anon" on public.orders;
create policy "orders insertable by anon" on public.orders
  for insert to anon, authenticated with check (true);

drop policy if exists "orders managed by admins" on public.orders;
create policy "orders managed by admins" on public.orders
  for update to authenticated
  using (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'))
  with check (exists (select 1 from public.profiles where id = auth.uid() and role = 'admin'));

-- ---------- ADDRESSES ----------
create table if not exists public.addresses (
  id       uuid primary key default gen_random_uuid(),
  user_id  uuid not null references auth.users (id) on delete cascade,
  label    text not null,
  line     text not null,
  city     text not null,
  state    text not null
);

alter table public.addresses enable row level security;

drop policy if exists "addresses owner only" on public.addresses;
create policy "addresses owner only" on public.addresses
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------- STORAGE: product images ----------
-- Public bucket for jersey photos managed from /admin.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product images admin write" on storage.objects;
create policy "product images admin write" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  )
  with check (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'admin')
  );

-- ---------- GRANTS ----------
-- Supabase auto-grants privileges for tables made in the Table Editor, but NOT for
-- tables created via raw SQL. Grant explicitly; RLS still enforces row-level access.
grant usage on schema public to anon, authenticated, service_role;

grant select on public.products to anon, authenticated;
grant all on public.products to service_role;

grant select, insert, update, delete on public.orders to authenticated;
grant insert on public.orders to anon;
grant all on public.orders to service_role;

grant all on public.profiles to authenticated;
grant all on public.profiles to service_role;

grant all on public.addresses to authenticated;
grant all on public.addresses to service_role;

-- Run supabase/seed.sql afterwards to populate products.
-- To make a user an admin: update public.profiles set role='admin' where id='<user-uuid>';
