# API Integration Map

GearUp frontend → backend (`https://github.com/usama-21038/gearup-b7a4`, deployed at
`https://gearup-b7a4-1.onrender.com/api`). Every endpoint below was confirmed against the
backend's actual route/controller/validation source, not just the assignment brief, so paths,
payload shapes, and status transitions match exactly.

All endpoints are called through a single typed client (`lib/api.ts`), grouped by resource:
`authApi`, `gearApi`, `categoryApi`, `rentalApi`, `paymentApi`, `providerApi`, `reviewApi`,
`adminApi`. Every response is unwrapped from the backend's `{ success, message, data, meta }`
envelope; failures throw `ApiError` (`lib/api.ts`) with the backend's `message` and any
per-field `details`, which pages map to toasts and inline form errors.

## Auth

| Frontend | Backend | Notes |
|---|---|---|
| `app/auth/register/page.tsx` | `POST /auth/register` | Role limited to `CUSTOMER` \| `PROVIDER` in the UI (admins aren't self-serve). |
| `app/auth/login/page.tsx` | `POST /auth/login` | |
| `lib/auth-context.tsx` (on app load, if a token cookie exists) | `GET /auth/me` | Confirms the stored JWT is still valid and refreshes the user object. |

## Public gear & categories

| Frontend | Backend | Notes |
|---|---|---|
| `app/page.tsx` (home) | `GET /gear?limit=24&available=true`, `GET /categories` | Featured gear + category tiles with live counts. |
| `app/gear/page.tsx` (browse) | `GET /gear?search&category&brand&minPrice&maxPrice&available&page&limit` | Filters, search (debounced), sort (client-side), pagination via `meta.totalPages`. |
| `app/gear/[id]/page.tsx` | `GET /gear/:id` | Gallery, description, specs, provider info, reviews (embedded in the gear response), "you might also like" via a second `GET /gear?category=`. |

## Rentals (customer)

| Frontend | Backend | Notes |
|---|---|---|
| Gear detail page → "Rent now" | `POST /rentals` | `{ startDate, endDate, items: [{ gearItemId, quantity }] }`. |
| `app/dashboard/customer/orders/page.tsx`, dashboard overview | `GET /rentals` | Scoped to the logged-in customer server-side. |
| `app/dashboard/customer/orders/[id]/page.tsx` | `GET /rentals/:id` | Order detail, timeline, review entry point. |
| Order detail → "Cancel order" | `PATCH /rentals/:id/cancel` | Only shown for `PLACED`/`CONFIRMED` orders, matching backend's allowed-status check. |

## Payments

| Frontend | Backend | Notes |
|---|---|---|
| `app/dashboard/customer/orders/[id]/pay/page.tsx` | `POST /payments/create` `{ rentalOrderId, method }` | `STRIPE` → renders Stripe Elements with the returned `clientSecret`. `SSLCOMMERZ` → full-page redirect to the returned `gatewayPageURL`. |
| `components/stripe-payment-form.tsx` (after `stripe.confirmCardPayment` succeeds) | `POST /payments/confirm` `{ transactionId, status: "COMPLETED" }` | The backend has no Stripe webhook route, so the client confirms directly after Stripe's client-side confirmation — this is the flow the backend's `/payments/confirm` endpoint is designed for. |
| `app/api/payment/sslcommerz/success/route.ts` (backend's `SSLCOMMERZ_SUCCESS_URL`) | `POST /payments/confirm` `{ transactionId, status: "COMPLETED" }` | Receives SSLCommerz's POST redirect, confirms, then 303-redirects the browser to `/payment/success`. |
| `app/api/payment/sslcommerz/fail/route.ts` / `cancel/route.ts` | `POST /payments/confirm` `{ status: "FAILED" }` | Same pattern for `SSLCOMMERZ_FAIL_URL` / `SSLCOMMERZ_CANCEL_URL`. |
| `app/dashboard/customer/payments/page.tsx` | `GET /payments` | Full payment history table. |

## Provider

| Frontend | Backend | Notes |
|---|---|---|
| `app/dashboard/provider/gear/page.tsx` | `GET /provider/gear` | Inventory table; status toggle and delete inline. |
| `app/dashboard/provider/gear/new/page.tsx`, `components/gear-form.tsx` | `POST /provider/gear` | `categoryId` populated from `GET /categories`. |
| `app/dashboard/provider/gear/[id]/edit/page.tsx` | `GET /gear/:id` (read) + `PUT /provider/gear/:id` (save) | Ownership checked client-side against `gear.providerId` before allowing edits. |
| Inventory table → status pill | `PUT /provider/gear/:id` `{ status }` | |
| Inventory table → delete | `DELETE /provider/gear/:id` | Confirmation dialog first. |
| `app/dashboard/provider/orders/page.tsx`, dashboard overview | `GET /provider/orders` | |
| `components/provider-orders-table.tsx` action buttons | `PATCH /provider/orders/:id` `{ status }` | Buttons are generated from the backend's exact state machine: `PLACED → CONFIRMED\|CANCELLED`, `CONFIRMED → CANCELLED`, `PAID → PICKED_UP\|CANCELLED`, `PICKED_UP → RETURNED`. |

## Reviews

| Frontend | Backend | Notes |
|---|---|---|
| Order detail / Reviews page → "Leave a review" | `POST /reviews` `{ gearItemId, rating, comment }` | Only offered for items on `RETURNED` orders. The backend has no "list my reviews" endpoint, so already-reviewed state is tracked client-side per session; a repeat attempt surfaces the backend's own duplicate-review error. |

## Admin

| Frontend | Backend | Notes |
|---|---|---|
| `app/dashboard/admin/users/page.tsx` | `GET /admin/users`, `PATCH /admin/users/:id` `{ status }` | Search/pagination are client-side (backend returns the full list). |
| `app/dashboard/admin/gear/page.tsx` | `GET /admin/gear` | Read-only moderation view — the backend gives admins no gear-mutation endpoint, only providers can edit their own listings. |
| `app/dashboard/admin/orders/page.tsx` | `GET /admin/rentals` | Read-only, filterable by status. |
| `app/dashboard/admin/categories/page.tsx` | `POST /admin/categories`, `PATCH /admin/categories/:id`, `DELETE /admin/categories/:id` | Not called out in the assignment brief, but required in practice: gear creation needs an existing `categoryId`, and only admins can create categories. |

## Notes on adaptations from the raw schema

- **Decimal fields.** Prisma serializes `pricePerDay` / `totalAmount` / `subtotal` / `amount` as
  strings over JSON. `lib/utils.ts#toNumber` and `#fmtCurrency` handle the conversion everywhere
  these are displayed or computed on.
- **No profile-update endpoint.** The backend doesn't expose a way to edit `name`/`phone` after
  registration, so profile pages (`components/profile-view.tsx`) are read-only rather than
  faking a save button that has nowhere to submit to.
- **No per-date availability calendar.** `availableQuantity` is a simple stock counter, not a
  booking calendar, so the date pickers on the gear detail page enforce "no past dates" and
  "return after pickup" but can't grey out specific already-booked dates (the API doesn't expose
  that information).
