"use client";

import { useQuery } from "@tanstack/react-query";
import { Boxes, ListOrdered, ShieldAlert, Users } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { clientApiFetch } from "@/lib/client-api";
import type { GearItem, RentalOrder, User } from "@/lib/types";

export function AdminOverview() {
  const usersQuery = useQuery({ queryKey: ["admin-users"], queryFn: () => clientApiFetch<User[]>("/admin/users") });
  const gearQuery = useQuery({ queryKey: ["admin-gear"], queryFn: () => clientApiFetch<GearItem[]>("/admin/gear") });
  const rentalsQuery = useQuery({ queryKey: ["admin-rentals"], queryFn: () => clientApiFetch<RentalOrder[]>("/admin/rentals") });

  const users = usersQuery.data ?? [];
  const suspended = users.filter((u) => u.status === "SUSPENDED").length;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard icon={Users} label="Total users" value={users.length} hint={`${suspended} suspended`} />
      <StatCard icon={Boxes} label="Gear listings" value={(gearQuery.data ?? []).length} />
      <StatCard icon={ListOrdered} label="Rental orders" value={(rentalsQuery.data ?? []).length} />
      <StatCard icon={ShieldAlert} label="Suspended accounts" value={suspended} />
    </div>
  );
}
