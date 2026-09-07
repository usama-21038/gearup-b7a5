import { apiRequest, queryString } from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { Gear, GearFilters, GearPayload } from "@/types/gear";

export function getGear(filters: GearFilters = {}) {
  return apiRequest<ApiResponse<Gear[]>>(`/api/gear${queryString(filters)}`);
}

export function getGearById(id: string | number) {
  return apiRequest<ApiResponse<Gear>>(`/api/gear/${id}`);
}

export function getCategories() {
  return apiRequest<ApiResponse<string[]>>("/api/categories");
}

export function createGear(payload: GearPayload) {
  return apiRequest<ApiResponse<Gear>>("/api/provider/gear", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function updateGear(id: string | number, payload: Partial<GearPayload>) {
  return apiRequest<ApiResponse<Gear>>(`/api/provider/gear/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export function deleteGear(id: string | number) {
  return apiRequest<ApiResponse<null>>(`/api/provider/gear/${id}`, {
    method: "DELETE",
  });
}