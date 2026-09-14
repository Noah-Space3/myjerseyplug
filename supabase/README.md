# Supabase setup (MyJerseyPlug)

The app runs in **demo mode** without env vars (catalog in `lib/products.ts`, orders in memory). To go production, connect Supabase:

1. Create a project at supabase.com.
2. Copy `.env.local.example` → `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. In the Supabase SQL editor, run `supabase/schema.sql` (tables + RLS + triggers).
4. Run `supabase/seed.sql` to populate the 8 products (images point at the app's `/public/jerseys` assets).
5. Create your admin user via the app's sign-up, then in the SQL editor:
   ```sql
   update public.profiles set role = 'admin' where id = '<your-user-uuid>';
   ```

## Tables
- `products` — catalogue (public read, admin write).
- `orders` — bank-transfer orders (`pending` → `paid` confirmed by admin). Customer email is matched from the jsonb `customer` object so users see only their own orders.
- `profiles` — auto-created on sign-up (`customer` | `admin`); RLS gates admin views.
- `addresses` — per-user saved addresses.

## Notes
- **Product images are managed from `/admin` → Products.** In Supabase mode, uploading a file stores it in the `product-images` bucket (policies in `schema.sql`) and updates the product's `images.front` (and `back`/`detail` if they were identical placeholders). In demo mode (no env), you can paste an image URL instead.
- **Payments are manual bank transfer.** The checkout creates a `pending` order; the admin marks it `paid` from `/admin` → Orders after receiving the transfer.
- **Real club/national imagery:** product names/teams are real, but the bundled `/public/jerseys/*.jpg` are placeholders. Replace them with your licensed assets (or upload to Supabase Storage and update the `images` jsonb) before going live to avoid trademark issues.
- **Devtools blocking** (`components/layout/DevtoolsGuard.tsx`) is a UX deterrent only — real security is server-side (auth, RLS, server-side price validation in `lib/checkout.ts`).
