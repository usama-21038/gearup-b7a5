"use client";

import Link from "next/link";
import { useState } from "react";
import { providerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { useToast } from "@/lib/toast-context";
import { useConfirm } from "@/lib/confirm-context";
import type { RentalOrder, RentalStatus } from "@/lib/types";
import { fmtCurrency, fmtDateShort } from "@/lib/utils";
import { StatusBadge } from "./badges";
import { CategoryIcon, ShieldIcon, categoryTintClass } from "./icons";
import { EmptyState, Spinner } from "./ui";

const NEXT_ACTIONS: Record<RentalStatus, Array<{ label: string; to: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED"; tone?: "danger" }>> = {
  PLACED: [
    { label: "Confirm", to: "CONFIRMED" },
    { label: "Cancel", to: "CANCELLED", tone: "danger" },
  ],
  CONFIRMED: [{ label: "Cancel", to: "CANCELLED", tone: "danger" }],
  PAID: [
    { label: "Mark picked up", to: "PICKED_UP" },
    { label: "Cancel", to: "CANCELLED", tone: "danger" },
  ],
  PICKED_UP: [{ label: "Mark returned", to: "RETURNED" }],
  RETURNED: [],
  CANCELLED: [],
};

export function ProviderOrdersTable({ orders, onUpdated }: { orders: RentalOrder[]; onUpdated: (order: RentalOrder) => void }) {
  const toast = useToast();
  const confirm = useConfirm();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleAction(order: RentalOrder, to: "CONFIRMED" | "PICKED_UP" | "RETURNED" | "CANCELLED", tone?: "danger") {
    if (tone === "danger") {
      const ok = await confirm({
        title: "Cancel this order?",
        body: "The reserved gear will be released back into stock for other customers.",
        confirmLabel: "Cancel order",
        tone: "danger",
        icon: <ShieldIcon />,
      });
      if (!ok) return;
    }
    setUpdatingId(order.id);
    try {
      const updated = await providerApi.updateOrderStatus(order.id, to);
      onUpdated(updated);
      toast.success(`Order updated to "${to.replace("_", " ").toLowerCase()}".`);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't update that order."));
    } finally {
      setUpdatingId(null);
    }
  }

  if (orders.length === 0) {
    return <EmptyState title="No orders yet" body="Orders for your gear will show up here as customers rent it." />;
  }

  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>Gear</th>
            <th>Customer</th>
            <th>Dates</th>
            <th>Amount</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const firstItem = o.items[0];
            const gearName = o.items.length > 1 ? `${firstItem?.gearItem.name} + ${o.items.length - 1} more` : firstItem?.gearItem.name || "Gear item";
            const category = firstItem?.gearItem.category.name || "Cycling";
            const actions = NEXT_ACTIONS[o.status];
            return (
              <tr key={o.id}>
                <td>
                  <div className="row-flex">
                    <div className={`mini-thumb ${categoryTintClass(category)}`}>
                      <CategoryIcon category={category} size={18} />
                    </div>
                    <div>
                      <Link href={`/dashboard/provider/orders`} className="cell-primary" style={{ color: "var(--color-text)" }}>
                        {gearName}
                      </Link>
                      <div className="cell-sub">{o.id.slice(0, 8)}</div>
                    </div>
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
                  {o.status === "CONFIRMED" && <div className="cell-sub" style={{ marginTop: 4 }}>Awaiting payment</div>}
                </td>
                <td style={{ textAlign: "right" }}>
                  {updatingId === o.id ? (
                    <Spinner dark />
                  ) : (
                    <div style={{ display: "flex", gap: 6, justifyContent: "flex-end", flexWrap: "wrap" }}>
                      {actions.map((a) => (
                        <button
                          key={a.to}
                          className={`btn btn-sm ${a.tone === "danger" ? "btn-destructive" : "btn-primary"}`}
                          onClick={() => handleAction(o, a.to, a.tone)}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
