import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";
import type { Payment } from "@/lib/types";

export const metadata = { title: "Payment successful" };

async function confirm(transactionId: string) {
  try {
    return await apiFetch<Payment>("/payments/confirm", {
      method: "POST",
      body: { transactionId, status: "COMPLETED" },
    });
  } catch (err) {
    // Already confirmed (e.g. the Stripe client-side confirm beat us here) is fine.
    if (err instanceof ApiError) return null;
    throw err;
  }
}

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string; tran_id?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const transactionId = params.transactionId || params.tran_id;

  if (transactionId) {
    await confirm(transactionId);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="h-8 w-8" />
      </span>
      <h1 className="font-display text-3xl font-bold">Payment successful</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Your rental is confirmed and marked as paid. The provider will prepare your gear for pickup.
      </p>
      {transactionId && (
        <p className="rounded-md bg-secondary px-3 py-1.5 font-mono text-xs text-muted-foreground">
          Transaction: {transactionId}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        <Button asChild>
          <Link href="/dashboard/customer">View my rentals</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/gear">Browse more gear</Link>
        </Button>
      </div>
    </div>
  );
}
