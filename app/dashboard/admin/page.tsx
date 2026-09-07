"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { GearItem, RentalOrder, User } from "@/lib/types";
import { fmtCurrency, fmtDateShort } from "@/lib/utils";
import { StatCard, ErrorState } from "@/components/ui";
import { StatusBadge, UserStatusBadge } from "@/components/badges";

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [gear, setGear] = useState<GearItem[]>([]);
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([adminApi.users(), adminApi.gear(), adminApi.rentals()])
      .then(([u, g, o]) => {
        setUsers(u);
        setGear(g);
        setOrders(o);
      })
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  if (loading) return <div className="skel skel-line" style={{ width: 200 }} />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  const revenue = orders.filter((o) => ["PAID", "PICKED_UP", "RETURNED"].includes(o.status)).reduce((s, o) => s + parseFloat(o.totalAmount), 0);

  const stats = [
    { label: "Total users", val: users.length },
    { label: "Active gear", val: gear.filter((g) => g.status === "ACTIVE").length },
    { label: "Total rentals", val: orders.length },
    { label: "Platform revenue", val: fmtCurrency(revenue) },
  ];

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Admin overview</h1>
          <p className="text-body">Platform-wide health at a glance.</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.val} />
        ))}
      </div>

      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card panel">
          <div className="panel-head">
            <h3 className="text-h3">Recent users</h3>
            <Link href="/dashboard/admin/users" className="link-btn">
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 5).map((u) => (
                  <tr key={u.id}>
                    <td>
                      <div className="cell-primary">{u.name}</div>
                      <div className="cell-sub">{u.email}</div>
                    </td>
                    <td>{u.role}</td>
                    <td>
                      <UserStatusBadge status={u.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card panel">
          <div className="panel-head">
            <h3 className="text-h3">Recent orders</h3>
            <Link href="/dashboard/admin/orders" className="link-btn">
              View all
            </Link>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="cell-primary">{o.id.slice(0, 8)}</td>
                    <td>{fmtDateShort(o.createdAt)}</td>
                    <td>
                      <StatusBadge status={o.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
