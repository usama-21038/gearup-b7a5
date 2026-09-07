"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { RentalOrder, RentalStatus } from "@/lib/types";
import { fmtCurrency, fmtDateShort } from "@/lib/utils";
import { StatusBadge } from "@/components/badges";
import { CategoryIcon, categoryTintClass } from "@/components/icons";
import { ErrorState } from "@/components/ui";

const FILTERS: Array<RentalStatus | "ALL"> = ["ALL", "PLACED", "CONFIRMED", "PAID", "PICKED_UP", "RETURNED", "CANCELLED"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<RentalStatus | "ALL">("ALL");

  const load = () => {
    setLoading(true);
    adminApi
      .rentals()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => (filter === "ALL" ? orders : orders.filter((o) => o.status === filter)), [orders, filter]);

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">All orders</h1>
          <p className="text-body">Every rental order placed across the platform.</p>
        </div>
      </div>
      <div className="card panel">
        <div className="chip-list" style={{ marginBottom: 16 }}>
          {FILTERS.map((f) => (
            <span key={f} className={`chip ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "ALL" ? "All" : f.replace("_", " ")}
            </span>
          ))}
        </div>
        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Gear</th>
                  <th>Customer</th>
                  <th>Dates</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((o) => {
                  const firstItem = o.items[0];
                  const category = firstItem?.gearItem.category.name || "Cycling";
                  return (
                    <tr key={o.id}>
                      <td className="cell-primary">{o.id.slice(0, 8)}</td>
                      <td>
                        <div className="row-flex">
                          <div className={`mini-thumb ${categoryTintClass(category)}`}>
                            <CategoryIcon category={category} size={18} />
                          </div>
                          {o.items.length > 1 ? `${firstItem?.gearItem.name} + ${o.items.length - 1} more` : firstItem?.gearItem.name}
                        </div>
                      </td>
                      <td>
                        <div className="cell-primary">{o.customer.name}</div>
                        <div className="cell-sub">{o.customer.email}</div>
                      </td>
                      <td>
                        {fmtDateShort(o.startDate)} – {fmtDateShort(o.endDate)}
                      </td>
                      <td className="cell-primary">{fmtCurrency(o.totalAmount)}</td>
                      <td>
                        <StatusBadge status={o.status} />
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
