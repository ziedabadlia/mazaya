"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { requestPasswordReset } from "../actions";

interface ForgotPasswordFormState {
  error: string | null;
  successMessage: string | null;
  isPending: boolean;
}

export function useForgotPasswordForm(locale: string) {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [isPending, startTransition] = useTransition();

  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resolveMessage = (key: string): string => {
    try {
      return t(key as Parameters<typeof t>[0]);
    } catch {
      return key;
    }
  };

  const handleRequest = (data: Record<string, string>) => {
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));

    startTransition(async () => {
      const result = await requestPasswordReset(formData);

      if (!result.success) {
        setError(resolveMessage(result.message));
        return;
      }

      setSuccessMessage(resolveMessage(result.message));
      router.push(
        `/${locale}/reset-password?email=${encodeURIComponent(data.email)}`,
      );
    });
  };

  return {
    error,
    successMessage,
    isPending,
    handleRequest,
  } satisfies ForgotPasswordFormState & {
    handleRequest: (data: Record<string, string>) => void;
  };
}
