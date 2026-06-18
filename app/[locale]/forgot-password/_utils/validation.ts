import { z } from "zod";

/**
 * Forgot-password request schema — just the email to send a reset code to.
 * Error messages are translation keys resolved via next-intl in the UI.
 */
export const forgotPasswordSchema = z.object({
  email: z.string().email("errors.email_invalid"),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
