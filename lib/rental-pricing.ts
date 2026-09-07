export const SERVICE_FEE_RATE = 0.08;

export function rentalDays(startDate: string, endDate: string) {
  const start = new Date(`${startDate}T12:00:00`);
  const end = new Date(`${endDate}T12:00:00`);
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

export function rentalPricing(pricePerDay: number, startDate: string, endDate: string) {
  const days = rentalDays(startDate, endDate);
  const subtotal = days * pricePerDay;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
  return { days, subtotal, serviceFee, total: subtotal + serviceFee };
}
