"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RentalStatusBadge } from "@/components/shared/status-badges";
import { clientApiFetch } from "@/lib/client-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RentalOrder } from "@/lib/types";

export function AdminRentalsTable() {
  const rentalsQuery = useQuery({ queryKey: ["admin-rentals"], queryFn: () => clientApiFetch<RentalOrder[]>("/admin/rentals") });

  if (rentalsQuery.isLoading) return <Skeleton className="h-64 w-full" />;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Gear</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(rentalsQuery.data ?? []).map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <p className="font-medium">{order.customer?.name}</p>
              <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{order.items.map((i) => i.gearItem.name).join(", ")}</TableCell>
            <TableCell className="text-xs">
              {formatDate(order.startDate)} – {formatDate(order.endDate)}
            </TableCell>
            <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
            <TableCell>
              <RentalStatusBadge status={order.status} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
