# The Potter's Design — React Rebuild (Scaffold)

A skeletal React storefront for rebuilding **pottersdesign.com** (currently
WordPress + WooCommerce + Elementor) on a modern stack. This scaffold mirrors the
live site's structure — hero carousel, filterable product grid, feature section,
hot picks, plus Shop / Product / Cart / Wishlist / About pages — with a deliberate
heritage-meets-modern identity instead of a stock WooCommerce theme.

## Stack

- **React 18** + **TypeScript**
- **Vite** (dev server + build)
- **React Router v6** (routing)
- **Zustand** (cart + wishlist, persisted to `localStorage`)
- **Tailwind CSS** (design tokens in `tailwind.config.js`)

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # preview the build
```

## Project structure

```
src/
├── components/
│   ├── RootLayout.tsx     # header + footer + scroll restoration
│   ├── Header.tsx         # nav, language, search, wishlist, cart count
│   ├── Footer.tsx         # link columns + newsletter
│   ├── HeroCarousel.tsx   # 3 auto-advancing hero slides
│   ├── ProductCard.tsx    # image hover, badges, wishlist, add/select
│   ├── ShopFilters.tsx    # the WooCommerce filter, rebuilt as controlled state
│   └── Sections.tsx       # FeatureGrid + MarqueeStrip
├── pages/
│   ├── HomePage.tsx       ├── ShopPage.tsx     ├── ProductPage.tsx
│   ├── AboutPage.tsx      ├── CartPage.tsx     ├── WishlistPage.tsx
│   └── NotFoundPage.tsx
├── store/useStore.ts      # cart / wishlist / compare (Zustand + persist)
├── data/products.ts       # catalog seeded from the live store
├── lib/format.ts          # naira formatting + price helpers
├── types/index.ts         # Product, CartLine, ShopFilterState, …
├── router.tsx
├── main.tsx
└── index.css              # Tailwind layers + component classes
```

## Design tokens

Defined in `tailwind.config.js`:

| Token | Hex | Role |
|---|---|---|
| `ink` | `#16130F` | text, dark sections |
| `bone` | `#F4EFE6` | page background |
| `indigo` | `#283A5B` | aso-oke heritage — primary brand |
| `ochre` | `#C8852B` | clay-gold accent — CTAs |
| `clay` | `#8C4A38` | warm secondary |
| `mist` | `#DED5C6` | lines, borders |

Type: **Fraunces** (display) + **Manrope** (body), loaded in `index.html`.

## The filter bug — note

The live site's filter issue comes from the WooCommerce Products Filter plugin.
In this rebuild, `ShopFilters` is a **controlled component**: all filter state
lives in one place (`ShopPage` state) and filtering runs in a single pure
`useMemo`. No plugin, no DOM race conditions — the class of bug being debugged
on WordPress can't occur here.

## Replacing the placeholder data (next step)

`src/data/products.ts` is static, seeded from the live catalog. To go live, swap it
for a real source — options:

1. **Headless WooCommerce** — keep WordPress as the backend, pull products via the
   WooCommerce Store API (`/wp-json/wc/store/products`). Lowest-migration path.
2. **Own backend** — Firebase / Supabase / custom API.

Keep the `Product` type as the contract and only the data layer changes; every
component already consumes that shape.

## What's intentionally left as TODO

- Real product descriptions (placeholders marked `TODO` in `ProductPage`/`AboutPage`)
- Checkout integration (Paystack / Flutterwave for NGN)
- Product image galleries (currently repeat the main image)
- Search modal, compare drawer, size-guide modal
- i18n wiring (language switcher is UI-only for now)
