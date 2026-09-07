"use client";

import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { paymentApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { Spinner } from "./ui";
import { CardIcon } from "./icons";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "14px",
      color: "#0f172a",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      "::placeholder": { color: "#94a3b8" },
    },
    invalid: { color: "#dc2626" },
  },
};

export function StripePaymentForm({
  clientSecret,
  transactionId,
  onSuccess,
}: {
  clientSecret: string;
  transactionId: string;
  onSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setSubmitting(false);
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: cardElement },
    });

    if (result.error) {
      setError(result.error.message || "Your card was declined.");
      setSubmitting(false);
      return;
    }

    if (result.paymentIntent?.status === "succeeded") {
      try {
        await paymentApi.confirm({ transactionId, status: "COMPLETED" });
      } catch (err) {
        // Payment succeeded on Stripe's side even if this confirm call fails;
        // surface it but don't block the success redirect.
        console.error(getErrorMessage(err));
      }
      onSuccess();
    } else {
      setError("Payment could not be completed. Please try a different card.");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label>
          <CardIcon size={14} /> Card details
        </label>
        <div style={{ border: "1px solid var(--color-border)", borderRadius: "var(--r-input)", padding: "13px 14px" }}>
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <div className="field-help">Use test card 4242 4242 4242 4242, any future date, any CVC.</div>
      </div>
      {error && <div className="field-error" style={{ marginBottom: 14 }}>{error}</div>}
      <button className="btn btn-primary btn-block btn-lg" type="submit" disabled={!stripe || submitting}>
        {submitting ? (
          <>
            <Spinner /> Processing payment...
          </>
        ) : (
          "Pay now"
        )}
      </button>
    </form>
  );
}
