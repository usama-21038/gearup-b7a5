"use client";

import * as React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { reviewSchema } from "@/lib/validations";
import type { Review } from "@/lib/types";

export function ReviewDialog({ gearItemId, gearName }: { gearItemId: string; gearName: string }) {
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState(5);
  const [comment, setComment] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () =>
      clientApiFetch<Review>("/reviews", {
        method: "POST",
        body: { gearItemId, rating, comment: comment || undefined },
      }),
    onSuccess: () => {
      toast.success("Review submitted. Thanks for the feedback!");
      queryClient.invalidateQueries({ queryKey: ["rentals"] });
      setOpen(false);
      setComment("");
      setRating(5);
    },
    onError: (err) => {
      setError(err instanceof ClientApiError ? err.message : "Could not submit the review.");
    },
  });

  function submit() {
    setError(null);
    const parsed = reviewSchema.safeParse({ gearItemId, rating, comment });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your review.");
      return;
    }
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Leave a review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review: {gearName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Rating</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star`}>
                  <Star className={cn("h-6 w-6", n <= rating ? "fill-accent text-accent" : "text-muted-foreground")} />
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="comment">Comment (optional)</Label>
            <Textarea id="comment" rows={3} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="How was the gear?" />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={mutation.isPending}>
            Submit review
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
