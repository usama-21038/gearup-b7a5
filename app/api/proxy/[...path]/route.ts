import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getToken } from "@/lib/session";

/**
 * Why this exists:
 * The auth token lives in an httpOnly cookie so client-side JS can never read
 * it (protects against XSS token theft). That's great for security, but it
 * means Client Components (which power the interactive provider/admin
 * dashboards with TanStack Query) can't attach `Authorization: Bearer ...`
 * themselves.
 *
 * This route re-exports the whole backend API under `/api/proxy/*`. It runs
 * on the server, reads the cookie, attaches the header, forwards the request
 * to the real GearUp backend, and streams the JSON response straight back.
 * Client components then just call `fetch("/api/proxy/gear")` etc. - same
 * origin, cookie-authenticated, token never touches the browser.
 */

async function forward(req: NextRequest, path: string[]) {
  const token = await getToken();
  const search = req.nextUrl.search;
  const url = `${env.backendApiUrl}/${path.join("/")}${search}`;

  const headers: Record<string, string> = {
    "Content-Type": req.headers.get("content-type") || "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const hasBody = !["GET", "HEAD"].includes(req.method);
  const body = hasBody ? await req.text() : undefined;

  let upstream: Response;
  try {
    upstream = await fetch(url, {
      method: req.method,
      headers,
      body: body && body.length > 0 ? body : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Could not reach the GearUp server." },
      { status: 502 }
    );
  }

  const text = await upstream.text();
  return new NextResponse(text, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function POST(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PATCH(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function PUT(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ path: string[] }> }) {
  const { path } = await ctx.params;
  return forward(req, path);
}
