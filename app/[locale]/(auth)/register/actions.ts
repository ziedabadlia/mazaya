"use server";

import { db } from "@/lib/db";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { slugify, generateVerificationCode } from "@/lib/utils";
import { registrationInfoSchema, otpSchema } from "./_utils/validation";
import { sendVerificationEmail } from "@/lib/mail";

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string };

export async function initiateRegistration(
  formData: FormData,
  locale: string,
): Promise<ActionResult> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const parsed = registrationInfoSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const { email, name } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, message: "errors.email_taken" };
  }

  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await db.verificationToken.upsert({
    where: { email_token: { email, token: code } },
    update: { token: code, expiresAt },
    create: { id: crypto.randomUUID(), email, token: code, expiresAt },
  });

  await sendVerificationEmail({
    to: email,
    code,
    restaurantName: name,
    locale,
  });

  return { success: true, message: "success.code_sent" };
}

export async function confirmRegistration(
  email: string,
  otpCode: string,
  rawFormData: FormData,
): Promise<ActionResult> {
  const otpParsed = otpSchema.safeParse({ code: otpCode });
  if (!otpParsed.success) {
    return { success: false, message: otpParsed.error.issues[0].message };
  }

  const infoParsed = registrationInfoSchema.safeParse({
    name: rawFormData.get("name"),
    email: rawFormData.get("email"),
    password: rawFormData.get("password"),
  });
  if (!infoParsed.success) {
    return { success: false, message: infoParsed.error.issues[0].message };
  }

  const { name, password } = infoParsed.data;

  const token = await db.verificationToken.findFirst({
    where: { email, token: otpCode },
  });

  if (!token) return { success: false, message: "errors.otp_invalid" };
  if (token.expiresAt < new Date())
    return { success: false, message: "errors.otp_expired" };

  const baseSlug = slugify(name);
  const existingTenant = await db.tenant.findUnique({
    where: { slug: baseSlug },
  });
  const slug = existingTenant ? `${baseSlug}-${Date.now()}` : baseSlug;

  const hashedPassword = await bcrypt.hash(password, 12);

  await db.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: { name, slug, status: "PENDING" },
    });

    await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        emailVerified: new Date(),
        role: "OWNER",
        tenantId: tenant.id,
      },
    });

    await tx.verificationToken.delete({ where: { id: token.id } });
  });

  return { success: true, message: "success.account_created" };
}
