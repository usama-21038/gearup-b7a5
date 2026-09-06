import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { getSession } from "@/lib/session";
import { PaymentGatewayPicker } from "@/components/payment/payment-gateway-picker";
import { RentalStatusBadge } from "@/components/shared/status-badges";
import { formatCurrency, formatDate } from "@/lib/utils";
import { gearImage } from "@/components/gear/gear-utils";
import type { RentalOrder } from "@/lib/types";

export const metadata = { title: "Pay for your rental" };

async function getOrder(id: string) {
  try {
    return await apiFetch<RentalOrder>(`/rentals/${id}`);
  } catch (err) {
    if (err instanceof ApiError && err.statusCode === 404) return null;
    throw err;
  }
}

export default async function PayForOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [order, session] = await Promise.all([getOrder(id), getSession()]);

  if (!order) notFound();
  if (session && order.customerId !== session.id) notFound();

  if (!["PLACED", "CONFIRMED"].includes(order.status)) {
    redirect(`/dashboard/customer`);
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Complete your payment</h1>
        <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
      </div>

      <div className="rounded-lg border border-border p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-sm font-medium">Order summary</span>
          <RentalStatusBadge status={order.status} />
        </div>
        <ul className="space-y-3">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-3">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted">
                <Image src={gearImage(item.gearItem)} alt="" fill className="object-cover" sizes="48px" />
              </div>
              <div className="flex-1 text-sm">
                <p className="font-medium">{item.gearItem.name}</p>
                <p className="text-muted-foreground">
                  Qty {item.quantity} × {formatCurrency(item.pricePerDay)}/day
                </p>
              </div>
              <p className="text-sm font-medium">{formatCurrency(item.subtotal)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex justify-between border-t border-border pt-3 text-sm text-muted-foreground">
          <span>
            {formatDate(order.startDate)} – {formatDate(order.endDate)}
          </span>
        </div>
        <div className="mt-1 flex justify-between font-display text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(order.totalAmount)}</span>
        </div>
      </div>

      <PaymentGatewayPicker orderId={order.id} totalAmount={order.totalAmount} />
    </div>
  );
}
