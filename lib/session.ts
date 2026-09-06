import "server-only";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import type { JwtSession } from "./types";

export const AUTH_COOKIE = "gearup_token";
const SEVEN_DAYS = 60 * 60 * 24 * 7;

/**
 * Reads the raw JWT from the httpOnly cookie. Server-only.
 */
export async function getToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? null;
}

/**
 * Decodes (does NOT verify the signature) the JWT payload so we can render
 * role-aware UI and redirect people to the right dashboard.
 *
 * Why decode-only and not verify: the frontend never has the backend's
 * JWT_SECRET (and shouldn't - it's a server secret for a different service).
 * That's fine, because the *actual* security boundary is the backend: every
 * single API call below still sends this token as `Authorization: Bearer`,
 * and the backend verifies the signature + expiry + user status on every
 * request, returning 401/403 when it's invalid. This decode is purely a
 * convenience for instant, no-extra-request UI decisions (which nav links to
 * show, which dashboard to redirect to) - never treat it as authorization.
 */
export async function getSession(): Promise<JwtSession | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    const decoded = jwt.decode(token);
    if (!decoded || typeof decoded === "string") return null;
    if (!decoded.id || !decoded.role) return null;
    return decoded as JwtSession;
  } catch {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SEVEN_DAYS,
  });
}

export async function clearAuthCookie() {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

export function dashboardPathForRole(role: string | undefined | null) {
  switch (role) {
    case "ADMIN":
      return "/dashboard/admin";
    case "PROVIDER":
      return "/dashboard/provider";
    case "CUSTOMER":
    default:
      return "/dashboard/customer";
  }
}
