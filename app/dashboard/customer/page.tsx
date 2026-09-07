"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { rentalApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import type { RentalOrder } from "@/lib/types";
import { daysBetween, fmtDateShort } from "@/lib/utils";
import { StatCard } from "@/components/ui";
import { StatusBadge } from "@/components/badges";
import { CategoryIcon, PlusIcon, categoryTintClass } from "@/components/icons";
import { CustomerOrdersTable } from "@/components/customer-orders-table";
import { ErrorState } from "@/components/ui";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    rentalApi
      .list()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <div className="skel skel-line" style={{ width: 200 }} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const stats = [
    { label: "Total rentals", val: orders.length },
    { label: "Active rentals", val: orders.filter((o) => ["CONFIRMED", "PAID", "PICKED_UP"].includes(o.status)).length },
    { label: "Pending orders", val: orders.filter((o) => o.status === "PLACED").length },
    { label: "Completed rentals", val: orders.filter((o) => o.status === "RETURNED").length },
  ];

  const active = orders.find((o) => o.status === "PICKED_UP");
  const recent = orders.slice(0, 4);
  const activeGear = active?.items[0]?.gearItem;

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Hey, {user?.name.split(" ")[0]}</h1>
          <p className="text-body">Here&apos;s what&apos;s happening with your rentals.</p>
        </div>
        <Link href="/gear" className="btn btn-primary">
          <PlusIcon /> Rent new gear
        </Link>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.val} />
        ))}
      </div>

      {active && activeGear && (
        <div className="card panel" style={{ borderColor: "var(--color-primary)" }}>
          <div className="panel-head">
            <h3 className="text-h3">Active rental</h3>
            <StatusBadge status={active.status} />
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div className={`mini-thumb ${categoryTintClass(activeGear.category.name)}`} style={{ width: 56, height: 56 }}>
              <CategoryIcon category={activeGear.category.name} size={26} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{activeGear.name}</div>
              <div className="text-small">
                {fmtDateShort(active.startDate)} → {fmtDateShort(active.endDate)} · Return in{" "}
                {Math.max(0, daysBetween(new Date().toISOString(), active.endDate))} days
              </div>
            </div>
            <Link href={`/dashboard/customer/orders/${active.id}`} className="btn btn-secondary btn-sm">
              View order
            </Link>
          </div>
        </div>
      )}

      <div className="card panel">
        <div className="panel-head">
          <h3 className="text-h3">Recent orders</h3>
          <Link href="/dashboard/customer/orders" className="link-btn">
            View all
          </Link>
        </div>
        <CustomerOrdersTable orders={recent} />
      </div>
    </div>
  );
}
