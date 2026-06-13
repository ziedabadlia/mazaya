"use server";

import { db } from "@/lib/db";
import { generateVerificationCode, slugify } from "@/lib/utils"; // 1. Import slugify
import bcrypt from "bcrypt";

export type ActionResponse = {
  success: boolean;
  message: string;
  step?: "OTP" | "COMPLETE";
};

/**
 * Phase 1: Validate input, create pending Tenant/User with slug, and save token.
 */
export async function initiateRegistration(formData: FormData): Promise<ActionResponse> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const restaurantName = formData.get("restaurantName") as string;

  if (!email || !password || !name || !restaurantName) {
    return { success: false, message: "Missing required fields." };
  }

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return { success: false, message: "Email is already registered." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateVerificationCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Generate a unique fallback string identifier for the tenant slug boundary
    const tenantSlug = `${slugify(restaurantName)}-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.$transaction(async (tx) => {
      const newTenant = await tx.tenant.create({
        data: {
          name: restaurantName,
          slug: tenantSlug, // 2. Fulfill the missing required slug field here!
          status: "PENDING",
        }
      });

      await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: "OWNER",
          tenantId: newTenant.id,
        }
      });

      await tx.verificationToken.upsert({
        where: { token: email }, 
        update: {
          email,
          token: otpCode,
          expiresAt,
        },
        create: {
          email,
          token: otpCode,
          expiresAt,
        },
      });
    });

    console.log(`[2FA DEBUG] Verification token code ${otpCode} generated for ${email}`);

    return { 
      success: true, 
      message: "Verification code sent to your email.",
      step: "OTP" 
    };

  } catch (error) {
    console.error("Registration initiation error:", error);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Phase 2: Confirm 2FA code matches what is inside the token parameter.
 */
export async function confirmRegistration(email: string, submittedCode: string): Promise<ActionResponse> {
  if (!email || !submittedCode) {
    return { success: false, message: "Invalid confirmation parameters." };
  }

  try {
    // 1. Locate token by email or token index depending on schema configuration
    const record = await db.verificationToken.findFirst({
      where: { 
        email,
        token: submittedCode 
      }
    });

    if (!record) {
      return { success: false, message: "Invalid or incorrect verification code." };
    }

    if (new Date() > record.expiresAt) {
      return { success: false, message: "Verification code has expired. Please request a new one." };
    }

    // 2. Clean up token record since validation succeeded
    await db.verificationToken.delete({
      where: { id: record.id }
    });

    return { 
      success: true, 
      message: "Email verified successfully! Your account is now being reviewed by admin.",
      step: "COMPLETE"
    };

  } catch (error) {
    console.error("Registration confirmation error:", error);
    return { success: false, message: "Failed to finalize account configuration." };
  }
}