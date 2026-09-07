import { getCookie, removeCookie, ROLE_COOKIE, TOKEN_COOKIE } from "./cookies";
import type {
  ApiSuccess,
  AuthResult,
  Category,
  CreatePaymentResult,
  GearItem,
  Payment,
  RentalOrder,
  Role,
  User,
} from "./types";

// Falls back to the deployed GearUp backend from the assignment brief if no
// env var is configured, so the app works out of the box. Override with
// NEXT_PUBLIC_API_BASE_URL in .env.local for local backend development.
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://gearup-b7a4-1.onrender.com/api";

export interface FieldErrorDetail {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  details?: FieldErrorDetail[];

  constructor(status: number, message: string, details?: FieldErrorDetail[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }

  /** Convenience: field -> message map, for wiring up inline form errors. */
  fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    if (Array.isArray(this.details)) {
      for (const d of this.details) {
        if (!d?.path) continue;
        // Backend validates { body, query, params } as one object, so Zod's
        // error path is prefixed with "body." / "query." / "params." — strip
        // that so callers can key off the plain field name (e.g. "email").
        const key = d.path.replace(/^(body|query|params)\./, "");
        out[key] = d.message;
      }
    }
    return out;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  auth?: boolean; // default true — attach bearer token if present
}

function handleUnauthorized() {
  if (typeof window === "undefined" || window.location.pathname.startsWith("/auth/")) return;
  removeCookie(TOKEN_COOKIE);
  removeCookie(ROLE_COOKIE);
  const redirect = `${window.location.pathname}${window.location.search}`;
  window.location.assign(`/auth/login?redirect=${encodeURIComponent(redirect)}`);
}

async function apiFetch<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { body, auth = true, headers, ...rest } = opts;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };

  if (body !== undefined) {
    finalHeaders["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getCookie(TOKEN_COOKIE);
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the GearUp server. Check your connection and try again.");
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    // non-JSON response (e.g. gateway error page)
  }

  if (res.status === 401) handleUnauthorized();

  const parsed = json as (ApiSuccess<T> & { message?: string }) | { success?: false; message?: string; details?: FieldErrorDetail[] } | null;

  if (!res.ok || !parsed || parsed.success === false) {
    const message = (parsed && "message" in parsed && parsed.message) || `Request failed (${res.status})`;
    const details = (parsed && "details" in parsed ? (parsed.details as FieldErrorDetail[]) : undefined) || undefined;
    throw new ApiError(res.status, message, details);
  }

  return (parsed as ApiSuccess<T>).data;
}

/** Same as apiFetch but also returns the `meta` pagination block, if any. */
async function apiFetchWithMeta<T>(
  path: string,
  opts: RequestOptions = {}
): Promise<{ data: T; meta?: ApiSuccess<T>["meta"] }> {
  const { body, auth = true, headers, ...rest } = opts;
  const finalHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(headers as Record<string, string>),
  };
  if (body !== undefined) finalHeaders["Content-Type"] = "application/json";
  if (auth) {
    const token = getCookie(TOKEN_COOKIE);
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the GearUp server. Check your connection and try again.");
  }

  let json: unknown = null;
  try {
    json = await res.json();
  } catch {
    /* ignore */
  }
  if (res.status === 401) handleUnauthorized();
  const parsed = json as ApiSuccess<T> | { success?: false; message?: string; details?: FieldErrorDetail[] } | null;
  if (!res.ok || !parsed || parsed.success === false) {
    const message = (parsed && "message" in parsed && parsed.message) || `Request failed (${res.status})`;
    const details = (parsed && "details" in parsed ? (parsed.details as FieldErrorDetail[]) : undefined) || undefined;
    throw new ApiError(res.status, message, details);
  }
  return { data: (parsed as ApiSuccess<T>).data, meta: (parsed as ApiSuccess<T>).meta };
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const authApi = {
  register: (input: { name: string; email: string; password: string; phone?: string; role?: Extract<Role, "CUSTOMER" | "PROVIDER"> }) =>
    apiFetch<AuthResult>("/auth/register", {
      method: "POST",
      body: { ...input, email: input.email.trim().toLowerCase() },
      auth: false,
    }),

  login: (input: { email: string; password: string }) =>
    apiFetch<AuthResult>("/auth/login", {
      method: "POST",
      body: { email: input.email.trim().toLowerCase(), password: input.password },
      auth: false,
    }),

  me: () => apiFetch<User>("/auth/me", { method: "GET" }),
};

