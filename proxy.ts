import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { JwtSession } from "@/lib/types";
import { AUTH_COOKIE } from "@/lib/session";

/**
 * NOTE ON NAMING: Next.js 16 renamed `middleware.ts` -> `proxy.ts` (and the
 * exported function `middleware` -> `proxy`) to make it clear this file sits
 * at the network boundary rather than being general app middleware. Logic-
 * wise it is exactly what the assignment brief calls "Next.js Middleware".
 *
 * This does two jobs:
 *  1. UX-level route protection: bounce logged-out users away from
 *     /dashboard/**, bounce logged-in users away from /login, /register, and
 *     send each role to ITS OWN dashboard section if they try another role's.
 *  2. Nothing here is the real security boundary. We only decode the JWT
 *     (no signature check - the frontend doesn't hold the backend's secret),
 *     so treat every redirect here as "nice UX", not "access control". The
 *     backend re-validates the token's signature, expiry and user status on
 *     every single request and returns 401/403 on its own - that's the part
 *     that actually keeps data safe, by design (see lib/session.ts).
 */

const AUTH_ROUTES = ["/login", "/register"];
const ROLE_HOME: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  PROVIDER: "/dashboard/provider",
  CUSTOMER: "/dashboard/customer",
};

function decodeRole(token: string | undefined): JwtSession | null {
  if (!token) return null;
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    // decode() doesn't check expiry either - do a cheap manual check so a
    // stale cookie doesn't grant a false "logged in" UI state.
    if (decoded.exp && Date.now() >= decoded.exp * 1000) return null;
    return decoded as JwtSession;
  } catch {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const session = decodeRole(token);

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r);
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Logged in and visiting /login or /register -> send them to their dashboard.
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role] ?? "/", request.url));
  }

  // Not logged in and trying to reach any dashboard -> send to login, remember where they wanted to go.
  if (!session && isDashboardRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Logged in, but the wrong role for this dashboard section -> send to their own dashboard.
  if (session && isDashboardRoute) {
    const ownHome = ROLE_HOME[session.role];
    const isOwnSection = ownHome && pathname.startsWith(ownHome);
    if (!isOwnSection) {
      return NextResponse.redirect(new URL(ownHome ?? "/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp)$).*)"],
};
