"use client";

import { Elements } from "@stripe/react-stripe-js";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { paymentApi, rentalApi } from "@/lib/api";
import { getErrorMessage } from "@/lib/get-error-message";
import { getStripe, STRIPE_PUBLISHABLE_KEY } from "@/lib/stripe";
import { useToast } from "@/lib/toast-context";
import type { CreatePaymentResult, RentalOrder } from "@/lib/types";
import { fmtCurrency, fmtDate } from "@/lib/utils";
import { StripePaymentForm } from "@/components/stripe-payment-form";
import { ArrowLeftIcon, CardIcon, CheckCircleIcon } from "@/components/icons";
import { ErrorState, Spinner } from "@/components/ui";

type Method = "STRIPE" | "SSLCOMMERZ";

export default function PayOrderPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();

  const [order, setOrder] = useState<RentalOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [method, setMethod] = useState<Method | null>(null);
  const [initiating, setInitiating] = useState(false);
  const [paymentResult, setPaymentResult] = useState<CreatePaymentResult | null>(null);

  useEffect(() => {
    rentalApi
      .getById(params.id)
      .then(setOrder)
      .catch((err) => setError(getErrorMessage(err, "Couldn't load this order.")))
      .finally(() => setLoading(false));
  }, [params.id]);

  async function startPayment(chosen: Method) {
    if (!order) return;
    setMethod(chosen);
    setInitiating(true);
    try {
      const result = await paymentApi.create({ rentalOrderId: order.id, method: chosen });
      if (result.method === "SSLCOMMERZ") {
        window.location.href = result.gatewayPageURL;
        return;
      }
      setPaymentResult(result);
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't start that payment."));
      setMethod(null);
    } finally {
      setInitiating(false);
    }
  }

  if (loading) {
    return (
      <div className="section-tight" style={{ textAlign: "center", padding: "60px 0" }}>
        <Spinner dark />
      </div>
    );
  }
  if (error || !order) {
    return (
      <div className="section-tight">
        <ErrorState message={error || "Order not found."} />
      </div>
    );
  }
  if (!["PLACED", "CONFIRMED"].includes(order.status)) {
    return (
      <div className="section-tight">
        <div className="state-block card">
          <div className="state-icon" style={{ background: "var(--color-success-tint)", color: "var(--color-success-text)" }}>
            <CheckCircleIcon />
          </div>
          <h3>This order can&apos;t be paid right now</h3>
          <p>Its current status is &ldquo;{order.status.replace("_", " ").toLowerCase()}&rdquo;, so no payment is needed.</p>
          <Link href={`/dashboard/customer/orders/${order.id}`} className="btn btn-primary btn-sm">
            View order
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-tight">
      <button className="btn btn-ghost btn-sm" style={{ paddingLeft: 0, marginBottom: 12 }} onClick={() => router.push(`/dashboard/customer/orders/${order.id}`)}>
        <ArrowLeftIcon /> Back to order
      </button>
      <h1 className="text-h2" style={{ marginBottom: 20 }}>
        Checkout
      </h1>
      <div className="grid-2" style={{ alignItems: "start" }}>
        <div className="card panel">
          <h3 className="text-h3" style={{ marginBottom: 16 }}>
            Choose a payment method
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className={`role-card ${method === "STRIPE" ? "active" : ""}`} onClick={() => startPayment("STRIPE")} disabled={initiating}>
              <div className="rc-title">
                <CardIcon size={15} /> Pay with card (Stripe)
              </div>
              <div className="rc-desc">Visa, Mastercard, Amex — secured by Stripe.</div>
            </button>
            <button className={`role-card ${method === "SSLCOMMERZ" ? "active" : ""}`} onClick={() => startPayment("SSLCOMMERZ")} disabled={initiating}>
              <div className="rc-title">Pay with SSLCommerz</div>
              <div className="rc-desc">Cards, mobile banking (bKash, Nagad), and more.</div>
            </button>
          </div>

          {initiating && (
            <div style={{ marginTop: 16 }}>
              <Spinner dark /> <span className="text-small">Setting up secure payment...</span>
            </div>
          )}

          {method === "STRIPE" && paymentResult?.method === "STRIPE" && (
            <div style={{ marginTop: 20 }}>
              {!STRIPE_PUBLISHABLE_KEY || STRIPE_PUBLISHABLE_KEY.includes("your_key_here") ? (
                <div className="field-error">
                  Stripe isn&apos;t configured yet. Set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your environment to enable card payments.
                </div>
              ) : (
                <Elements stripe={getStripe()} options={{ clientSecret: paymentResult.clientSecret }}>
                  <StripePaymentForm
                    clientSecret={paymentResult.clientSecret}
                    transactionId={paymentResult.transactionId}
                    onSuccess={() => {
                      toast.success("Payment successful!");
                      router.push(`/payment/success?order=${order.id}`);
                    }}
                  />
                </Elements>
              )}
            </div>
          )}
        </div>

        <div className="card panel">
          <h3 className="text-h3" style={{ marginBottom: 16 }}>
            Order summary
          </h3>
          {order.items.map((item) => (
            <div key={item.id} className="spec-row">
              <span>
                {item.gearItem.name} × {item.quantity}
              </span>
              <span style={{ fontWeight: 600 }}>{fmtCurrency(item.subtotal)}</span>
            </div>
          ))}
          <div className="spec-row">
            <span>Rental dates</span>
            <span style={{ fontWeight: 600 }}>
              {fmtDate(order.startDate)} – {fmtDate(order.endDate)}
            </span>
          </div>
          <div className="spec-row" style={{ borderBottom: "none" }}>
            <span style={{ fontWeight: 700, color: "var(--color-text)" }}>Total due</span>
            <span style={{ fontWeight: 700, fontSize: 18 }}>{fmtCurrency(order.totalAmount)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