// ---------------------------------------------------------------------------
// Public gear + categories
// ---------------------------------------------------------------------------
export interface GearQuery {
  category?: string;
  brand?: string;
  minPrice?: string | number;
  maxPrice?: string | number;
  search?: string;
  available?: boolean;
  page?: number;
  limit?: number;
}

function toQueryString(query: GearQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const gearApi = {
  list: (query: GearQuery = {}) =>
    apiFetchWithMeta<GearItem[]>(`/gear${toQueryString(query)}`, { auth: false, method: "GET" }),

  getById: (id: string) => apiFetch<GearItem>(`/gear/${id}`, { auth: false, method: "GET" }),
};

export const categoryApi = {
  list: () => apiFetch<Category[]>("/categories", { auth: false, method: "GET" }),
};

// ---------------------------------------------------------------------------
// Rentals (customer-facing orders)
// ---------------------------------------------------------------------------
export interface CreateRentalInput {
  startDate: string; // ISO date
  endDate: string; // ISO date
  notes?: string;
  items: Array<{ gearItemId: string; quantity: number }>;
}

export const rentalApi = {
  create: (input: CreateRentalInput) => apiFetch<RentalOrder>("/rentals", { method: "POST", body: input }),
  list: () => apiFetch<RentalOrder[]>("/rentals", { method: "GET" }),
  getById: (id: string) => apiFetch<RentalOrder>(`/rentals/${id}`, { method: "GET" }),
  cancel: (id: string) => apiFetch<RentalOrder>(`/rentals/${id}/cancel`, { method: "PATCH" }),
};

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------
export const paymentApi = {
  create: (input: { rentalOrderId: string; method: "STRIPE" | "SSLCOMMERZ" }) =>
    apiFetch<CreatePaymentResult>("/payments/create", { method: "POST", body: input }),

  confirm: (input: { transactionId: string; status?: "COMPLETED" | "FAILED" }) =>
    apiFetch<Payment>("/payments/confirm", { method: "POST", body: input, auth: false }),

  list: () => apiFetch<Payment[]>("/payments", { method: "GET" }),
  getById: (id: string) => apiFetch<Payment>(`/payments/${id}`, { method: "GET" }),
};

// ---------------------------------------------------------------------------
// Provider (gear inventory + order fulfilment)
// ---------------------------------------------------------------------------
export interface GearInput {
  name: string;
  description?: string;
  brand?: string;
  images?: string[];
  pricePerDay: number;
  totalQuantity: number;
  categoryId: string;
}

export const providerApi = {
  gearList: () => apiFetch<GearItem[]>("/provider/gear", { method: "GET" }),
  createGear: (input: GearInput) => apiFetch<GearItem>("/provider/gear", { method: "POST", body: input }),
  updateGear: (id: string, input: Partial<GearInput> & { availableQuantity?: number; status?: "ACTIVE" | "INACTIVE" }) =>
    apiFetch<GearItem>(`/provider/gear/${id}`, { method: "PUT", body: input }),
  deleteGear: (id: string) => apiFetch<{ id: string }>(`/provider/gear/${id}`, { method: "DELETE" }),

  orders: () => apiFetch<RentalOrder[]>("/provider/orders", { method: "GET" }),
  updateOrderStatus: (id: string, status: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED") =>
    apiFetch<RentalOrder>(`/provider/orders/${id}`, { method: "PATCH", body: { status } }),
};

// ---------------------------------------------------------------------------
// Reviews
// ---------------------------------------------------------------------------
export const reviewApi = {
  create: (input: { gearItemId: string; rating: number; comment?: string }) =>
    apiFetch<unknown>("/reviews", { method: "POST", body: input }),
};

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export const adminApi = {
  users: () => apiFetch<User[]>("/admin/users", { method: "GET" }),
  updateUserStatus: (id: string, status: "ACTIVE" | "SUSPENDED") =>
    apiFetch<User>(`/admin/users/${id}`, { method: "PATCH", body: { status } }),

  gear: () => apiFetch<GearItem[]>("/admin/gear", { method: "GET" }),
  rentals: () => apiFetch<RentalOrder[]>("/admin/rentals", { method: "GET" }),

  createCategory: (input: { name: string; description?: string }) =>
    apiFetch<Category>("/admin/categories", { method: "POST", body: input }),
  updateCategory: (id: string, input: { name?: string; description?: string }) =>
    apiFetch<Category>(`/admin/categories/${id}`, { method: "PATCH", body: input }),
  deleteCategory: (id: string) => apiFetch<{ id: string }>(`/admin/categories/${id}`, { method: "DELETE" }),
};
