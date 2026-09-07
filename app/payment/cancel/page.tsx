"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircleIcon } from "@/components/icons";

function PaymentCancelInner() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx");

  return (
    <div className="auth-shell">
      <div className="card auth-card" style={{ textAlign: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "var(--color-warning-tint)",
            color: "var(--color-warning-text)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <XCircleIcon size={32} />
        </div>
        <h1 className="text-h2">Payment cancelled</h1>
        <p className="text-body" style={{ margin: "10px 0 20px" }}>
          You cancelled the payment before it completed. No charge was made — you can try again anytime from your orders.
        </p>
        {tx && (
          <p className="text-caption" style={{ marginBottom: 20 }}>
            Transaction reference: {tx}
          </p>
        )}
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

export default function PaymentCancelPage() {
  return (
    <Suspense fallback={<div className="auth-shell" />}>
      <PaymentCancelInner />
    </Suspense>
  );
}
