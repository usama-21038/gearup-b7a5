"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { loginAction } from "../_actions/authActions";

export default function LoginForm({ registered = false }: { registered?: boolean }) {
  const [state, action, pending] = useActionState(loginAction, false);
  const [showPassword, setShowPassword] = useState(false);
  const errorMessage = state && typeof state === "object" && "success" in state && !state.success ? state.message : undefined;

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  return (
    <form action={action} className="space-y-5" noValidate={false}>
      {registered ? <div className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-3.5 py-3 text-sm text-[#166534]">Account created. Log in to continue.</div> : null}
      {errorMessage ? <div className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3 text-sm text-[#991b1b]" role="alert">{errorMessage}</div> : null}
      <div>
        <label htmlFor="login-email" className="mb-1.5 block text-[13px] font-semibold">Email</label>
        <div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="login-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="pl-9" /></div>
      </div>
      <div>
        <div className="mb-1.5 flex items-center justify-between"><label htmlFor="login-password" className="block text-[13px] font-semibold">Password</label><Link href="/" className="text-xs font-semibold text-primary hover:underline">Forgot password?</Link></div>
        <div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="login-password" name="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" autoComplete="current-password" required minLength={6} className="pl-9 pr-11" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>
      </div>
      <Button type="submit" className="w-full" size="lg" disabled={pending}>{pending ? <><span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />Signing in...</> : "Log in"}</Button>
      <p className="text-center text-sm text-muted-foreground">Don&apos;t have an account? <Link href="/register" className="font-semibold text-primary hover:underline">Register</Link></p>
    </form>
  );
}
