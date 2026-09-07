import { getCategories } from "@/service/gear/gearService";
import { getProviderGear, getProviderOrders } from "@/service/provider/providerService";
import type { Gear } from "@/types/gear";
import type { Rental } from "@/types/rental";

export async function getProviderDashboardData() {
  const [gearResponse, ordersResponse] = await Promise.all([getProviderGear(), getProviderOrders()]);
  if (!gearResponse.success || !ordersResponse.success) throw new Error("Provider data is unavailable.");
  return { gear: gearResponse.data ?? [], orders: ordersResponse.data ?? [] };
}

export async function getProviderFormOptions() {
  const response = await getCategories();
  return response.success ? response.data ?? [] : [];
}

export function gearForOrder(gear: Gear[], order: Rental) {
  return gear.find((item) => String(item.id) === String(order.gearId));
}
