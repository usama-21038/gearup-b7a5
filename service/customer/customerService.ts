import { getGear } from "@/service/gear/gearService";
import { getPaymentHistory } from "@/service/payment/paymentService";
import { getRentals } from "@/service/rental/rentalService";
import type { Gear } from "@/types/gear";
import type { Payment } from "@/types/payment";
import type { Rental } from "@/types/rental";

export type CustomerDashboardData = {
  rentals: Rental[];
  payments: Payment[];
  gear: Gear[];
};

export async function getCustomerDashboardData(): Promise<CustomerDashboardData> {
  const [rentalsResponse, paymentsResponse, gearResponse] = await Promise.all([getRentals(), getPaymentHistory(), getGear()]);
  if (!rentalsResponse.success || !paymentsResponse.success) throw new Error("Customer dashboard data is unavailable.");
  return {
    rentals: rentalsResponse.data ?? [],
    payments: paymentsResponse.data ?? [],
    gear: gearResponse.success ? gearResponse.data ?? [] : [],
  };
}

export function gearForRental(gear: Gear[], rental: Rental) {
  return gear.find((item) => String(item.id) === String(rental.gearId));
}
