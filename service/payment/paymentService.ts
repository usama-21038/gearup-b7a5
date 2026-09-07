import { apiRequest } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { CheckoutResponse, Payment } from "@/types/payment";

export function getPaymentHistory() {
  return apiRequest<ApiResponse<Payment[]>>("/api/payments");
}

export function createCheckout(rentalId: string | number) {
  return apiRequest<CheckoutResponse>("/api/payments/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rentalId }),
  });
}