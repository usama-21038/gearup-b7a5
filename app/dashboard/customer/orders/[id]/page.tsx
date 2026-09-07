"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { rentalApi, reviewApi } from "@/lib/api";
import { useToast } from "@/lib/toast-context";
import { useConfirm } from "@/lib/confirm-context";
import { getErrorMessage } from "@/lib/get-error-message";
import type { RentalOrder } from "@/lib/types";
import { fmtCurrency, fmtDate, fmtDateTime, daysBetween } from "@/lib/utils";
import { StatusBadge } from "@/components/badges";
import { ArrowLeftIcon, CategoryIcon, CheckCircleIcon, ShieldIcon, XCircleIcon, categoryTintClass } from "@/components/icons";
import { ErrorState, Spinner } from "@/components/ui";
import { ReviewModal } from "@/components/review-modal";

const TIMELINE_STEPS: Array<{ key: RentalOrder["status"]; label: string }> = [
  { key: "PLACED", label: "Order placed" },
  { key: "CONFIRMED", label: "Confirmed by provider" },
  { key: "PAID", label: "Payment received" },
  { key: "PICKED_UP", label: "Picked up" },
  { key: "RETURNED", label: "Returned" },
];
const STATUS_INDEX: Record<string, number> = { PLACED: 0, CONFIRMED: 1, PAID: 2, PICKED_UP: 3, RETURNED: 4, CANCELLED: -1 };

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const confirm = useConfirm();

  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [reviewingGearId, setReviewingGearId] = useState<string | null>(null);
  const [reviewedGearIds, setReviewedGearIds] = useState<Set<string>>(new Set());

  const load = () => {
    setLoading(true);
    rentalApi
      .getById(params.id)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err, "Couldn't load this order.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, [params.id]);

  async function handleCancel() {
    if (!order) return;
    const ok = await confirm({
      title: "Cancel this order?",
      body: "This will release the reserved gear back into stock and can't be undone.",
      confirmLabel: "Cancel order",
      tone: "danger",
      icon: <ShieldIcon />,
    });
    if (!ok) return;
    setCancelling(true);
    try {
      const updated = await rentalApi.cancel(order.id);
      setOrder(updated);
      toast.success("Order cancelled.");
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't cancel this order."));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="section-tight" style={{ textAlign: "center", padding: "60px 0" }}>
        <Spinner dark />
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="section-tight">
        <ErrorState message={error || "Order not found."} onRetry={load} />
      </div>
    );
  }

  const orderIndex = STATUS_INDEX[order.status];
  const canCancel = order.status === "PLACED" || order.status === "CONFIRMED";
  const canPay = order.status === "CONFIRMED";

  return (
    <div className="section-tight">
      <button className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 12 }} onClick={() => router.push("/dashboard/customer/orders")}>
        <ArrowLeftIcon /> Back to orders
      </button>
      <div className="flex-between" style={{ marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
        <div>
          <h1 className="text-h2">Order {order.id.slice(0, 8)}</h1>
          <p className="text-small">Placed {fmtDateTime(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card panel">
          <h3 className="text-h3" style={{ marginBottom: 16 }}>
            Order summary
          </h3>
          {order.items.map((item) => {
            const alreadyReviewed = reviewedGearIds.has(item.gearItemId);
            return (
              <div key={item.id} style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", gap: 14, marginBottom: 8 }}>
                  <div className={`mini-thumb ${categoryTintClass(item.gearItem.category.name)}`} style={{ width: 56, height: 56 }}>
                    <CategoryIcon category={item.gearItem.category.name} size={26} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700 }}>{item.gearItem.name}</div>
                    <div className="text-small">
                      {item.gearItem.provider.name} · Qty {item.quantity} · {fmtCurrency(item.pricePerDay)}/day
                    </div>
                  </div>
                </div>
                {order.status === "RETURNED" &&
                  (alreadyReviewed ? (
                    <div className="text-small" style={{ color: "var(--color-success-text)", display: "flex", alignItems: "center", gap: 6 }}>
                      <CheckCircleIcon size={14} /> Review submitted for {item.gearItem.name}
                    </div>
                  ) : (
                    <button className="link-btn" onClick={() => setReviewingGearId(item.gearItemId)}>
                      Leave a review for {item.gearItem.name}
                    </button>
                  ))}
              </div>
            );
          })}
          <div className="spec-row">
            <span>Rental dates</span>
            <span style={{ fontWeight: 600 }}>
              {fmtDate(order.startDate)} – {fmtDate(order.endDate)}
            </span>
          </div>
          <div className="spec-row">
            <span>Duration</span>
            <span style={{ fontWeight: 600 }}>{daysBetween(order.startDate, order.endDate)} day(s)</span>
          </div>
          {order.notes && (
            <div className="spec-row">
              <span>Notes</span>
              <span style={{ fontWeight: 600 }}>{order.notes}</span>
            </div>
          )}
          <div className="spec-row" style={{ borderBottom: "none" }}>
            <span>Total</span>
            <span style={{ fontWeight: 700, fontSize: 16 }}>{fmtCurrency(order.totalAmount)}</span>
          </div>

          {canPay && (
            <Link href={`/dashboard/customer/orders/${order.id}/pay`} className="btn btn-primary btn-block" style={{ marginTop: 16 }}>
              Pay now
            </Link>
          )}
          {canCancel && (
            <button className="btn btn-destructive btn-block" style={{ marginTop: 10 }} onClick={handleCancel} disabled={cancelling}>
              {cancelling ? <Spinner dark /> : "Cancel order"}
            </button>
          )}
        </div>

        <div className="card panel">
          <h3 className="text-h3" style={{ marginBottom: 18 }}>
            Order timeline
          </h3>
          {order.status === "CANCELLED" ? (
            <div className="text-small" style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <XCircleIcon size={18} /> This order was cancelled and no charges were made.
            </div>
          ) : (
            <div className="timeline">
              {TIMELINE_STEPS.map((s, i) => (
                <div key={s.key} className="tl-item">
                  <div className="tl-dot-col">
                    <div className={`tl-dot ${i <= orderIndex ? "done" : ""}`} />
                    {i < TIMELINE_STEPS.length - 1 && <div className={`tl-line ${i < orderIndex ? "done" : ""}`} />}
                  </div>
                  <div className="tl-body">
                    <div className="tl-title" style={i > orderIndex ? { color: "var(--color-text-secondary)" } : undefined}>
                      {s.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {reviewingGearId && (
        <ReviewModal
          onClose={() => setReviewingGearId(null)}
          onSubmit={async (rating, comment) => {
            try {
              await reviewApi.create({ gearItemId: reviewingGearId, rating, comment: comment || undefined });
              setReviewedGearIds((prev) => new Set(prev).add(reviewingGearId));
              toast.success("Review submitted — thanks for the feedback!");
            } catch (err) {
              toast.error(getErrorMessage(err, "Couldn't submit that review."));
            } finally {
              setReviewingGearId(null);
            }
          }}
        />
      )}
    </div>
  );
}
