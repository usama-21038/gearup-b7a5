"use client";

import Image from "next/image";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GearFormDialog } from "./gear-form-dialog";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { formatCurrency } from "@/lib/utils";
import { gearImage } from "@/components/gear/gear-utils";
import type { GearItem } from "@/lib/types";

export function InventoryTable() {
  const queryClient = useQueryClient();
  const gearQuery = useQuery({
    queryKey: ["provider-gear"],
    queryFn: () => clientApiFetch<GearItem[]>("/provider/gear"),
  });

  const toggleStatus = useMutation({
    mutationFn: (gear: GearItem) =>
      clientApiFetch<GearItem>(`/provider/gear/${gear.id}`, {
        method: "PUT",
        body: { status: gear.status === "ACTIVE" ? "INACTIVE" : "ACTIVE" },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
    },
    onError: (err) => toast.error(err instanceof ClientApiError ? err.message : "Could not update status."),
  });

  const deleteGear = useMutation({
    mutationFn: (id: string) => clientApiFetch(`/provider/gear/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      toast.success("Gear removed.");
      queryClient.invalidateQueries({ queryKey: ["provider-gear"] });
    },
    onError: (err) => toast.error(err instanceof ClientApiError ? err.message : "Could not delete this gear."),
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold">Your inventory</h2>
        <GearFormDialog
          trigger={
            <Button size="sm">
              <Plus className="h-4 w-4" /> Add gear
            </Button>
          }
        />
      </div>

      {gearQuery.isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (gearQuery.data ?? []).length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          You haven&apos;t listed any gear yet.
        </p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Gear</TableHead>
              <TableHead>Price/day</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(gearQuery.data ?? []).map((gear) => (
              <TableRow key={gear.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image src={gearImage(gear)} alt="" fill className="object-cover" sizes="40px" />
                    </div>
                    <div>
                      <p className="font-medium">{gear.name}</p>
                      <p className="text-xs text-muted-foreground">{gear.category?.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(gear.pricePerDay)}</TableCell>
                <TableCell>
                  {gear.availableQuantity} / {gear.totalQuantity}
                </TableCell>
                <TableCell>
                  <Switch checked={gear.status === "ACTIVE"} onCheckedChange={() => toggleStatus.mutate(gear)} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <GearFormDialog
                      gear={gear}
                      trigger={
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete {gear.name}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes it from your inventory permanently. Existing rental history is kept.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteGear.mutate(gear.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
