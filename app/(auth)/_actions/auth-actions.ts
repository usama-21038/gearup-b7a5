"use server";

import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { clearAuthCookie, dashboardPathForRole, setAuthCookie } from "@/lib/session";
import { fieldErrors, loginSchema, registerSchema } from "@/lib/validations";
import type { ActionState } from "@/lib/action-state";
import type { User } from "@/lib/types";

interface AuthPayload {
  user: User;
  token: string;
}

function backendFieldErrors(details: unknown): Record<string, string> | undefined {
  if (!Array.isArray(details)) return undefined;

  const errors: Record<string, string> = {};
  for (const detail of details) {
    if (!detail || typeof detail !== "object") continue;
    const path = "path" in detail ? detail.path : undefined;
    const message = "message" in detail ? detail.message : undefined;
    if (typeof message !== "string") continue;

    const field = Array.isArray(path) ? path.at(-1) : path;
    if (typeof field === "string" && field && !errors[field]) {
      errors[field] = message;
    }
  }

  return Object.keys(errors).length > 0 ? errors : undefined;
}

function authErrorState(err: unknown): ActionState {
  if (err instanceof ApiError) {
    return {
      status: "error",
      errors: backendFieldErrors(err.details),
      message: err.message,
    };
  }
  return { status: "error", message: "Something went wrong. Please try again." };
}

export async function registerAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const raw = {
    name: String(formData.get("name") || ""),
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
    phone: String(formData.get("phone") || ""),
    role: String(formData.get("role") || "CUSTOMER"),
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), message: "Please fix the fields below." };
  }

  let role: User["role"];
  try {
    const result = await apiFetch<AuthPayload>("/auth/register", {
      method: "POST",
      auth: false,
      body: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        phone: parsed.data.phone || undefined,
        role: parsed.data.role,
      },
    });
    await setAuthCookie(result.token);
    role = result.user.role;
  } catch (err) {
    return authErrorState(err);
  }

  redirect(dashboardPathForRole(role));
}

export async function loginAction(
  redirectTo: string | undefined,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const raw = {
    email: String(formData.get("email") || ""),
    password: String(formData.get("password") || ""),
  };

  const parsed = loginSchema.safeParse(raw);
  if (!parsed.success) {
    return { status: "error", errors: fieldErrors(parsed.error), message: "Please fix the fields below." };
  }

  let role: string;
  try {
    const result = await apiFetch<AuthPayload>("/auth/login", {
      method: "POST",
      auth: false,
      body: parsed.data,
    });
    await setAuthCookie(result.token);
    role = result.user.role;
  } catch (err) {
    return authErrorState(err);
  }

  if (redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")) {
    redirect(redirectTo);
  }
  redirect(dashboardPathForRole(role));
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}
