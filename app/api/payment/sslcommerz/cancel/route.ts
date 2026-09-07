import { NextRequest, NextResponse } from "next/server";
import { paymentApi } from "@/lib/api";

// SSLCOMMERZ_CANCEL_URL should point here (see README.md). The Payment model
// has no dedicated CANCELLED state, so we record it as FAILED — the customer
// can always retry from the order's pay page.

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
      await paymentApi.confirm({ transactionId: tranId, status: "FAILED" });
    } catch (err) {
      console.error("Failed to record cancelled SSLCommerz payment:", err);
    }
  }

  const redirectUrl = new URL("/payment/cancel", request.url);
  if (tranId) redirectUrl.searchParams.set("tx", tranId);
  return NextResponse.redirect(redirectUrl, { status: 303 });
}

export async function POST(request: NextRequest) {
  return handle(request);
}
export async function GET(request: NextRequest) {
  return handle(request);
}
