import { z } from "zod";

/**
 * Strict validation blueprint for user details phase.
 * Error messages are translation keys (resolved via next-intl in the UI),
 * not hardcoded strings — this keeps validation locale-agnostic.
 */
export const registrationInfoSchema = z.object({
  name: z.string().min(2, "errors.name_min"),
  restaurantName: z.string().min(2, "errors.restaurant_name_min"),
  email: z.string().email("errors.email_invalid"),
  password: z.string().min(8, "errors.password_min"),
});

export type RegistrationInfoInput = z.infer<typeof registrationInfoSchema>;

/**
 * Validation blueprint for the OTP verification phase.
 */
export const otpSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, "errors.otp_length")
    .regex(/^\d{6}$/, "errors.otp_digits_only"),
});

export type OtpInput = z.infer<typeof otpSchema>;