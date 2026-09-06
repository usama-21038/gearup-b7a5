"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RentalStatusBadge } from "@/components/shared/status-badges";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { RentalOrder, RentalStatus } from "@/lib/types";

// Mirrors the backend's VALID_TRANSITIONS map (provider.service.ts) so the UI
// only ever offers actions the API will actually accept.
const NEXT_ACTIONS: Partial<Record<RentalStatus, { status: RentalStatus; label: string; variant?: "default" | "destructive" | "outline" }[]>> = {
  PLACED: [
    { status: "CONFIRMED", label: "Confirm" },
    { status: "CANCELLED", label: "Cancel", variant: "outline" },
  ],
  CONFIRMED: [{ status: "CANCELLED", label: "Cancel", variant: "outline" }],
  PAID: [
    { status: "PICKED_UP", label: "Mark picked up" },
    { status: "CANCELLED", label: "Cancel", variant: "outline" },
  ],
  PICKED_UP: [{ status: "RETURNED", label: "Mark returned" }],
};

export function OrdersTable() {
  const queryClient = useQueryClient();
  const ordersQuery = useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => clientApiFetch<RentalOrder[]>("/provider/orders"),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: RentalStatus }) =>
      clientApiFetch<RentalOrder>(`/provider/orders/${id}`, { method: "PATCH", body: { status } }),
    onSuccess: () => {
      toast.success("Order updated.");
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
    onError: (err) => toast.error(err instanceof ClientApiError ? err.message : "Could not update this order."),
  });

  if (ordersQuery.isLoading) return <Skeleton className="h-64 w-full" />;

  const orders = ordersQuery.data ?? [];
  if (orders.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No orders yet for your gear.
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Gear</TableHead>
          <TableHead>Dates</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => {
          const actions = NEXT_ACTIONS[order.status] ?? [];
          const isPending = updateStatus.isPending && updateStatus.variables?.id === order.id;
          return (
            <TableRow key={order.id}>
              <TableCell>
                <p className="font-medium">{order.customer?.name}</p>
                <p className="text-xs text-muted-foreground">{order.customer?.email}</p>
              </TableCell>
              <TableCell className="max-w-[180px] truncate">{order.items.map((i) => i.gearItem.name).join(", ")}</TableCell>
              <TableCell className="text-xs">
                {formatDate(order.startDate)} – {formatDate(order.endDate)}
              </TableCell>
              <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
              <TableCell>
                <RentalStatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1.5">
                  {actions.length === 0 && <span className="text-xs text-muted-foreground">No actions</span>}
                  {actions.map((action) => (
                    <Button
                      key={action.status}
                      size="sm"
                      variant={action.variant ?? "default"}
                      disabled={updateStatus.isPending}
                      onClick={() => updateStatus.mutate({ id: order.id, status: action.status })}
                    >
                      {isPending && updateStatus.variables?.status === action.status && (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      )}
                      {action.label}
                    </Button>
                  ))}
                </div>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
