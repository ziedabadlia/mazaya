"use server";

import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { slugify, generateVerificationCode } from "@/lib/utils";
import { registrationInfoSchema, otpSchema } from "./_utils/validation";

// ── Types ──

export type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string };

// ── Mailer ──

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// ── Stage 1: Initiate registration — validate, send OTP ──

export async function initiateRegistration(
  formData: FormData,
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

  // Check for duplicate email
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return { success: false, message: "errors.email_taken" };
  }

  // Generate and store OTP
  const code = generateVerificationCode();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await db.verificationToken.upsert({
    where: { email_token: { email, token: code } },
    update: { token: code, expiresAt },
    create: { id: crypto.randomUUID(), email, token: code, expiresAt },
  });

  // Send OTP email
  await transporter.sendMail({
    from: `"Mazaya" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Your Mazaya verification code",
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto">
        <h2>مرحباً ${name}</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing:8px;color:#22c55e">${code}</h1>
        <p>This code expires in 15 minutes.</p>
      </div>
    `,
  });

  return { success: true, message: "success.code_sent" };
}

// ── Stage 2: Confirm OTP — create Tenant + User atomically ──

export async function confirmRegistration(
  email: string,
  otpCode: string,
  rawFormData: FormData,
): Promise<ActionResult> {
  // Validate OTP format
  const otpParsed = otpSchema.safeParse({ code: otpCode });
  if (!otpParsed.success) {
    return { success: false, message: otpParsed.error.issues[0].message };
  }

  // Re-validate form data for security
  const infoParsed = registrationInfoSchema.safeParse({
    name: rawFormData.get("name"),
    email: rawFormData.get("email"),
    password: rawFormData.get("password"),
  });
  if (!infoParsed.success) {
    return { success: false, message: infoParsed.error.issues[0].message };
  }

  const { name, password } = infoParsed.data;

  // Find and validate the token
  const token = await db.verificationToken.findFirst({
    where: { email, token: otpCode },
  });

  if (!token) {
    return { success: false, message: "errors.otp_invalid" };
  }

  if (token.expiresAt < new Date()) {
    return { success: false, message: "errors.otp_expired" };
  }

  // Generate unique slug from user name
  const baseSlug = slugify(name);
  const existingTenant = await db.tenant.findUnique({
    where: { slug: baseSlug },
  });
  const slug = existingTenant ? `${baseSlug}-${Date.now()}` : baseSlug;

  const hashedPassword = await bcrypt.hash(password, 12);

  // Create Tenant + User atomically
  await db.$transaction(async (tx) => {
    const tenant = await tx.tenant.create({
      data: {
        name,
        slug,
        status: "PENDING",
      },
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

    // Purge the used token
    await tx.verificationToken.delete({ where: { id: token.id } });
  });

  return { success: true, message: "success.account_created" };
}
