# MyJerseyPlug — Production-Quality Jersey E-commerce

A premium, mobile-first jersey store for the Nigerian market, built from the Master Website
Build Prompt. Stack: **Next.js 14 (App Router) + TypeScript + Tailwind** (image-based customizer,
no 3D engine).

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build (passes, 23 routes)
```

## What's implemented (mapped to the prompt)

- **Design system** — restrained tokens (ink/paper/accent green), display+body type scale,
  spacing, buttons, cards, inputs, focus states, reduced-motion support (`app/globals.css`,
  `tailwind.config.ts`).
- **Homepage** — hero ("Your Jersey. Your Style."), featured collections, best sellers,
  customize-your-kit section, why-us, final CTA.
- **Shop** — responsive grid (2-col mobile), live search, collection/league/type filters,
  price range, in-stock toggle, sorting, empty state (`components/shop/ShopView.tsx`).
- **Product page** — gallery, size + sleeve selection, optional name/number, quantity,
  add-to-cart, details, delivery, JSON-LD structured data (`app/product/[slug]`).
- **Image-based Customizer** (`/customize`) — real product photography preview with a FRONT/BACK
  toggle (subtle crossfade). Kit (top / +shorts / full / +socks), sleeve length, name + number
  (rendered live on the back preview in jersey-style lettering), competition patches, per-item
  sizes. **Live, data-driven pricing** (`lib/pricing.ts`). No 3D — the preview uses real photos
  and swaps to the corresponding image per selection.
- **Cart** — structured line items showing the full configuration; edit customization before
  checkout; quantity/remove; summary (`components/cart`).
- **Checkout** — validated contact/delivery form, delivery methods, summary.
- **Order confirmation** (`/order/[id]`) — confirmed/pending status, summary, delivery, track CTA.
- **Account** — local profile, saved addresses, order history (`/account`).
- **SEO** — per-page metadata, OpenGraph/Twitter, canonical, `sitemap.xml`, `robots.txt`, JSON-LD.
- **Accessibility** — semantic HTML, skip link, labelled controls, visible focus, aria states,
  no colour-only signalling.
- **Loading / empty / error states** — skeletons, empty cart, no-results, out-of-stock,
  payment failure, network errors, dev payment panel.

## Security & payments (deliberately not faked)

- **Prices are never trusted from the client.** `app/api/checkout/route.ts` re-derives every
  item total from the catalog (`lib/checkout.ts`) and rejects tampered base prices (verified:
  a `basePrice: 100` payload is rejected with 400).
- **Payment success is never decided in the frontend.** The order is created `pending`; it is
  marked `paid` only by a server-side webhook (`app/api/webhook/paystack`, signature-checked).
- **Live mode:** set `PAYSTACK_SECRET_KEY` (and/or Flutterwave). The checkout route initializes
  a real transaction and redirects to the provider; the webhook verifies and confirms.
- **Dev mode (no keys configured):** checkout returns a `pending` order; a clearly-labelled
  "simulate provider webhook" button calls the server verify endpoint so the flow is demoable
  without pretending a payment succeeded.

## Notes / honest gaps

- **Imagery** is AI-generated, catalogue-consistent studio product photography (10 images: 8 team
  fronts + a blank kit + hero). The customizer previews the **real blank-kit photo**; drop
  `blank-back.jpg`, `blank-short.jpg`, `blank-long.jpg`, `blank-shorts.jpg`, `blank-socks.jpg`
  into `public/jerseys/` (same lighting/background) to light up those options automatically
  (see `lib/customizer-assets.ts`). Product gallery back/detail shots reuse the front image for now.
- **Auth & persistence** are local (localStorage) for the demo. `lib/orderStore.ts` is an
  in-memory store (attached to `globalThis` so it survives dev re-eval) — replace with a DB
  (Postgres/Prisma) + real auth (NextAuth) for production. Admin (products, inventory, pricing,
  orders) is scoped in `lib/constants.ts` / `lib/pricing.ts` but not built as a UI in this pass.
- **Admin / business logic** (Phase 6) is partially represented: pricing & customization options
  are data-driven (not hard-coded in UI), which satisfies the "product data controls options"
  requirement; a full admin dashboard UI is the natural next step.
