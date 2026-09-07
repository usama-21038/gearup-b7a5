"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, roleHomePath } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import { FieldError, Spinner } from "@/components/ui";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      const redirect = searchParams.get("redirect");
      // Only ever redirect to a same-site path (starts with a single "/"),
      // never an absolute/external URL, to avoid an open-redirect via the
      // query string. Falls back to the role's dashboard otherwise.
      const safeRedirect = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
      router.push(safeRedirect || roleHomePath(user.role));
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors());
      toast.error(getErrorMessage(err, "Couldn't log you in. Check your email and password."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card">
        <div className="auth-head">
          <h1 className="text-h2">Welcome back</h1>
          <p className="text-small" style={{ marginTop: 6 }}>
            Log in to manage your rentals.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={`field ${fieldErrors.email ? "has-error" : ""}`}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className={`field ${fieldErrors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <FieldError message={fieldErrors.password} />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner /> Logging in...
              </>
            ) : (
              "Log in"
            )}
          </button>
        </form>
        <p className="auth-foot">
          Don&apos;t have an account?{" "}
          <Link href={searchParams.get("redirect") ? `/auth/register?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/auth/register"}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="auth-shell" />}>
      <LoginInner />
    </Suspense>
  );
}
