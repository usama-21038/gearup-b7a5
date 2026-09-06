"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import type { RentalOrder } from "@/lib/types";

export function CancelRentalButton({ rentalId }: { rentalId: string }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => clientApiFetch<RentalOrder>(`/rentals/${rentalId}/cancel`, { method: "PATCH" }),
    onSuccess: () => {
      toast.success("Rental order cancelled.");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
    },
    onError: (err) => {
      toast.error(err instanceof ClientApiError ? err.message : "Could not cancel this order.");
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          Cancel order
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this rental?</AlertDialogTitle>
          <AlertDialogDescription>
            This releases the gear back to the provider&apos;s available stock. This can&apos;t be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep order</AlertDialogCancel>
          <AlertDialogAction onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            Yes, cancel it
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
