"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clientApiFetch } from "@/lib/client-api";
import { env } from "@/lib/env-client";

const stripePromise = env.stripePublishableKey ? loadStripe(env.stripePublishableKey) : null;

function InnerForm({ transactionId, orderId }: { transactionId: string; orderId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment/success?transactionId=${transactionId}&orderId=${orderId}`,
      },
      redirect: "if_required",
    });

    if (error) {
      toast.error(error.message ?? "Payment failed. Please try a different card.");
      setSubmitting(false);
      return;
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await clientApiFetch("/payments/confirm", {
          method: "POST",
          body: { transactionId, status: "COMPLETED" },
        });
      } catch {
        // Non-fatal: the success page re-confirms too.
      }
      router.push(`/payment/success?transactionId=${transactionId}&orderId=${orderId}`);
      return;
    }

    setSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      <Button type="submit" size="lg" variant="accent" className="w-full" disabled={!stripe || submitting}>
        {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
        Pay now
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Test mode: use card <span className="font-mono">4242 4242 4242 4242</span>, any future expiry, any CVC.
      </p>
    </form>
  );
}

export function StripePaymentForm({
  clientSecret,
  transactionId,
  orderId,
}: {
  clientSecret: string;
  transactionId: string;
  orderId: string;
}) {
  if (!stripePromise) {
    return (
      <p className="rounded-md border border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
        Stripe publishable key is not configured. Add <code>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</code> to your
        environment to enable the card payment form.
      </p>
    );
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: "stripe" } }}>
      <InnerForm transactionId={transactionId} orderId={orderId} />
    </Elements>
  );
}
