import { z } from "zod";

/**
 * Strict validation blueprint for user details phase.
 */
export const registrationInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  restaurantName: z.string().min(2, "Restaurant name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters long."),
});

export type RegistrationInfoInput = z.infer<typeof registrationInfoSchema>;