import { NextRequest, NextResponse } from "next/server";

// Lightweight route gating: we only check for the presence of a token cookie
// and a role cookie set at login (see lib/auth-context.tsx). We deliberately
// do NOT verify the JWT signature here — the backend is the source of truth
// for authorization and will reject invalid/expired tokens on every request.
// This middleware exists purely so logged-out visitors (or a customer poking
// at /dashboard/admin) get redirected before the page renders, instead of
// flashing protected content.

const ROLE_FOR_PREFIX: Array<{ prefix: string; role: string }> = [
  { prefix: "/dashboard/customer", role: "CUSTOMER" },
  { prefix: "/dashboard/provider", role: "PROVIDER" },
  { prefix: "/dashboard/admin", role: "ADMIN" },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = ROLE_FOR_PREFIX.find((r) => pathname.startsWith(r.prefix));
  if (!match) return NextResponse.next();

  const token = request.cookies.get("gearup_token")?.value;
  const role = request.cookies.get("gearup_role")?.value;

  if (!token || !role) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (role !== match.role) {
    const homeByRole: Record<string, string> = {
      CUSTOMER: "/dashboard/customer",
      PROVIDER: "/dashboard/provider",
      ADMIN: "/dashboard/admin",
    };
    return NextResponse.redirect(new URL(homeByRole[role] || "/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
