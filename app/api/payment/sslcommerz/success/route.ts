import { NextRequest, NextResponse } from "next/server";
import { paymentApi } from "@/lib/api";

// SSLCommerz redirects the customer's browser here via an auto-submitting
// POST form after a successful payment (this URL must be set as
// SSLCOMMERZ_SUCCESS_URL in the backend's environment — see README.md).
// We confirm the payment against our backend, then send the browser on to
// the customer-facing success page.

async function extractTranId(request: NextRequest): Promise<string | null> {
  if (request.method === "POST") {
    try {
      const form = await request.formData();
      const val = form.get("tran_id");
      if (typeof val === "string") return val;
    } catch {
      /* fall through to query params */
    }
  }
  return request.nextUrl.searchParams.get("tran_id");
}

async function handle(request: NextRequest) {
  const tranId = await extractTranId(request);

  if (tranId) {
    try {
      await paymentApi.confirm({ transactionId: tranId, status: "COMPLETED" });
    } catch (err) {
      console.error("Failed to confirm SSLCommerz payment:", err);
    }
  }

  const redirectUrl = new URL("/payment/success", request.url);
  if (tranId) redirectUrl.searchParams.set("tx", tranId);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  return handle(request);
}
export async function GET(request: NextRequest) {
  return handle(request);
}
