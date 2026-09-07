"use client";

import { useEffect, useState } from "react";
import { rentalApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import type { RentalOrder } from "@/lib/types";
import { CustomerOrdersTable } from "@/components/customer-orders-table";
import { ErrorState } from "@/components/ui";

export default function CustomerOrdersPage() {
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

  return (
    <div>
      <div className="dash-header">
        <div>
          <h1 className="text-h1">My orders</h1>
          <p className="text-body">Every rental you&apos;ve placed, tracked in one place.</p>
        </div>
      </div>
      <div className="card panel">
        {loading ? (
          <div className="skel skel-line" style={{ width: 200 }} />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <CustomerOrdersTable orders={orders} />
        )}
      </div>
    </div>
  );
}
