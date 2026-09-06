import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional().or(z.literal("")),
  role: z.enum(["CUSTOMER", "PROVIDER"]),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const gearSchema = z.object({
  name: z.string().min(2, "Gear name must be at least 2 characters"),
  description: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  images: z
    .array(z.string().url("Each image must be a valid URL"))
    .max(6, "Up to 6 images"),
  pricePerDay: z.coerce.number().positive("Price per day must be positive"),
  totalQuantity: z.coerce
    .number()
    .int("Must be a whole number")
    .positive("Total quantity must be a positive integer"),
  categoryId: z.string().uuid("Choose a category"),
});
export type GearInput = z.infer<typeof gearSchema>;

export const updateGearSchema = gearSchema.partial().extend({
  availableQuantity: z.coerce.number().int().min(0).optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});
export type UpdateGearInput = z.infer<typeof updateGearSchema>;

export const rentalItemSchema = z.object({
  gearItemId: z.string().uuid(),
  quantity: z.coerce.number().int().positive(),
});

export const createRentalSchema = z
  .object({
    startDate: z.string().min(1, "Pick a start date"),
    endDate: z.string().min(1, "Pick an end date"),
    notes: z.string().optional().or(z.literal("")),
    items: z.array(rentalItemSchema).min(1, "Add at least one item"),
  })
  .refine((data) => new Date(data.endDate) > new Date(data.startDate), {
    message: "Return date must be after the start date",
    path: ["endDate"],
  });
export type CreateRentalInput = z.infer<typeof createRentalSchema>;

export const reviewSchema = z.object({
  gearItemId: z.string().uuid(),
  rating: z.coerce.number().int().min(1, "Pick a rating").max(5, "Rating is 1 to 5"),
  comment: z.string().max(1000).optional().or(z.literal("")),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional().or(z.literal("")),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const orderStatusSchema = z.object({
  status: z.enum(["CONFIRMED", "PICKED_UP", "RETURNED", "CANCELLED"]),
});

export const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "SUSPENDED"]),
});

/** Flattens a Zod error into a `{ field: message }` map for inline form errors. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".") || "form";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
