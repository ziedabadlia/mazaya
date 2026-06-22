import { z } from "zod";

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "errors.password_min"),
    confirmPassword: z.string().min(8, "errors.password_min"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "errors.passwords_no_match",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
