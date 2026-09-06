# Suggested commit plan (do this yourself, not with a script)

The assignment grades **commit history** (20 meaningful commits) as a signal
that you actually built and understood this incrementally — so don't just
`git add . && git commit -m "done"` once. Work through the checklist below:
for each step, **open the listed files, read them, tweak something small if
you want to make it yours** (a color, a copy change, an extra validation
rule), then stage just those files and commit with a message close to the one
suggested. That gives you an honest history AND forces a pass over every part
of the codebase, which is exactly what you'll need for the video walkthrough.

```bash
git init
git add .gitignore
git commit -m "chore: initial commit"
```

1. `chore: scaffold Next.js 16 project with TypeScript and Tailwind`
   → `package.json`, `next.config.ts`, `tsconfig.json`, `app/globals.css`
2. `feat: add design tokens and base layout`
   → `app/layout.tsx`, `app/providers.tsx`, `app/globals.css`
3. `feat: build base UI component library (button, input, card, etc.)`
   → everything in `components/ui/`
4. `feat: add shared types and Zod validation schemas`
   → `lib/types.ts`, `lib/validations.ts`
5. `feat: implement server-side API client and session handling`
   → `lib/api.ts`, `lib/session.ts`, `lib/env.ts`
6. `feat: add client-side API proxy for authenticated dashboard requests`
   → `app/api/proxy/[...path]/route.ts`, `lib/client-api.ts`
7. `feat: add role-based route protection with Next.js proxy`
   → `proxy.ts`
8. `feat: implement registration and login with Server Actions`
   → `app/(auth)/**`
9. `feat: build the public navbar and footer`
   → `components/shared/**`
10. `feat: build the home page with featured gear`
    → `app/(public)/page.tsx`
11. `feat: build gear browsing with real-time filters`
    → `components/gear/gear-browser.tsx`, `app/(public)/gear/page.tsx`
12. `feat: build gear detail page with gallery and rent-now form`
    → `app/(public)/gear/[id]/page.tsx`, `components/gear/gear-gallery.tsx`, `components/gear/rent-form.tsx`
13. `feat: add global error, not-found, and loading states`
    → `app/error.tsx`, `app/global-error.tsx`, `app/not-found.tsx`, `app/loading.tsx`, route-level `loading.tsx` files
14. `feat: build role-aware dashboard shell`
    → `app/(dashboard)/layout.tsx`, `components/dashboard/**`
15. `feat: build customer dashboard with orders and payment history`
    → `components/customer/**`, `app/(dashboard)/dashboard/customer/page.tsx`
16. `feat: integrate Stripe Elements and SSLCommerz payment flow`
    → `components/payment/**`, `app/(dashboard)/dashboard/customer/orders/[id]/pay/page.tsx`, `app/payment/**`
17. `feat: build provider inventory management (CRUD)`
    → `components/provider/gear-form-dialog.tsx`, `components/provider/inventory-table.tsx`
18. `feat: build provider order management with status transitions`
    → `components/provider/orders-table.tsx`, `components/provider/provider-dashboard.tsx`
19. `feat: build admin dashboard (users, gear, rentals, categories)`
    → `components/admin/**`, `app/(dashboard)/dashboard/admin/page.tsx`
20. `docs: add README and API integration map`
    → `README.md`, `API_INTEGRATION.md`

Optional follow-up commits (good for going past 20, and each is a real,
defensible improvement):

- `fix: handle empty states and edge cases in gear browsing`
- `style: polish spacing and responsive layout on mobile`
- `test: manually verify all three role flows end-to-end` (note what you
  tested in the commit body)
- `fix: <whatever bug you actually find while testing>` — you WILL find at
  least one thing worth fixing once you click through every flow yourself,
  and that's a great, 100%-genuinely-yours commit.
