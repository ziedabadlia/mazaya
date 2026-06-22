"use server";

import { db } from "@/lib/db";
import bcrypt from "bcrypt";
import { resetPasswordSchema } from "./_utils/validation";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string };

/**
 * Validates the reset token and overwrites the user's password.
 * Token lookup, expiry check, and password update all happen inside
 * one transaction so a token can never be partially consumed or reused.
 */
export async function resetPassword(
  token: string,
  formData: FormData,
): Promise<ActionResult> {
  if (!token) {
    return { success: false, message: "errors.reset_link_invalid" };
  }

  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { password } = parsed.data;

  try {
    await db.$transaction(async (tx) => {
      const verificationToken = await tx.verificationToken.findUnique({
        where: { token },
      });

      if (!verificationToken) {
        throw new Error("errors.reset_link_invalid");
      }

      if (verificationToken.expiresAt < new Date()) {
        throw new Error("errors.reset_link_expired");
      }

      const user = await tx.user.findUnique({
        where: { email: verificationToken.email },
      });

      if (!user) {
        throw new Error("errors.reset_link_invalid");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await tx.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await tx.verificationToken.delete({
        where: { id: verificationToken.id },
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "errors.unexpected";
    return { success: false, message };
  }

  return { success: true, message: "success.password_reset" };
}
