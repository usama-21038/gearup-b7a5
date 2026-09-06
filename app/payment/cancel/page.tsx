import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiFetch, ApiError } from "@/lib/api";

export const metadata = { title: "Payment cancelled" };

async function markFailed(transactionId: string) {
  try {
    await apiFetch("/payments/confirm", {
      method: "POST",
      body: { transactionId, status: "FAILED" },
    });
  } catch (err) {
    if (!(err instanceof ApiError)) throw err;
  }
}

export default async function PaymentCancelPage({
  searchParams,
}: {
  searchParams: Promise<{ transactionId?: string; tran_id?: string; orderId?: string }>;
}) {
  const params = await searchParams;
  const transactionId = params.transactionId || params.tran_id;
  if (transactionId) await markFailed(transactionId);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <XCircle className="h-8 w-8" />
      </span>
      <h1 className="font-display text-3xl font-bold">Payment cancelled</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        No charge was made. Your rental order is still saved - you can retry payment any time from your dashboard.
      </p>
      <div className="flex gap-3 pt-2">
        {params.orderId ? (
          <Button asChild>
            <Link href={`/dashboard/customer/orders/${params.orderId}/pay`}>Try again</Link>
          </Button>
        ) : (
          <Button asChild>
            <Link href="/dashboard/customer">Go to dashboard</Link>
          </Button>
        )}
        <Button variant="outline" asChild>
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
