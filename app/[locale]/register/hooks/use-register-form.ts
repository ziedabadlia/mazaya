"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { initiateRegistration, confirmRegistration } from "../actions";

export type RegisterStep = "INFO" | "OTP";

export function useRegisterForm(locale: string) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState<RegisterStep>("INFO");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Safely hold form properties locally across multi-step rendering phases
  const [savedFormData, setSavedFormData] = useState<Record<string, string>>({});
  const [userEmail, setUserEmail] = useState<string>("");

  /**
   * Phase 1: Validates information data formats, updates token state registries, and emits email alerts.
   */
  const handleInitiate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const formFields: Record<string, string> = {};
    formData.forEach((value, key) => {
      formFields[key] = value.toString();
    });

    setUserEmail(formFields.email || "");
    setSavedFormData(formFields);

    startTransition(async () => {
      try {
        const result = await initiateRegistration(formData);

        if (!result.success) {
          setError(result.message);
          return;
        }

        setSuccessMessage(result.message);
        if (result.step === "OTP") {
          setStep("OTP");
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unexpected system error occurred. Please try again.";
        setError(errorMessage);
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
          setError(result.message);
          return;
        }

        setSuccessMessage(result.message);
        
        setTimeout(() => {
          router.refresh();
          router.push(`/${locale}/waiting-room`);
        }, 1500);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Verification token matching run failed.";
        setError(errorMessage);
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