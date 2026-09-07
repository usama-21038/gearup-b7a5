"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { FormEvent, useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { registerAction } from "../_actions/registerAction";

type RegisterRole = "Customer" | "Provider";

const roleOptions: Array<{ value: RegisterRole; title: string; description: string }> = [
  { value: "Customer", title: "Rent gear", description: "Browse and rent equipment as a customer" },
  { value: "Provider", title: "List gear", description: "Rent out your equipment as a provider" },
];

export default function RegisterForm() {
  const [state, action, pending] = useActionState(registerAction, { success: false });
  const [role, setRole] = useState<RegisterRole>("Customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmError, setConfirmError] = useState("");
  const errorMessage = !state.success ? state.message : undefined;

  useEffect(() => {
    if (errorMessage) toast.error(errorMessage);
  }, [errorMessage]);

  const validateConfirmPassword = (event: FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const password = new FormData(form).get("password");
    const confirmation = new FormData(form).get("confirmPassword");
    if (password !== confirmation) {
      event.preventDefault();
      setConfirmError("Passwords do not match.");
      return;
    }
    setConfirmError("");
  };

  return <form action={action} onSubmit={validateConfirmPassword} className="space-y-5">
    {errorMessage ? <div className="rounded-md border border-[#fecaca] bg-[#fef2f2] px-3.5 py-3 text-sm text-[#991b1b]" role="alert">{errorMessage}</div> : null}
    <fieldset>
      <legend className="mb-2 text-[13px] font-semibold">I want to</legend>
      <div className="grid grid-cols-2 gap-3">{roleOptions.map((option) => <button key={option.value} type="button" onClick={() => setRole(option.value)} className={`rounded-xl border p-4 text-left transition-colors ${role === option.value ? "border-primary bg-secondary" : "border-border bg-card hover:border-primary/50"}`} aria-pressed={role === option.value}><span className="block text-sm font-bold">{option.title}</span><span className="mt-0.5 block text-xs text-muted-foreground">{option.description}</span></button>)}</div>
      <input type="hidden" name="role" value={role} />
    </fieldset>
    <div><label htmlFor="register-name" className="mb-1.5 block text-[13px] font-semibold">Full name</label><div className="relative"><UserRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="register-name" name="name" type="text" placeholder="Jordan Reyes" autoComplete="name" required className="pl-9" /></div></div>
    <div><label htmlFor="register-email" className="mb-1.5 block text-[13px] font-semibold">Email</label><div className="relative"><Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="register-email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required className="pl-9" /></div></div>
    <div><label htmlFor="register-password" className="mb-1.5 block text-[13px] font-semibold">Password</label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="register-password" name="password" type={showPassword ? "text" : "password"} placeholder="At least 8 characters" autoComplete="new-password" minLength={8} required className="pl-9 pr-11" /><button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">{showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div><p className="mt-1.5 text-xs text-muted-foreground">Use at least 8 characters for a stronger password.</p></div>
    <div><label htmlFor="register-confirm" className="mb-1.5 block text-[13px] font-semibold">Confirm password</label><div className="relative"><LockKeyhole className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input id="register-confirm" name="confirmPassword" type={showConfirm ? "text" : "password"} placeholder="Re-enter your password" autoComplete="new-password" required aria-invalid={Boolean(confirmError)} className="pl-9 pr-11" /><button type="button" aria-label={showConfirm ? "Hide confirmation password" : "Show confirmation password"} onClick={() => setShowConfirm((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">{showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button></div>{confirmError ? <p className="mt-1.5 text-xs text-destructive" role="alert">{confirmError}</p> : null}</div>
    <Button type="submit" className="w-full" size="lg" disabled={pending}>{pending ? <><span className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />Creating account...</> : `Create account as ${role}`}</Button>
  </form>;
}
