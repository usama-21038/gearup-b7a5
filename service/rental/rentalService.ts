import { apiRequest } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Rental, RentalPayload, ReviewPayload } from "@/types/rental";

export function getRentals() {
  return apiRequest<ApiResponse<Rental[]>>("/api/rentals");
}

export function getRentalById(id: string | number) {
  return apiRequest<ApiResponse<Rental>>(`/api/rentals/${id}`);
}

export function createRental(payload: RentalPayload) {
  return apiRequest<ApiResponse<Rental>>("/api/rentals", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function submitReview(payload: ReviewPayload) {
  return apiRequest<ApiResponse<null>>("/api/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}