"use server";

import { db } from "@/lib/db";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcrypt";
import { registrationInfoSchema } from "./_utils/validation";

// Global reusable nodemailer transport using your verified Gmail configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Stage 1 Action: Validates form input data, saves a verification token code.
 */
export async function initiateRegistration(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const validationResult = registrationInfoSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.error.issues[0].message, // Type-safe Zod accessor
      };
    }

    const { email } = validationResult.data;

    // Check if the user email is already taken in the database
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "This email address is already registered." };
    }

    // Generate secure 6-digit confirmation token pin
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 Minute life span

    // Persist code inside your explicit VerificationToken table model
    await db.verificationToken.upsert({
      where: { token: verificationCode },
      update: {
        email,
        expiresAt: tokenExpiry,
      },
      create: {
        email,
        token: verificationCode,
        expiresAt: tokenExpiry,
      },
    });

    // Dispatch message via Gmail SMTP engine securely
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: "Mazaya - Verify Your Registration Token",
      text: `Your confirmation code is: ${verificationCode}`,
      html: `
        <div style="font-family: sans-serif; padding: 24px; max-width: 480px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 16px;">
          <h2 style="color: #ea580c; font-weight: 900; text-align: center;">مزايا</h2>
          <p style="font-size: 14px; color: #4b5563;">Thank you for signing up. Use the verification token code below to complete your restaurant account activation:</p>
          <div style="background: #f9fafb; padding: 16px; text-align: center; font-size: 26px; font-weight: bold; letter-spacing: 4px; color: #111827; border-radius: 12px; margin: 20px 0; border: 1px solid #f3f4f6;">
            ${verificationCode}
          </div>
          <p style="font-size: 11px; color: #9ca3af; text-align: center;">This security code expires in 15 minutes.</p>
        </div>
      `,
    });

    return { success: true, step: "OTP", message: "Verification code sent to your email." };
  } catch (error) {
    console.error("Registration Initiation Failure:", error);
    const errorMessage = error instanceof Error ? error.message : "System failure during email transmission.";
    return { success: false, message: errorMessage };
  }
}

/**
 * Stage 2 Action: Matches verification token and writes the unified Tenant + User records down.
 */
export async function confirmRegistration(email: string, code: string, rawFormData: unknown) {
  try {
    // 1. Locate and validate the token code
    const tokenRecord = await db.verificationToken.findUnique({ where: { token: code } });

    if (!tokenRecord || tokenRecord.email !== email || new Date() > tokenRecord.expiresAt) {
      return { success: false, message: "Invalid or expired verification code." };
    }

    // 2. Reparse form data to ensure absolute data validity prior to database commit
    const validationResult = registrationInfoSchema.safeParse(rawFormData);
    if (!validationResult.success) {
      return { success: false, message: "Invalid registration state data payload." };
    }

    const { name, restaurantName, password } = validationResult.data;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Auto slugify restaurant string name
    const tenantSlug = restaurantName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    // 3. Complete database entries atomically inside a clean Prisma isolation transaction
    await db.$transaction(async (tx) => {
      // Create the Tenant workspace matching your custom schema status defaults
      const tenant = await tx.tenant.create({
        data: {
          name: restaurantName,
          slug: tenantSlug,
          status: "PENDING", // Matches TenantStatus enum
        },
      });

      // Create the core User profile matching your exact field structures
      await tx.user.create({
        data: {
          email,
          name,
          password: hashedPassword, // Matches your schema's "password" property
          role: "OWNER",           // Matches UserRole enum
          tenantId: tenant.id,     // Satisfies strict non-nullable relation constraint
        },
      });

      // Purge the used verification token cleanly
      await tx.verificationToken.delete({ where: { token: code } });
    });

    return { success: true, message: "Account setup complete!" };
  } catch (error) {
    console.error("Registration Finalization Failure:", error);
    const errorMessage = error instanceof Error ? error.message : "Database transaction commitment failed.";
    return { success: false, message: errorMessage };
  }
}