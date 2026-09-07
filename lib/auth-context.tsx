"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { getCookie, removeCookie, setCookie, ROLE_COOKIE, TOKEN_COOKIE } from "./cookies";
import type { AuthResult, Role, User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (input: { name: string; email: string; password: string; phone?: string; role: Extract<Role, "CUSTOMER" | "PROVIDER"> }) => Promise<User>;
  logout: () => void;
  roleHome: (role?: Role) => string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function persistSession(result: AuthResult) {
  setCookie(TOKEN_COOKIE, result.token, 7);
  setCookie(ROLE_COOKIE, result.user.role, 7);
}

export function roleHomePath(role?: Role | null): string {
  if (role === "PROVIDER") return "/dashboard/provider";
  if (role === "ADMIN") return "/dashboard/admin";
  if (role === "CUSTOMER") return "/dashboard/customer";
  return "/";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getCookie(TOKEN_COOKIE);
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => {
        setUser(u);
        setCookie(ROLE_COOKIE, u.role, 7);
      })
      .catch(() => {
        removeCookie(TOKEN_COOKIE);
        removeCookie(ROLE_COOKIE);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    removeCookie(TOKEN_COOKIE);
    removeCookie(ROLE_COOKIE);
    const result = await authApi.login({ email, password });
    persistSession(result);
    setUser(result.user);
    return result.user;
  }, []);

  const register = useCallback(
    async (input: { name: string; email: string; password: string; phone?: string; role: Extract<Role, "CUSTOMER" | "PROVIDER"> }) => {
      const result = await authApi.register(input);
      persistSession(result);
      setUser(result.user);
      return result.user;
    },
    []
  );

  const logout = useCallback(() => {
    removeCookie(TOKEN_COOKIE);
    removeCookie(ROLE_COOKIE);
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, roleHome: (r) => roleHomePath(r ?? user?.role) }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
