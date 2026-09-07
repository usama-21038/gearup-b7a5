"use client";

import { Button } from "@/components/ui/button";
import { createCheckout } from "@/service/payment/paymentService";
import { submitReview } from "@/service/rental/rentalService";
import { LoaderCircle, Star } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function PaymentButton({ rentalId, className }: { rentalId: string | number; className?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const startCheckout = async () => {
    setPending(true);
    setError("");
    try {
      const response = await createCheckout(rentalId);
      if (!response.success || !response.data?.checkoutUrl) throw new Error(response.message || "Checkout could not be started.");
      window.location.assign(response.data.checkoutUrl);
    } catch (checkoutError) {
      const message = checkoutError instanceof Error ? checkoutError.message : "Checkout could not be started.";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  return <div className={className}><Button size="sm" onClick={startCheckout} disabled={pending}>{pending ? <><LoaderCircle className="animate-spin" />Starting checkout...</> : "Pay now"}</Button>{error ? <p className="mt-1 text-xs text-destructive" role="alert">{error}</p> : null}</div>;
}

export function ReviewForm({ rentalId, onSubmitted }: { rentalId: string | number; onSubmitted?: () => void }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!rating || !comment.trim()) {
      setError("Choose a rating and write a review before submitting.");
      return;
    }
    setPending(true);
    setError("");
    try {
      const response = await submitReview({ rentalId, rating, comment: comment.trim() });
      if (!response.success) throw new Error(response.message || "Review could not be submitted.");
      setSuccess(true);
      toast.success("Review submitted successfully.");
      onSubmitted?.();
    } catch (reviewError) {
      const message = reviewError instanceof Error ? reviewError.message : "Review could not be submitted.";
      setError(message);
      toast.error(message);
    } finally {
      setPending(false);
    }
  };

  if (success) return <p className="rounded-md bg-[#f0fdf4] px-3.5 py-3 text-sm text-[#166534]">Thanks for sharing your experience.</p>;

  return <form onSubmit={submit} className="space-y-4 rounded-xl border border-border bg-card p-4"><div><p className="mb-2 text-sm font-semibold">Your rating</p><div className="flex gap-1" aria-label="Choose a rating">{[1, 2, 3, 4, 5].map((value) => <button type="button" key={value} aria-label={`${value} star${value === 1 ? "" : "s"}`} onClick={() => setRating(value)}><Star className={`size-6 ${value <= rating ? "fill-[#f59e0b] text-[#f59e0b]" : "text-muted-foreground"}`} /></button>)}</div></div><div><label htmlFor={`review-${rentalId}`} className="mb-1.5 block text-[13px] font-semibold">Your review</label><textarea id={`review-${rentalId}`} value={comment} onChange={(event) => setComment(event.target.value)} rows={4} placeholder="How was the gear and rental experience?" className="w-full resize-y rounded-md border border-input bg-card px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-[3px] focus:ring-secondary" /></div>{error ? <p className="text-xs text-destructive" role="alert">{error}</p> : null}<Button type="submit" disabled={pending}>{pending ? <><LoaderCircle className="animate-spin" />Submitting...</> : "Submit review"}</Button></form>;
}
