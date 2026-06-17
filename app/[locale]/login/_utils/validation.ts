import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("errors.email_invalid"),
  password: z.string().min(1, "errors.password_required"),
});

export type LoginInput = z.infer<typeof loginSchema>;