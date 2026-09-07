"use client";

import { useEffect, useState } from "react";
import { providerApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { RentalOrder } from "@/lib/types";
import { ErrorState } from "@/components/ui";
import { ProviderOrdersTable } from "@/components/provider-orders-table";

export default function ProviderOrdersPage() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    providerApi
      .orders()
      .then(setOrders)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">Orders</h1>
          <p className="text-body">Manage incoming rental requests for your gear.</p>
        </div>
      </div>
      <div className="card panel">
        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <ProviderOrdersTable orders={orders} onUpdated={(updated) => setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))} />
        )}
      </div>
    </div>
  );
}
