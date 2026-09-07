"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { providerApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { getErrorMessage } from "@/lib/get-error-message";
import type { GearItem, RentalOrder } from "@/lib/types";
import { StatCard, ErrorState } from "@/components/ui";
import { PlusIcon } from "@/components/icons";
import { ProviderOrdersTable } from "@/components/provider-orders-table";

export default function ProviderDashboardPage() {
  const { user } = useAuth();
  const [gear, setGear] = useState<GearItem[]>([]);
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([providerApi.gearList(), providerApi.orders()])
      .then(([g, o]) => {
        setGear(g);
        setOrders(o);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <div className="skel skel-line" style={{ width: 200 }} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const stats = [
    { label: "Gear listed", val: gear.length },
    { label: "Active rentals", val: orders.filter((o) => ["PAID", "PICKED_UP"].includes(o.status)).length },
    { label: "Pending orders", val: orders.filter((o) => o.status === "PLACED").length },
    { label: "Total earned", val: `$${orders.filter((o) => ["PAID", "PICKED_UP", "RETURNED"].includes(o.status)).reduce((s, o) => s + parseFloat(o.totalAmount), 0).toFixed(2)}` },
  ];

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Hey, {user?.name.split(" ")[0]}</h1>
          <p className="text-body">Here&apos;s how your inventory is performing.</p>
        </div>
        <Link href="/dashboard/provider/gear/new" className="btn btn-primary">
          <PlusIcon /> Add gear
        </Link>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.val} />
        ))}
      </div>

      <div className="card panel">
        <div className="panel-head">
          <h3 className="text-h3">Recent orders</h3>
          <Link href="/dashboard/provider/orders" className="link-btn">
            View all
          </Link>
        </div>
        <ProviderOrdersTable
          orders={orders.slice(0, 5)}
          onUpdated={(updated) => setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))}
        />
      </div>
    </div>
  );
}
