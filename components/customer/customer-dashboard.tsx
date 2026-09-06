"use client";

import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { CalendarRange, CreditCard, PackageCheck, Wallet } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { RentalStatusBadge, PaymentStatusBadge } from "@/components/shared/status-badges";
import { CancelRentalButton } from "./cancel-rental-button";
import { ReviewDialog } from "./review-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { clientApiFetch } from "@/lib/client-api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { gearImage } from "@/components/gear/gear-utils";
import type { Payment, RentalOrder } from "@/lib/types";

export function CustomerDashboard() {
  const rentalsQuery = useQuery({
    queryKey: ["rentals"],
    queryFn: () => clientApiFetch<RentalOrder[]>("/rentals"),
  });
  const paymentsQuery = useQuery({
    queryKey: ["payments"],
    queryFn: () => clientApiFetch<Payment[]>("/payments"),
  });

  const rentals = rentalsQuery.data ?? [];
  const activeCount = rentals.filter((r) => !["RETURNED", "CANCELLED"].includes(r.status)).length;
  const totalSpent = (paymentsQuery.data ?? [])
    .filter((p) => p.status === "COMPLETED")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Your rentals</h1>
        <p className="text-sm text-muted-foreground">Track orders, pay for confirmed gear, and leave reviews once returned.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={CalendarRange} label="Active rentals" value={activeCount} />
        <StatCard icon={PackageCheck} label="Total orders" value={rentals.length} />
        <StatCard icon={Wallet} label="Total spent" value={formatCurrency(totalSpent)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rental orders</CardTitle>
        </CardHeader>
        <CardContent>
          {rentalsQuery.isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          ) : rentals.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No rentals yet.{" "}
              <Link href="/gear" className="text-primary underline underline-offset-2">
                Browse gear
              </Link>{" "}
              to get started.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {rentals.map((order) => (
                <li key={order.id} className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                      {order.items[0] && (
                        <Image src={gearImage(order.items[0].gearItem)} alt="" fill className="object-cover" sizes="56px" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {order.items.map((i) => i.gearItem.name).join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(order.startDate)} – {formatDate(order.endDate)} · {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <RentalStatusBadge status={order.status} />
                    {(order.status === "PLACED" || order.status === "CONFIRMED") && (
                      <Button size="sm" variant="accent" asChild>
                        <Link href={`/dashboard/customer/orders/${order.id}/pay`}>Pay now</Link>
                      </Button>
                    )}
                    {(order.status === "PLACED" || order.status === "CONFIRMED") && (
                      <CancelRentalButton rentalId={order.id} />
                    )}
                    {order.status === "RETURNED" &&
                      order.items.map((item) => (
                        <ReviewDialog key={item.id} gearItemId={item.gearItemId} gearName={item.gearItem.name} />
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payment history
          </CardTitle>
        </CardHeader>
        <CardContent>
          {paymentsQuery.isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (paymentsQuery.data ?? []).length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No payments yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(paymentsQuery.data ?? []).map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-mono text-xs">{payment.transactionId.slice(0, 8)}…</TableCell>
                    <TableCell>{payment.method}</TableCell>
                    <TableCell>{formatCurrency(payment.amount)}</TableCell>
                    <TableCell>
                      <PaymentStatusBadge status={payment.status} />
                    </TableCell>
                    <TableCell>{formatDate(payment.createdAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
