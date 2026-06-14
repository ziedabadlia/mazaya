"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { initiateRegistration, confirmRegistration } from "../actions";
import { useTranslations } from "next-intl";

export type RegisterStep = "INFO" | "OTP";

export function useRegisterForm(locale: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<RegisterStep>("INFO");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const t = useTranslations("Auth");

  
  // Safely hold form properties locally across multi-step rendering phases
  const [savedFormData, setSavedFormData] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState<string>("");

  /**
   * Phase 1: Validates information data formats, updates token state registries, and emits email alerts.
   */
const handleInitiate = async (data: Record<string, string>) => {
  setError(null);
  setSuccessMessage(null);
  setUserEmail(data.email || "");
  setSavedFormData(data);

  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => formData.append(key, value));

  startTransition(async () => {
    try {
      const result = await initiateRegistration(formData);

      if (!result.success) {
        setError(t(result.message as any)); // <-- t() here
        return;
      }

      setSuccessMessage(t(result.message as any)); // <-- t() here
      if (result.step === "OTP") setStep("OTP");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    }
  });
};

  /**
   * Phase 2: Matches verification token credentials and builds system account nodes.
   */
  const handleVerify = async (otpCode: string) => {
  setError(null);
  setSuccessMessage(null);

  startTransition(async () => {
    try {
      const result = await confirmRegistration(userEmail, otpCode, savedFormData);

      if (!result.success) {
        setError(t(result.message as any)); // <-- t() here
        return;
      }

      setSuccessMessage(t(result.message as any)); // <-- t() here
      setTimeout(() => {
        router.refresh();
        router.push(`/${locale}/waiting-room`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    }
  });
};

  const setStepBack = () => {
    setError(null);
    setSuccessMessage(null);
    setStep("INFO");
  };

  return {
    step,
    isPending,
    error,
    successMessage,
    userEmail,
    handleInitiate,
    handleVerify,
    setStepBack,
  };
}