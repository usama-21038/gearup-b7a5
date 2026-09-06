"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CalendarIcon, Loader2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { cn, daysBetween, formatCurrency, formatDate } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import type { RentalOrder } from "@/lib/types";

export function RentForm({
  gearId,
  pricePerDay,
  availableQuantity,
  sessionRole,
}: {
  gearId: string;
  pricePerDay: number;
  availableQuantity: number;
  sessionRole: "CUSTOMER" | "PROVIDER" | "ADMIN" | null;
}) {
  const router = useRouter();
  const [range, setRange] = React.useState<DateRange | undefined>();
  const [quantity, setQuantity] = React.useState(1);
  const [notes, setNotes] = React.useState("");

  const days = range?.from && range?.to ? daysBetween(range.from, range.to) : 0;
  const total = days * quantity * pricePerDay;

  const mutation = useMutation({
    mutationFn: () =>
      clientApiFetch<RentalOrder>("/rentals", {
        method: "POST",
        body: {
          startDate: range!.from!.toISOString(),
          endDate: range!.to!.toISOString(),
          notes: notes || undefined,
          items: [{ gearItemId: gearId, quantity }],
        },
      }),
    onSuccess: (order) => {
      toast.success("Rental order placed! Continue to payment to confirm it.");
      router.push(`/dashboard/customer/orders/${order.id}/pay`);
    },
    onError: (err) => {
      toast.error(err instanceof ClientApiError ? err.message : "Could not place the order.");
    },
  });

  if (sessionRole === "PROVIDER" || sessionRole === "ADMIN") {
    return (
      <p className="rounded-md border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
        Only customer accounts can rent gear. Log in with a customer account to book this item.
      </p>
    );
  }

  if (availableQuantity <= 0) {
    return (
      <p className="rounded-md border border-border bg-secondary/50 p-4 text-sm text-muted-foreground">
        This gear is fully booked right now. Check back later or browse similar gear.
      </p>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border bg-card p-5">
      <div className="space-y-1.5">
        <Label>Rental dates</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start font-normal">
              <CalendarIcon className="h-4 w-4" />
              {range?.from && range?.to
                ? `${formatDate(range.from)} – ${formatDate(range.to)}`
                : "Pick a start and return date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              onSelect={setRange}
              numberOfMonths={2}
              disabled={{ before: new Date(new Date().setHours(0, 0, 0, 0)) }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-1.5">
        <Label>Quantity</Label>
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center font-medium">{quantity}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setQuantity((q) => Math.min(availableQuantity, q + 1))}
            disabled={quantity >= availableQuantity}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <span className="text-xs text-muted-foreground">{availableQuantity} available</span>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes for the provider (optional)</Label>
        <Textarea
          id="notes"
          rows={2}
          placeholder="Pickup time preference, delivery address, etc."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      <div className={cn("flex items-center justify-between border-t border-border pt-4", days === 0 && "opacity-50")}>
        <div>
          <p className="text-sm text-muted-foreground">
            {days > 0 ? `${days} day${days > 1 ? "s" : ""} × ${quantity} item${quantity > 1 ? "s" : ""}` : "Select dates to see total"}
          </p>
          <p className="font-display text-2xl font-bold">{formatCurrency(total)}</p>
        </div>
        <Button
          size="lg"
          variant="accent"
          disabled={!range?.from || !range?.to || mutation.isPending}
          onClick={() => mutation.mutate()}
        >
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Rent now
        </Button>
      </div>
    </div>
  );
}
