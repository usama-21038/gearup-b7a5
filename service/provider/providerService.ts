import { apiRequest } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Gear } from "@/types/gear";
import type { Rental, RentalStatus } from "@/types/rental";

export function getProviderGear() {
  return apiRequest<ApiResponse<Gear[]>>("/api/provider/gear");
}

export function getProviderOrders() {
  return apiRequest<ApiResponse<Rental[]>>("/api/provider/orders");
}

export function updateProviderOrder(id: string | number, status: RentalStatus) {
  return apiRequest<ApiResponse<Rental>>(`/api/provider/orders/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}