"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GearStatusBadge } from "@/components/shared/status-badges";
import { clientApiFetch } from "@/lib/client-api";
import { formatCurrency } from "@/lib/utils";
import type { GearItem } from "@/lib/types";

export function AdminGearTable() {
  const gearQuery = useQuery({ queryKey: ["admin-gear"], queryFn: () => clientApiFetch<GearItem[]>("/admin/gear") });

  if (gearQuery.isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Gear</TableHead>
          <TableHead>Provider</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Price/day</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(gearQuery.data ?? []).map((gear) => (
          <TableRow key={gear.id}>
            <TableCell className="font-medium">{gear.name}</TableCell>
            <TableCell>{gear.provider?.name}</TableCell>
            <TableCell>{gear.category?.name}</TableCell>
            <TableCell>{formatCurrency(gear.pricePerDay)}</TableCell>
            <TableCell>
              {gear.availableQuantity}/{gear.totalQuantity}
            </TableCell>
            <TableCell>
              <GearStatusBadge status={gear.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
