// Types mirroring the GearUp backend (Prisma models + ApiResponse envelope).
// Backend repo: https://github.com/usama-21038/gearup-b7a4
//
// NOTE: Prisma `Decimal` fields (pricePerDay, totalAmount, subtotal, amount)
// are serialized by Express/Prisma as strings in JSON (e.g. "35.00") to avoid
// floating point precision loss. Use `toNumber()` from lib/utils.ts whenever
// you need to do arithmetic or formatting on these fields.

export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type GearStatus = "ACTIVE" | "INACTIVE";
export type RentalStatus = "PLACED" | "CONFIRMED" | "PAID" | "PICKED_UP" | "RETURNED" | "CANCELLED";
export type PaymentMethod = "STRIPE" | "SSLCOMMERZ";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

export interface ApiSuccess<T> {
  success: true;
  message: string;
  data: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiErrorBody {
  success: false;
  message: string;
  details?: Array<{ path: string; message: string }> | unknown;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GearProvider {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
}

export interface GearReview {
  id: string;
  customerId: string;
  gearItemId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
  customer: { id: string; name: string };
}

export interface GearItem {
  id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  images: string[];
  pricePerDay: string; // Decimal -> string
  totalQuantity: number;
  availableQuantity: number;
  status: GearStatus;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  provider: GearProvider;
  categoryId: string;
  category: Category;
  reviews?: GearReview[];
}

export interface RentalOrderItem {
  id: string;
  rentalOrderId: string;
  gearItemId: string;
  gearItem: GearItem;
  quantity: number;
  pricePerDay: string;
  subtotal: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  rentalOrderId: string;
  rentalOrder?: RentalOrder;
  amount: string;
  method: PaymentMethod;
  provider?: string | null;
  status: PaymentStatus;
  paidAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RentalOrder {
  id: string;
  customerId: string;
  customer: { id: string; name: string; email: string; phone?: string | null };
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalAmount: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  items: RentalOrderItem[];
  payments: Payment[];
}

export interface AuthResult {
  user: User;
  token: string;
}

export interface CreatePaymentStripeResult {
  paymentId: string;
  transactionId: string;
  method: "STRIPE";
  clientSecret: string;
  stripePaymentIntentId: string;
}

export interface CreatePaymentSslcommerzResult {
  paymentId: string;
  transactionId: string;
  method: "SSLCOMMERZ";
  gatewayPageURL: string;
}

export type CreatePaymentResult = CreatePaymentStripeResult | CreatePaymentSslcommerzResult;
