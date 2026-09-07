"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, roleHomePath } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import { FieldError, Spinner } from "@/components/ui";

type RegisterRole = "CUSTOMER" | "PROVIDER";

function RegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const toast = useToast();

  const initialRole = (searchParams.get("role")?.toUpperCase() === "PROVIDER" ? "PROVIDER" : "CUSTOMER") as RegisterRole;
  const [role, setRole] = useState<RegisterRole>(initialRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFieldErrors({});

    if (password !== confirm) {
      setFieldErrors({ confirm: "Passwords don't match." });
      toast.error("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    try {
      const user = await register({ name, email, password, phone: phone || undefined, role });
      toast.success(`Welcome to GearUp, ${user.name.split(" ")[0]}.`);
      const redirect = searchParams.get("redirect");
      const safeRedirect = redirect && redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : null;
      router.push(safeRedirect || roleHomePath(user.role));
    } catch (err) {
      if (err instanceof ApiError) setFieldErrors(err.fieldErrors());
      toast.error(getErrorMessage(err, "Couldn't create your account."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-shell">
      <div className="card auth-card" style={{ maxWidth: 460 }}>
        <div className="auth-head">
          <h1 className="text-h2">Create your account</h1>
          <p className="text-small" style={{ marginTop: 6 }}>
            Start renting or listing gear in minutes.
          </p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>I want to</label>
            <div className="role-select">
              <button type="button" className={`role-card ${role === "CUSTOMER" ? "active" : ""}`} onClick={() => setRole("CUSTOMER")}>
                <div className="rc-title">Rent gear</div>
                <div className="rc-desc">Browse and rent equipment as a customer</div>
              </button>
              <button type="button" className={`role-card ${role === "PROVIDER" ? "active" : ""}`} onClick={() => setRole("PROVIDER")}>
                <div className="rc-title">List gear</div>
                <div className="rc-desc">Rent out your equipment as a provider</div>
              </button>
            </div>
          </div>
          <div className={`field ${fieldErrors.name ? "has-error" : ""}`}>
            <label>Full name</label>
            <input type="text" placeholder="Jordan Reyes" required value={name} onChange={(e) => setName(e.target.value)} />
            <FieldError message={fieldErrors.name} />
          </div>
          <div className={`field ${fieldErrors.email ? "has-error" : ""}`}>
            <label>Email</label>
            <input type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldError message={fieldErrors.email} />
          </div>
          <div className={`field ${fieldErrors.phone ? "has-error" : ""}`}>
            <label>Phone (optional)</label>
            <input type="tel" placeholder="+1 (555) 000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
            <FieldError message={fieldErrors.phone} />
          </div>
          <div className={`field ${fieldErrors.password ? "has-error" : ""}`}>
            <label>Password</label>
            <div className="pw-wrap">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="At least 6 characters"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="button" className="pw-toggle" onClick={() => setShowPassword((s) => !s)}>
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {fieldErrors.password ? <FieldError message={fieldErrors.password} /> : <div className="field-help">Use 6+ characters for a stronger password.</div>}
          </div>
          <div className={`field ${fieldErrors.confirm ? "has-error" : ""}`}>
            <label>Confirm password</label>
            <input type={showPassword ? "text" : "password"} placeholder="Re-enter your password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            <FieldError message={fieldErrors.confirm} />
          </div>
          <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={submitting}>
            {submitting ? (
              <>
                <Spinner /> Creating account...
              </>
            ) : (
              `Create account as ${role === "CUSTOMER" ? "Customer" : "Provider"}`
            )}
          </button>
        </form>
        <p className="auth-foot">
          Already have an account?{" "}
          <Link href={searchParams.get("redirect") ? `/auth/login?redirect=${encodeURIComponent(searchParams.get("redirect")!)}` : "/auth/login"}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-shell" />}>
      <RegisterInner />
    </Suspense>
  );
}
