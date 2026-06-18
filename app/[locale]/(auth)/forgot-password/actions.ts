"use server";

import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { generateVerificationCode } from "@/lib/utils";
import { forgotPasswordSchema } from "./_utils/validation";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string };

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

/**
 * Stage 1 — validate email, generate + email a reset code.
 *
 * Always returns success (even if the email isn't registered, or belongs
 * to a Google-only account with no password) to avoid leaking which
 * emails have accounts. The email is only actually sent when a
 * password-having user exists for that address.
 */
export async function requestPasswordReset(
  formData: FormData,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { email } = parsed.data;

  const user = await db.user.findUnique({ where: { email } });

  // Only send a code if a password-based account exists for this email.
  // Google-only accounts (user.password === null) have nothing to reset.
  if (user && user.password) {
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await db.verificationToken.upsert({
      where: { email_token: { email, token: code } },
      update: { token: code, expiresAt },
      create: { id: crypto.randomUUID(), email, token: code, expiresAt },
    });

    await transporter.sendMail({
      from: `"Mazaya" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your Mazaya password reset code",
      html: `
        <div style="font-family:sans-serif;max-width:400px;margin:auto">
          <h2>مرحباً ${user.name}</h2>
          <p>Your password reset code is:</p>
          <h1 style="letter-spacing:8px;color:#22c55e">${code}</h1>
          <p>This code expires in 15 minutes. If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });
  }

  // Same response regardless of whether the email exists or has a password —
  // prevents account enumeration via response timing/content differences.
  return { success: true, message: "success.reset_code_sent" };
}
