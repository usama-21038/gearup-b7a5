import { apiRequest } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Gear } from "@/types/gear";
import type { Rental } from "@/types/rental";
import type { User, UserStatus } from "@/types/user";

export function getAdminUsers() {
  return apiRequest<ApiResponse<User[]>>("/api/admin/users");
}

export function updateUserStatus(id: string | number, status: UserStatus) {
  return apiRequest<ApiResponse<User>>(`/api/admin/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function getAdminGear() {
  return apiRequest<ApiResponse<Gear[]>>("/api/admin/gear");
}

export function getAdminOrders() {
  return apiRequest<ApiResponse<Rental[]>>("/api/admin/orders");
}