export type PaymentStatus = "PENDING" | "PAID" | "CANCELLED" | "FAILED";

export type Payment = {
  id: string | number;
  rentalId: string | number;
  amount: number;
  status: PaymentStatus;
  createdAt?: string;
};

export type CheckoutResponse = {
  success: boolean;
  message?: string;
  data?: {
    checkoutUrl?: string;
    sessionId?: string;
  };
};