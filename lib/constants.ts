export const API_BASE_URL = process.env.BACKEND_API_URL ?? "";

export const APP_ROUTES = {
	home: "/",
	gear: "/gear",
	login: "/login",
	register: "/register",
	customer: "/customer",
	provider: "/provider",
	admin: "/admin",
	paymentSuccess: "/payment/success",
	paymentCancel: "/payment/cancel",
} as const;

export const RENTAL_STATUSES = [
	"PLACED",
	"CONFIRMED",
	"PAID",
	"PICKED_UP",
	"RETURNED",
	"CANCELLED",
] as const;