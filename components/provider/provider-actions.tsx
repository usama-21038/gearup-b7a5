"use client";

import { DialogSurface } from "@/components/ui/gearup";
import { Button } from "@/components/ui/button";
import { deleteGear } from "@/service/gear/gearService";
import { updateProviderOrder } from "@/service/provider/providerService";
import type { Gear } from "@/types/gear";
import type { Rental, RentalStatus } from "@/types/rental";
import { LoaderCircle, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteGearButton({ gear, onDeleted }: { gear: Gear; onDeleted?: () => void }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const confirmDelete = async () => {
    setPending(true);
    try {
      const response = await deleteGear(gear.id);
      if (!response.success) throw new Error(response.message || "Gear could not be deleted.");
      toast.success("Gear deleted.");
      setOpen(false);
      onDeleted?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gear could not be deleted.");
    } finally { setPending(false); }
  };
  return <><Button variant="destructive" size="icon-sm" aria-label={`Delete ${gear.name}`} onClick={() => setOpen(true)}><Trash2 /></Button><DialogSurface open={open} onClose={() => setOpen(false)} title="Delete this gear?" description={`This will remove ${gear.name} from your provider inventory.`} actions={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant="destructive" onClick={confirmDelete} disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : "Delete"}</Button></>} /></>;
}

const nextStatus: Partial<Record<RentalStatus, { status: RentalStatus; label: string }>> = { PLACED: { status: "CONFIRMED", label: "Confirm" }, PAID: { status: "PICKED_UP", label: "Mark picked up" }, PICKED_UP: { status: "RETURNED", label: "Mark returned" } };

export function OrderStatusAction({ order, onUpdated }: { order: Rental; onUpdated?: (order: Rental) => void }) {
  const action = nextStatus[order.status];
  const [pending, setPending] = useState(false);
  if (!action) return <span className="text-xs text-muted-foreground">No action</span>;
  const update = async () => {
    setPending(true);
    try {
      const response = await updateProviderOrder(order.id, action.status);
      if (!response.success || !response.data) throw new Error(response.message || "Order status could not be updated.");
      onUpdated?.(response.data);
      toast.success(`Order marked ${action.status.toLowerCase().replace("_", " ")}.`);
    } catch (error) { toast.error(error instanceof Error ? error.message : "Order status could not be updated."); }
    finally { setPending(false); }
  };
  return <Button size="sm" onClick={update} disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : action.label}</Button>;
}

export function EditGearLink({ id }: { id: string | number }) { return <Button variant="outline" size="icon-sm" aria-label="Edit gear" asChild><Link href={`/dashboard/provider/gear/${id}/edit`}><Pencil /></Link></Button>; }
