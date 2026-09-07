"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircleIcon } from "@/components/icons";

function PaymentFailInner() {
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
            background: "var(--color-error-tint)",
            color: "var(--color-error)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <XCircleIcon size={32} />
        </div>
        <h1 className="text-h2">Payment failed</h1>
        <p className="text-body" style={{ margin: "10px 0 20px" }}>
          We couldn&apos;t process that payment. Your card may have been declined — no charge was made. You can try again
          with a different method from your order.
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

export default function PaymentFailPage() {
  return (
    <Suspense fallback={<div className="auth-shell" />}>
      <PaymentFailInner />
    </Suspense>
  );
}
