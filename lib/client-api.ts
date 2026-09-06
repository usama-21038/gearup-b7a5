"use client";

import type { ApiResult } from "./types";

export class ClientApiError extends Error {
  statusCode: number;
  details?: unknown;
  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = "ClientApiError";
    this.statusCode = statusCode;
    this.details = details;
  }
}

interface Options extends Omit<RequestInit, "body"> {
  body?: unknown;
}

/**
 * Client-side equivalent of lib/api.ts's apiFetch, but talks to our own
 * `/api/proxy/*` route instead of the backend directly (see that route's
 * comment for why). Used by TanStack Query hooks in dashboards that need
 * live refetching / optimistic updates.
 */
export async function clientApiFetch<T>(path: string, { body, headers, ...init }: Options = {}): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(headers as Record<string, string> | undefined),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let json: ApiResult<T> | undefined;
  try {
    json = await res.json();
  } catch {
    // ignore parse errors, handled below
  }

  if (!res.ok || !json || json.success === false) {
    const message = (json && "message" in json && json.message) || "Something went wrong. Please try again.";
    throw new ClientApiError(message, res.status, json && "details" in json ? json.details : undefined);
  }

  return (json as ApiResult<T> & { success: true }).data;
}

export async function clientApiFetchWithMeta<T>(path: string, options: Options = {}) {
  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers as Record<string, string> | undefined) },
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  const json = (await res.json()) as ApiResult<T>;
  if (!res.ok || json.success === false) {
    throw new ClientApiError(json.success === false ? json.message : "Something went wrong.", res.status);
  }
  return { data: json.data, meta: json.meta };
}
