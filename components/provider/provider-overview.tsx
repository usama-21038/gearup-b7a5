"use client";

import { useQuery } from "@tanstack/react-query";
import { Boxes, ClipboardList, Package, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { clientApiFetch } from "@/lib/client-api";
import { formatCurrency } from "@/lib/utils";
import type { GearItem, RentalOrder } from "@/lib/types";

export function ProviderOverview() {
  const gearQuery = useQuery({ queryKey: ["provider-gear"], queryFn: () => clientApiFetch<GearItem[]>("/provider/gear") });
  const ordersQuery = useQuery({ queryKey: ["provider-orders"], queryFn: () => clientApiFetch<RentalOrder[]>("/provider/orders") });

  const gear = gearQuery.data ?? [];
  const orders = ordersQuery.data ?? [];
  const pending = orders.filter((o) => o.status === "PLACED").length;
  const revenue = orders
    .filter((o) => !["CANCELLED", "PLACED"].includes(o.status))
    .reduce((sum, o) => sum + Number(o.totalAmount), 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={Boxes} label="Listed gear" value={gear.length} />
      <StatCard icon={Package} label="Active listings" value={gear.filter((g) => g.status === "ACTIVE").length} />
      <StatCard icon={ClipboardList} label="Orders awaiting review" value={pending} />
      <StatCard icon={Wallet} label="Confirmed revenue" value={formatCurrency(revenue)} />
    </div>
  );
}
