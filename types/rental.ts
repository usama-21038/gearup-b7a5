export type RentalStatus =
  | "PLACED"
  | "CONFIRMED"
  | "PAID"
  | "PICKED_UP"
  | "RETURNED"
  | "CANCELLED";

export type Rental = {
  id: string | number;
  gearId: string | number;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: RentalStatus;
};

export type RentalPayload = {
  gearId: string | number;
  startDate: string;
  endDate: string;
};

export type ReviewPayload = {
  rentalId: string | number;
  rating: number;
  comment: string;
};