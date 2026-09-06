"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "../_actions/auth-actions";
import { IDLE_STATE } from "@/lib/action-state";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" size="lg" disabled={pending}>
      {pending && <Loader2 className="h-4 w-4 animate-spin" />}
      Log in
    </Button>
  );
}

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const boundAction = loginAction.bind(null, redirectTo);
  const [state, formAction] = useActionState(boundAction, IDLE_STATE);

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" placeholder="you@example.com" required />
        {state.errors?.email && <p className="text-xs text-destructive">{state.errors.email}</p>}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="password" placeholder="••••••••" required />
        {state.errors?.password && <p className="text-xs text-destructive">{state.errors.password}</p>}
      </div>

      {state.status === "error" && !state.errors && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.message}</p>
      )}

      <SubmitButton />

      <p className="text-center text-sm text-muted-foreground">
        New to GearUp?{" "}
        <Link href="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
