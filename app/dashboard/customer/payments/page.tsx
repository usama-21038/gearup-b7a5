"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { paymentApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { Payment } from "@/lib/types";
import { PAYMENT_METHOD_LABEL, fmtCurrency, fmtDateTime } from "@/lib/utils";
import { ErrorState } from "@/components/ui";
import { EmptyState } from "@/components/ui";
import { WalletIcon } from "@/components/icons";

const PAYMENT_STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  COMPLETED: { bg: "var(--color-success-tint)", fg: "var(--color-success-text)" },
  PENDING: { bg: "var(--color-warning-tint)", fg: "var(--color-warning-text)" },
  FAILED: { bg: "var(--color-error-tint)", fg: "var(--color-error-text)" },
};

export default function CustomerPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    paymentApi
      .list()
      .then(setPayments)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Payment history</h1>
          <p className="text-body">Every transaction made on your GearUp account.</p>
        </div>
      </div>
      <div className="card panel">
        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : payments.length === 0 ? (
          <EmptyState icon={<WalletIcon size={20} />} title="No payments yet" body="Payments you make for rentals will show up here." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => {
                  const style = PAYMENT_STATUS_STYLE[p.status] || PAYMENT_STATUS_STYLE.PENDING;
                  return (
                    <tr key={p.id}>
                      <td>{fmtDateTime(p.createdAt)}</td>
                      <td>
                        <Link href={`/dashboard/customer/orders/${p.rentalOrderId}`} className="link-btn">
                          {p.rentalOrderId.slice(0, 8)}
                        </Link>
                      </td>
                      <td>{PAYMENT_METHOD_LABEL[p.method] || p.method}</td>
                      <td className="cell-primary">{fmtCurrency(p.amount)}</td>
                      <td>
                        <span className="badge" style={{ background: style.bg, color: style.fg }}>
                          <span className="badge-dot" />
                          {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
