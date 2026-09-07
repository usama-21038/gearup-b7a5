"use server";

import { redirect } from "next/navigation";

type RegisterState = {
  success: boolean;
  message?: string;
};

const roleMap = {
  Customer: "USER",
  Provider: "AUTHOR",
} as const;

export async function registerAction(_previousState: RegisterState, formData: FormData): Promise<RegisterState> {
  const role = formData.get("role");
  const backendRole = typeof role === "string" && role in roleMap ? roleMap[role as keyof typeof roleMap] : null;

  if (!backendRole) return { success: false, message: "Choose whether you want to rent or list gear." };

  try {
    const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: backendRole,
      }),
    });
    const result = await response.json();

    if (result.success) redirect("/login?registered=1");
    return { success: false, message: result.message || "Registration failed. Please try again." };
  } catch {
    return { success: false, message: "We could not reach the registration service. Please try again." };
  }
}
