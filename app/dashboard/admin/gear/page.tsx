"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { GearItem } from "@/lib/types";
import { fmtCurrency } from "@/lib/utils";
import { CategoryIcon, ExtIcon, SearchIcon, categoryTintClass } from "@/components/icons";
import { ErrorState } from "@/components/ui";

export default function AdminGearPage() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const load = () => {
    setLoading(true);
    adminApi
      .gear()
      .then(setGear)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return gear;
    return gear.filter((g) => g.name.toLowerCase().includes(q) || g.provider.name.toLowerCase().includes(q));
  }, [gear, search]);

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Gear moderation</h1>
          <p className="text-body">Every listing across all providers on the platform.</p>
        </div>
      </div>
      <div className="card panel">
        <div className="table-toolbar">
          <div className="search-input-wrap" style={{ maxWidth: 320 }}>
            <SearchIcon />
            <input type="text" placeholder="Search gear or provider..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <span className="text-small">{filtered.length} listing(s)</span>
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
                  <th>Gear</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Price/day</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g) => (
                  <tr key={g.id}>
                    <td>
                      <div className="row-flex">
                        <div className={`mini-thumb ${categoryTintClass(g.category.name)}`}>
                          <CategoryIcon category={g.category.name} size={18} />
                        </div>
                        <div className="cell-primary">{g.name}</div>
                      </div>
                    </td>
                    <td>
                      <div className="cell-primary">{g.provider.name}</div>
                      <div className="cell-sub">{g.provider.email}</div>
                    </td>
                    <td>{g.category.name}</td>
                    <td className="cell-primary">{fmtCurrency(g.pricePerDay)}</td>
                    <td>
                      {g.availableQuantity} / {g.totalQuantity}
                    </td>
                    <td>
                      <span className={`badge badge-${g.status === "ACTIVE" ? "ACTIVE" : "SUSPENDED"}`}>
                        <span className="badge-dot" />
                        {g.status === "ACTIVE" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <Link href={`/gear/${g.id}`} target="_blank" className="btn btn-outline btn-sm">
                        <ExtIcon /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
