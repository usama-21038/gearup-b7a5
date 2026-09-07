"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { rentalApi } from "@/lib/api";
import type { RentalOrder } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { CheckCircleIcon } from "@/components/icons";
import { Spinner } from "@/components/ui";

function PaymentSuccessInner() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const tx = searchParams.get("tx");
  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(!!orderId);

  useEffect(() => {
    if (!orderId) return;
    rentalApi
      .getById(orderId)
      .then(setOrder)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [orderId]);

  return (
    <div className="auth-shell">
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--color-success-tint)",
            color: "var(--color-success)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <CheckCircleIcon size={32} />
        </div>
        <h1 className="text-h2">Payment successful</h1>
        <p className="text-body" style={{ margin: "10px 0 20px" }}>
          Your rental is confirmed. Head to your dashboard to track pickup and return.
        </p>

        {loading ? (
          <Spinner dark />
        ) : order ? (
          <div className="card" style={{ padding: 16, textAlign: "left", marginBottom: 20 }}>
            <div className="spec-row">
              <span>Order</span>
              <span style={{ fontWeight: 600 }}>{order.id.slice(0, 8)}</span>
            </div>
            <div className="spec-row" style={{ borderBottom: "none" }}>
              <span>Amount paid</span>
              <span style={{ fontWeight: 700 }}>{fmtCurrency(order.totalAmount)}</span>
            </div>
          </div>
        ) : tx ? (
          <p className="text-caption" style={{ marginBottom: 20 }}>
            Transaction reference: {tx}
          </p>
        ) : null}

        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/dashboard/customer/orders" className="btn btn-primary btn-block">
            View my orders
          </Link>
          <Link href="/gear" className="btn btn-outline btn-block">
            Browse gear
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="auth-shell" />}>
      <PaymentSuccessInner />
    </Suspense>
  );
}
