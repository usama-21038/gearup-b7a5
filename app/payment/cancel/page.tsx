import { PageContainer } from "@/components/ui/gearup";
import { CircleX } from "lucide-react";
import Link from "next/link";

function parameterValue(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key];
  return Array.isArray(value) ? value[0] : value;
}

export default async function PaymentCancelPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams;
  const rentalId = parameterValue(params, "rentalId");
  const orderHref = rentalId ? `/dashboard/customer/orders/${encodeURIComponent(rentalId)}` : "/dashboard/customer/orders";

  return <main className="py-12 sm:py-16"><PageContainer><div className="mx-auto max-w-[520px] rounded-xl border border-border bg-card p-6 text-center shadow-[var(--shadow-card)] sm:p-9"><span className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626]"><CircleX className="size-6" /></span><h1 className="gearup-h2">Payment cancelled</h1><p className="gearup-small mt-2">Your payment was not completed. No payment credentials were stored by GearUp.</p><div className="mt-6 flex flex-col gap-2.5 sm:flex-row"><Link href={orderHref} className="inline-flex h-10 flex-1 items-center justify-center rounded-md border border-border px-5 text-sm font-semibold hover:bg-muted">Back to order</Link><Link href="/dashboard/customer" className="inline-flex h-10 flex-1 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-[#1d4ed8]">Go to dashboard</Link></div></div></PageContainer></main>;
}
