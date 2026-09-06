# Video walkthrough — talking points (not a script)

Don't read this word-for-word — the evaluators can tell, and the whole point
of the video is proving *you* understand what you built. Use this as a
checklist of things to cover, and explain each one in your own words after
actually clicking through it. If something below doesn't make sense to you
yet, that's a flag to go re-read that file before recording, not to skip it.

## 1. Architecture overview (~1–2 min)

Open `README.md` and `API_INTEGRATION.md` on screen and explain, in your own
words:
- Why route groups: `(public)`, `(auth)`, `(dashboard)` — same URL structure,
  different layouts.
- The two ways data gets fetched: direct server-side calls (`lib/api.ts`) vs.
  the `/api/proxy/*` route for client components. Explain *why* the second
  one exists (hint: where does the JWT live, and why can't client JS read it).
- What `proxy.ts` does and why it's called `proxy.ts` and not `middleware.ts`
  in this Next.js version — and why it's a UX convenience, not the real
  security boundary (what actually stops an unauthorized request?).

## 2. Three roles, one app (~2–3 min)

Log in as each role live and show:
- **Customer**: browse gear with filters, open a listing, pick dates, place
  a rental, pay with the test Stripe card, see it move through statuses.
- **Provider**: add a gear item, edit it, toggle it inactive, see an
  incoming order, confirm it, mark it picked up / returned.
- **Admin**: suspend a user, moderate a gear listing, manage a category.

Narrate *why* the UI looks different per role (routing + `proxy.ts` +
role checks in the dashboard layout) — don't just click around silently.

## 3. CRUD + validation + error handling (~1–2 min)

- Show a form validation error (e.g. submit register with a short password)
  and explain where that validation runs (Zod, client-visible field errors).
- Trigger a real API error on purpose (e.g. try to rent gear with 0 stock,
  or have a provider try an invalid status transition) and show the toast /
  inline error - explain how `ApiError` / `ClientApiError` centralize this.

## 4. Payment flow (~1 min)

Walk through: `POST /payments/create` → Stripe Elements → `confirmPayment`
→ `POST /payments/confirm` → order status flips to PAID. Mention the
SSLCommerz alternative briefly even if you demo Stripe.

## 5. One technical challenge you solved (~1–2 min, pick ONE)

Good options actually worth explaining honestly:
- Keeping the JWT httpOnly while still letting client-side dashboards do
  live, interactive data fetching (the proxy route pattern).
- Mirroring the backend's `VALID_TRANSITIONS` rules in the provider order
  UI so invalid actions are never even shown, not just rejected.
- Making the real-time gear filters debounced + URL-synced without
  hammering the API on every keystroke.
- The Next.js 16 `middleware.ts` → `proxy.ts` rename and what that told you
  about not trusting the edge layer for real authorization.

Explain: what the problem actually was, what you tried, why the final
approach works. This is the part evaluators weight most - a shallow
"I used TanStack Query" answer is very different from actually explaining
the httpOnly-cookie-vs-client-JS problem it solves here.

## Before you record

- [ ] Actually run through all three roles yourself at least once
- [ ] Make sure you can explain every file you commit, not just this one
- [ ] Have your own backend (or the shared one) seeded with a category and
      at least one gear item so the demo isn't empty
