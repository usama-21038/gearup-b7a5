"use client";

import * as React from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreditCard, Loader2, Landmark } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StripePaymentForm } from "./stripe-payment-form";
import { clientApiFetch, ClientApiError } from "@/lib/client-api";
import { formatCurrency } from "@/lib/utils";

interface CreatePaymentResult {
  paymentId: string;
  transactionId: string;
  method: "STRIPE" | "SSLCOMMERZ";
  clientSecret?: string;
  stripePaymentIntentId?: string;
  gatewayPageURL?: string;
}

export function PaymentGatewayPicker({ orderId, totalAmount }: { orderId: string; totalAmount: string }) {
  const [method, setMethod] = React.useState<"STRIPE" | "SSLCOMMERZ" | null>(null);

  const mutation = useMutation({
    mutationFn: (m: "STRIPE" | "SSLCOMMERZ") =>
      clientApiFetch<CreatePaymentResult>("/payments/create", {
        method: "POST",
        body: { rentalOrderId: orderId, method: m },
      }),
    onSuccess: (result) => {
      if (result.method === "SSLCOMMERZ" && result.gatewayPageURL) {
        window.location.href = result.gatewayPageURL;
      }
    },
    onError: (err) => {
      toast.error(err instanceof ClientApiError ? err.message : "Could not start the payment.");
      setMethod(null);
    },
  });

  function choose(m: "STRIPE" | "SSLCOMMERZ") {
    setMethod(m);
    mutation.mutate(m);
  }

  if (mutation.data?.method === "STRIPE" && mutation.data.clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Pay {formatCurrency(totalAmount)} with card</CardTitle>
        </CardHeader>
        <CardContent>
          <StripePaymentForm clientSecret={mutation.data.clientSecret} transactionId={mutation.data.transactionId} orderId={orderId} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a payment method</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <button
          onClick={() => choose("STRIPE")}
          disabled={mutation.isPending}
          className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary disabled:opacity-60"
        >
          <CreditCard className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">Card (Stripe)</p>
            <p className="text-xs text-muted-foreground">Visa, Mastercard - test mode enabled</p>
          </div>
          {mutation.isPending && method === "STRIPE" && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
        </button>
        <button
          onClick={() => choose("SSLCOMMERZ")}
          disabled={mutation.isPending}
          className="flex w-full items-center gap-3 rounded-lg border border-border p-4 text-left transition-colors hover:border-primary disabled:opacity-60"
        >
          <Landmark className="h-5 w-5 text-primary" />
          <div>
            <p className="font-medium">SSLCommerz</p>
            <p className="text-xs text-muted-foreground">bKash, Nagad, cards - Bangladeshi sandbox gateway</p>
          </div>
          {mutation.isPending && method === "SSLCOMMERZ" && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
        </button>
      </CardContent>
    </Card>
  );
}
