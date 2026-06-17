import { z } from "zod";

/**
 * Registration info schema — name, email, password only.
 * Restaurant/tenant details are collected post-signup.
 * Error messages are translation keys resolved via next-intl in the UI.
 */
export const registrationInfoSchema = z.object({
  name: z.string().min(2, "errors.name_min"),
  email: z.string().email("errors.email_invalid"),
  password: z.string().min(8, "errors.password_min"),
});

export type RegistrationInfoInput = z.infer<typeof registrationInfoSchema>;

/**
 * OTP verification schema.
 */
export const otpSchema = z.object({
  code: z
    .string()
    .length(6, "errors.otp_length")
    .regex(/^\d+$/, "errors.otp_digits_only"),
});

export type OtpInput = z.infer<typeof otpSchema>;
