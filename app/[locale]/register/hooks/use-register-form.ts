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
  const [userEmail, setUserEmail] = useState<string>("");

  /**
   * Phase 1: Submits info to server action, updates verification tokens, sends Gmail SMTP message.
   */
  const handleInitiate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData(event.currentTarget);
    const emailValue = formData.get("email") as string;
    setUserEmail(emailValue);

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
        setError("An unexpected system error occurred. Please try again.");
      }
    });
  };

  /**
   * Phase 2: Verifies 6-digit pin code and completes account configuration.
   */
  const handleVerify = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      setError("Please enter a valid 6-digit confirmation code.");
      return;
    }

    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const result = await confirmRegistration(userEmail, otpCode);

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
        setError("Verification matching run failed.");
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