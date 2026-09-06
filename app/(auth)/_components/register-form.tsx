"use client";

import * as React from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Loader2, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { registerAction } from "../_actions/auth-actions";
import { IDLE_STATE } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Create account
    </Button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(registerAction, IDLE_STATE);
  const [role, setRole] = React.useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label>I want to…</Label>
        <input type="hidden" name="role" value={role} />
        <div className="grid grid-cols-2 gap-3">
          <RoleCard
            icon={ShoppingBag}
            title="Rent gear"
            subtitle="Customer"
            active={role === "CUSTOMER"}
            onClick={() => setRole("CUSTOMER")}
          />
          <RoleCard
            icon={Store}
            title="List gear"
            subtitle="Provider"
            active={role === "PROVIDER"}
            onClick={() => setRole("PROVIDER")}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" placeholder="Jane Doe" required />
        {state.errors?.name && <p className="text-xs text-destructive">{state.errors.name}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        {state.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone (optional)</Label>
        <Input id="phone" name="phone" type="tel" placeholder="01700000000" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="At least 6 characters" required />
        {state.errors?.password && <p className="text-xs text-destructive">{state.errors.password}</p>}
      </div>

      {state.status === "error" && !state.errors && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.message}</p>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}

function RoleCard({
  icon: Icon,
  title,
  subtitle,
  active,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-start gap-1 rounded-lg border-2 p-3 text-left transition-colors",
        active ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
      )}
    >
      <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
      <span className="text-sm font-semibold">{title}</span>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </button>
  );
}
