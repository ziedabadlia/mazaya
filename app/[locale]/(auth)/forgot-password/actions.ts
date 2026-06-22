"use server";

import { db } from "@/lib/db";
import crypto from "crypto";
import { generateSecureToken } from "@/lib/utils";
import { forgotPasswordSchema } from "./_utils/validation";
import { sendPasswordResetEmail } from "@/lib/mail";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function requestPasswordReset(
  formData: FormData,
  locale: string,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  if (user && user.password) {
    await db.verificationToken.deleteMany({ where: { email } });

    const token = generateSecureToken();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await db.verificationToken.create({
      data: { id: crypto.randomUUID(), email, token, expiresAt },
    });

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? "https://mazaya-five.vercel.app";
    const resetLink = `${baseUrl}/${locale}/reset-password?token=${token}`;

    await sendPasswordResetEmail({
      to: email,
      name: user.name,
      resetLink,
      locale,
    });
  }

  return { success: true, message: "success.reset_link_sent" };
}
