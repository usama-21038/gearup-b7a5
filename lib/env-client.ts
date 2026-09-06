// Client components can't import lib/env.ts (it's marked "server-only" and
// requires BACKEND_API_URL, a server secret path). This file only ever
// touches NEXT_PUBLIC_* vars, which Next.js inlines at build time and are
// safe to ship to the browser.
export const env = {
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
};
