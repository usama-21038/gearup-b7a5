import "server-only";
import { env } from "./env";
import { getToken } from "./session";
import type { ApiResult } from "./types";

export class ApiError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  /** Attach the current user's Bearer token. Defaults to true. */
  auth?: boolean;
  /** Next.js fetch cache/revalidate options, passed through untouched. */
  next?: NextFetchRequestConfig;
}

/**
 * Thin wrapper around fetch that:
 *  - prefixes the backend base URL
 *  - JSON-encodes the body and sets the right headers
 *  - attaches `Authorization: Bearer <token>` from the httpOnly cookie
 *  - unwraps GearUp's `{ success, message, data }` envelope
 *  - throws a typed ApiError with the backend's message on failure, so every
 *    call site can catch ONE error type and show it as a toast / inline error
 */
export async function apiFetch<T>(
  path: string,
  { body, auth = true, headers, next, ...init }: ApiFetchOptions = {}
): Promise<T> {
  const url = `${env.backendApiUrl}${path}`;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string> | undefined),
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      finalHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      next,
    });
  } catch {
    throw new ApiError(
      "Could not reach the GearUp server. Please check your connection and try again.",
      0
    );
  }

  let json: ApiResult<T> | undefined;
  try {
    json = await res.json();
  } catch {
    // Non-JSON response (e.g. a gateway timeout HTML page).
  }

  if (!res.ok || !json || json.success === false) {
    const message =
      (json && "message" in json && json.message) ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, json && "details" in json ? json.details : undefined);
  }

  return (json as ApiResult<T> & { success: true }).data;
}

export interface ApiListMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Same as apiFetch, but also returns the `meta` block (pagination) GearUp
 * sends for list endpoints like GET /gear.
 */
export async function apiFetchWithMeta<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<{ data: T; meta?: ApiListMeta }> {
  const url = `${env.backendApiUrl}${path}`;
  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (options.auth !== false) {
    const token = await getToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...options,
    headers: finalHeaders,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    next: options.next,
  });

  const json = (await res.json()) as ApiResult<T>;

  if (!res.ok || json.success === false) {
    throw new ApiError(
      json.success === false ? json.message : `Request failed with status ${res.status}`,
      res.status,
      json.success === false ? json.details : undefined
    );
  }

  return { data: json.data, meta: json.meta as ApiListMeta | undefined };
}
