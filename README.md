# GearUp — Frontend

Sports & outdoor gear rental marketplace. Next.js 16 (App Router) frontend for
the [GearUp backend](https://github.com/usama-21038/gearup-b7a4).

Built for Apollo Level 2 Web Dev — Assignment 5.

## Stack

- **Next.js 16** (App Router, Turbopack, `proxy.ts` route protection)
- **TypeScript**, **Tailwind CSS v4**
- **TanStack Query** for client-side data fetching/mutations in interactive dashboards
- **Zod** for form + API payload validation
- **Stripe Elements** (`@stripe/react-stripe-js`) + **SSLCommerz** redirect for payments
- **shadcn/ui**-style components built on Radix UI primitives
- **Sonner** for toast notifications

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in BACKEND_API_URL and your Stripe key
npm run dev
```

Open http://localhost:3000.

### Seeded accounts (shared demo backend)

| Role  | Email              | Password    |
|-------|--------------------|-------------|
| Admin | admin@gearup.com   | admin123456 |

Register your own Customer / Provider accounts from `/register`.

## Project structure

```
app/
  (public)/           Home, gear browse & detail — public, SEO-friendly
  (auth)/              Login, register — Server Actions + Zod + useActionState
  (dashboard)/         Role-gated shell (Customer / Provider / Admin)
  payment/             /payment/success, /payment/cancel
  api/proxy/[...path]  Forwards client-side requests to the backend with the
                       httpOnly auth cookie attached (see comment in that file)
proxy.ts               Next.js 16's middleware.ts equivalent — UX-level
                       role/route redirects (NOT the real security boundary,
                       see comment inside)
lib/                   API clients, session/cookie handling, Zod schemas, types
components/
  ui/                  Base design-system primitives
  gear/ customer/ provider/ admin/ payment/ dashboard/ shared/
```

## How auth works (short version)

1. Login/Register Server Action calls the backend, gets back `{ user, token }`.
2. The JWT is stored in an **httpOnly** cookie — never readable by browser JS.
3. Server Components / Server Actions attach it via `lib/api.ts`.
4. Client Components (dashboards using TanStack Query) call `/api/proxy/*`
   instead of the backend directly; that route reads the cookie server-side
   and forwards the request. The token never reaches client-side JavaScript.
5. `proxy.ts` decodes (does not verify) the JWT for fast UX redirects. The
   **real** authorization check is the backend re-validating the token's
   signature + expiry + account status on every request.

See `API_INTEGRATION.md` for the full endpoint-to-page mapping.

## Payments

- **Stripe**: `/payments/create` returns a `clientSecret`; the frontend
  renders Stripe's `PaymentElement` and confirms client-side. Test card:
  `4242 4242 4242 4242`, any future expiry, any CVC.
- **SSLCommerz**: `/payments/create` returns a `gatewayPageURL`; the browser
  is redirected there, then back to `/payment/success` or `/payment/cancel`.

Both require the corresponding secret keys to be configured on the **backend**
(Render env vars) — the frontend only needs the Stripe *publishable* key.

## Known trade-offs (worth mentioning in your video)

- Gear photos are stored as plain URLs (matches the backend schema exactly),
  so `next.config.ts` allows any HTTPS image host — fine for coursework, but
  you'd restrict this to an allow-list or your own CDN in production.
- The date picker prevents past dates but doesn't know which exact dates are
  already booked (the backend only exposes total `availableQuantity`, not a
  per-date calendar) — worth naming as a known limitation / future work.
