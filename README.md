# GearUp — Frontend

Next.js (App Router) + TypeScript + Tailwind frontend for GearUp, a sports & outdoor gear rental
platform. Consumes the backend at [usama-21038/gearup-b7a4](https://github.com/usama-21038/gearup-b7a4).

See **[API_INTEGRATION.md](./API_INTEGRATION.md)** for the full endpoint map.

## Admin credentials (deployed backend)

```
Email:    admin@gearup.com
Password: Password123!
```

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the Stripe key (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | No | Defaults to `https://gearup-b7a4-1.onrender.com/api`. Point this at a local backend if you're running one. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Yes, for Stripe payments | A `pk_test_...` key from the **same Stripe account** whose secret key (`sk_test_...`) is set as `STRIPE_SECRET_KEY` on the backend. Get one at https://dashboard.stripe.com/test/apikeys. Without this set, the card payment form shows a friendly "not configured" message instead of crashing — SSLCommerz payments still work. |

## Payment integration — how it actually works

The backend has **no payment webhooks**; instead it exposes `POST /payments/create` (which
returns either a Stripe `clientSecret` or an SSLCommerz `gatewayPageURL`) and a public
`POST /payments/confirm` that the frontend is expected to call once payment completes.

### Stripe (Elements)

1. `dashboard/customer/orders/[id]/pay` → `POST /payments/create { method: "STRIPE" }` → gets a `clientSecret`.
2. `components/stripe-payment-form.tsx` mounts Stripe Elements' `CardElement` with that secret and calls `stripe.confirmCardPayment(...)` client-side.
3. On success, the frontend calls `POST /payments/confirm { transactionId, status: "COMPLETED" }` and redirects to `/payment/success`.

Test with Stripe's standard test card: `4242 4242 4242 4242`, any future expiry, any CVC.

### SSLCommerz — **backend env vars you must set**

SSLCommerz redirects the customer's browser back to the backend's configured
`success_url` / `fail_url` / `cancel_url` after checkout (as an auto-submitting POST). Those URLs
must point at **this frontend's** Route Handlers, which confirm the payment against the backend
and then forward the browser to a friendly page. On your backend deployment (Render → your
service → Environment), set:

```
SSLCOMMERZ_SUCCESS_URL=https://<your-frontend-domain>/api/payment/sslcommerz/success
SSLCOMMERZ_FAIL_URL=https://<your-frontend-domain>/api/payment/sslcommerz/fail
SSLCOMMERZ_CANCEL_URL=https://<your-frontend-domain>/api/payment/sslcommerz/cancel
```

Replace `<your-frontend-domain>` with wherever this Next.js app is deployed (e.g. your Vercel
URL), then redeploy the backend so the new env vars take effect. Until you do this, SSLCommerz
checkout will complete but redirect back to whatever URL the backend currently has configured
instead of this app.

## Error handling

- **Toasts** (`lib/toast-context.tsx`) for action outcomes (payments, status changes, deletes).
- **Inline field errors** on every form, mapped from the backend's Zod validation `details` array
  (`ApiError.fieldErrors()` in `lib/api.ts`).
- **`error.tsx` boundaries** at the root, `/gear`, and `/dashboard` segments, plus a custom
  `not-found.tsx`.
- **`loading.tsx` skeletons** at the root, `/gear`, and `/dashboard` segments, alongside
  component-level skeletons for in-page data fetches.

## Auth & route protection

JWT + role are stored in cookies at login (`lib/auth-context.tsx`, `lib/cookies.ts`).
`middleware.ts` gates `/dashboard/customer/**`, `/dashboard/provider/**`, and
`/dashboard/admin/**` by role before the page ever renders; `lib/use-role-guard.ts` is a
client-side backstop for the case where a token cookie is present but the backend rejects it
(expired/invalid), redirecting once `GET /auth/me` resolves.

## Known limitations (by design, matching what the API actually supports)

- No profile-editing screen — the backend has no update-profile endpoint.
- No per-date "blocked out" calendar on the gear detail page — the API only exposes a stock
  count (`availableQuantity`), not a booking calendar.
- Admin's gear/orders views are read-only — the backend gives admins `GET` access only for those
  resources; mutation stays with the owning provider/customer.
- Category management lives under **Admin → Categories** (not in the original requirements
  table, but required in practice: gear creation needs an existing category, and only admins can
  create one).
