// Centralized, validated environment configuration.
// Throws early (at import time, server-side only) if something required is missing,
// instead of failing deep inside a random fetch call later.

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable "${name}". Check your .env.local file (see .env.example).`
    );
  }
  return value;
}

export const env = {
  // Server-only: the real GearUp backend base URL, e.g. https://gearup-b7a4-1.onrender.com/api
  backendApiUrl: required("BACKEND_API_URL", process.env.BACKEND_API_URL),

  // Exposed to the browser: Stripe publishable (public) key for Stripe Elements.
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
};
