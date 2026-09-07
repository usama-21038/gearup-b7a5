"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, roleHomePath } from "./auth-context";
import type { Role } from "./types";

/**
 * Client-side backstop for role protection. middleware.ts already redirects
 * based on cookies before the page renders; this hook additionally handles
 * the case where the cookie was present but the token turned out to be
 * invalid/expired (auth-context's initial `me()` call clears it), or the
 * user's role changed server-side since the cookie was set.
 */
export function useRoleGuard(requiredRole: Role) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/auth/login");
      return;
    }
    if (user.role !== requiredRole) {
      router.replace(roleHomePath(user.role));
    }
  }, [loading, user, requiredRole, router]);

  return { user, ready: !loading && !!user && user.role === requiredRole };
}
