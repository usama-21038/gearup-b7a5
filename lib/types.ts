export type Role = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type GearStatus = "ACTIVE" | "INACTIVE";
export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";
export type PaymentMethod = "STRIPE" | "SSLCOMMERZ";
export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED";

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

export interface GearItem {
  id: string;
  name: string;
  description?: string | null;
  brand?: string | null;
  images: string[];
  pricePerDay: string;
  totalQuantity: number;
  availableQuantity: number;
  status: GearStatus;
  createdAt: string;
  updatedAt: string;
  providerId: string;
  provider?: Pick<User, "id" | "name" | "email" | "phone">;
  categoryId: string;
  category?: Category;
  reviews?: Review[];
}

export interface Review {
  id: string;
  customerId: string;
  customer?: Pick<User, "id" | "name">;
  gearItemId: string;
  rating: number;
  comment?: string | null;
  createdAt: string;
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

export interface RentalOrder {
  id: string;
  customerId: string;
  customer?: Pick<User, "id" | "name" | "email" | "phone">;
  status: RentalStatus;
  startDate: string;
  endDate: string;
  totalAmount: string;
  notes?: string | null;
  items: RentalOrderItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
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

export interface ApiFailure {
  success: false;
  message: string;
  details?: unknown;
}

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export interface JwtSession {
  id: string;
  email: string;
  role: Role;
  iat?: number;
  exp?: number;
}
