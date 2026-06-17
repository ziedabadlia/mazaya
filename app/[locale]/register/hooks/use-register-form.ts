"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { initiateRegistration, confirmRegistration } from "../actions";

export type RegisterStep = "INFO" | "OTP";

interface RegisterFormState {
  step: RegisterStep;
  email: string;
  error: string | null;
  successMessage: string | null;
  isPending: boolean;
}

export function useRegisterForm(locale: string) {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [isPending, startTransition] = useTransition();

  const [step, setStep] = useState<RegisterStep>("INFO");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hold the original FormData across steps for re-validation in stage 2
  const formDataRef = useRef<FormData | null>(null);

  const resolveMessage = (key: string): string => {
    try {
      return t(key as Parameters<typeof t>[0]);
    } catch {
      return key;
    }
  };

  /**
   * Phase 1 — Validate info, send OTP, advance to OTP step.
   */
  const handleInitiate = (data: Record<string, string>) => {
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    formDataRef.current = formData;

    startTransition(async () => {
      const result = await initiateRegistration(formData);

      if (!result.success) {
        setError(resolveMessage(result.message));
        return;
      }

      setEmail(data.email);
      setSuccessMessage(resolveMessage(result.message));
      setStep("OTP");
    });
  };

  /**
   * Phase 2 — Verify OTP, create account, redirect to waiting room.
   */
  const handleVerify = (otpCode: string) => {
    setError(null);
    setSuccessMessage(null);

    if (!formDataRef.current) {
      setError(resolveMessage("errors.unexpected"));
      return;
    }

    const savedFormData = formDataRef.current;

    startTransition(async () => {
      const result = await confirmRegistration(email, otpCode, savedFormData);

      if (!result.success) {
        setError(resolveMessage(result.message));
        return;
      }

      router.push(`/${locale}/waiting-room`);
    });
  };

  const goBack = () => {
    setStep("INFO");
    setError(null);
    setSuccessMessage(null);
  };

  return {
    step,
    email,
    error,
    successMessage,
    isPending,
    handleInitiate,
    handleVerify,
    goBack,
  } satisfies RegisterFormState & {
    handleInitiate: (data: Record<string, string>) => void;
    handleVerify: (otpCode: string) => void;
    goBack: () => void;
  };
}
