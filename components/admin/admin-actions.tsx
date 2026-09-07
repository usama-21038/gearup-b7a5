"use client";

import { DialogSurface } from "@/components/ui/gearup";
import { Button } from "@/components/ui/button";
import { updateUserStatus } from "@/service/admin/adminService";
import type { User, UserStatus } from "@/types/user";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function UserStatusAction({ user, onUpdated }: { user: User; onUpdated: (user: User) => void }) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const nextStatus: UserStatus = user.activeStatus === "Active" ? "Suspended" : "Active";
  const suspending = nextStatus === "Suspended";

  const confirm = async () => {
    setPending(true);
    try {
      const response = await updateUserStatus(user.id, nextStatus);
      if (!response.success || !response.data) throw new Error(response.message || "User status could not be updated.");
      onUpdated(response.data);
      setOpen(false);
      toast.success(`${user.name} ${suspending ? "suspended" : "activated"}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "User status could not be updated.");
    } finally { setPending(false); }
  };

  return <><Button variant={suspending ? "destructive" : "secondary"} size="sm" onClick={() => setOpen(true)}>{suspending ? "Suspend" : "Activate"}</Button><DialogSurface open={open} onClose={() => setOpen(false)} title={`${suspending ? "Suspend" : "Activate"} ${user.name}?`} description={suspending ? "This user will lose access to their GearUp account and listings." : "This will restore full access for this user."} actions={<><Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button variant={suspending ? "destructive" : "default"} onClick={confirm} disabled={pending}>{pending ? <LoaderCircle className="animate-spin" /> : suspending ? "Suspend user" : "Activate user"}</Button></>} /></>;
}
