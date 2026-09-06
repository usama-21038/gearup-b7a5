# API Integration Map

Every backend endpoint used by this frontend, where it's called from, and
which file(s) implement the call. Base URL: `BACKEND_API_URL` (see `.env.example`).

## Auth (`/auth`)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/auth/register` | POST | Register page | `app/(auth)/_actions/auth-actions.ts` → `registerAction` |
| `/auth/login` | POST | Login page | `app/(auth)/_actions/auth-actions.ts` → `loginAction` |
| `/auth/me` | GET | Navbar, dashboard layout | `components/shared/navbar.tsx`, `app/(dashboard)/layout.tsx` |

## Categories (`/categories`, public)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/categories` | GET | Home page chips, gear filter dropdown, provider "add gear" category select, admin category manager | `app/(public)/page.tsx`, `app/(public)/gear/page.tsx`, `components/provider/gear-form-dialog.tsx`, `components/admin/category-manager.tsx` |

## Gear (`/gear`, public read)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/gear?...filters` | GET | Home (featured), Browse gear page (search/category/brand/price/availability filters, pagination) | `app/(public)/page.tsx`, `components/gear/gear-browser.tsx` |
| `/gear/:id` | GET | Gear detail page (includes provider, category, reviews) | `app/(public)/gear/[id]/page.tsx` |

## Rentals (`/rentals`, customer)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/rentals` | POST | "Rent now" on gear detail page | `components/gear/rent-form.tsx` |
| `/rentals` | GET | Customer dashboard order list | `components/customer/customer-dashboard.tsx` |
| `/rentals/:id` | GET | Payment page order summary | `app/(dashboard)/dashboard/customer/orders/[id]/pay/page.tsx` |
| `/rentals/:id/cancel` | PATCH | Cancel button on an order | `components/customer/cancel-rental-button.tsx` |

## Payments (`/payments`)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/payments/create` | POST | Gateway picker (Stripe or SSLCommerz) | `components/payment/payment-gateway-picker.tsx` |
| `/payments/confirm` | POST | Stripe client-side confirm callback; `/payment/success` and `/payment/cancel` (also handles SSLCommerz redirect-back) | `components/payment/stripe-payment-form.tsx`, `app/payment/success/page.tsx`, `app/payment/cancel/page.tsx` |
| `/payments` | GET | Customer dashboard payment history | `components/customer/customer-dashboard.tsx` |

## Provider (`/provider`, provider-only)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/provider/gear` | GET | Inventory table | `components/provider/inventory-table.tsx` |
| `/provider/gear` | POST | Add gear dialog | `components/provider/gear-form-dialog.tsx` |
| `/provider/gear/:id` | PUT | Edit gear dialog, active/inactive toggle | `components/provider/gear-form-dialog.tsx`, `components/provider/inventory-table.tsx` |
| `/provider/gear/:id` | DELETE | Delete gear confirm dialog | `components/provider/inventory-table.tsx` |
| `/provider/orders` | GET | Orders tab, overview stats | `components/provider/orders-table.tsx`, `components/provider/provider-overview.tsx` |
| `/provider/orders/:id` | PATCH | Confirm / cancel / mark picked up / mark returned action buttons | `components/provider/orders-table.tsx` |

## Reviews (`/reviews`, customer)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/reviews` | POST | "Leave a review" dialog on a returned order | `components/customer/review-dialog.tsx` |

## Admin (`/admin`, admin-only)

| Endpoint | Method | Used in | File |
|---|---|---|---|
| `/admin/users` | GET | Users tab | `components/admin/users-table.tsx` |
| `/admin/users/:id` | PATCH | Suspend / activate button | `components/admin/users-table.tsx` |
| `/admin/gear` | GET | Gear oversight tab | `components/admin/admin-gear-table.tsx` |
| `/admin/rentals` | GET | Rentals oversight tab | `components/admin/admin-rentals-table.tsx` |
| `/admin/categories` | POST | New category dialog | `components/admin/category-manager.tsx` |
| `/admin/categories/:id` | PATCH | Edit category dialog | `components/admin/category-manager.tsx` |
| `/admin/categories/:id` | DELETE | Delete category confirm | `components/admin/category-manager.tsx` |

## Two request paths, one reason

- **Server Components / Server Actions** call the backend directly through
  `lib/api.ts` (`apiFetch`), attaching the JWT from the httpOnly cookie
  server-side. Used for: public pages (SSR/SEO), auth actions, dashboard
  layout's live `/auth/me` check, the payment page's order summary.
- **Client Components** (interactive dashboards using TanStack Query) call
  `/api/proxy/*` via `lib/client-api.ts` (`clientApiFetch`). That route
  (`app/api/proxy/[...path]/route.ts`) reads the same httpOnly cookie
  server-side and forwards the request — so the JWT is never exposed to
  browser JavaScript, even though the dashboards feel fully client-interactive
  (optimistic-feeling refetches, no full page reloads on every action).
