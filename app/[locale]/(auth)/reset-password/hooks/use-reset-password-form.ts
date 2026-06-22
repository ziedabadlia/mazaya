"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { resetPassword } from "../actions";

interface ResetPasswordFormState {
  error: string | null;
  successMessage: string | null;
  isPending: boolean;
}

export function useResetPasswordForm(locale: string, token: string) {
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

  const handleReset = (data: Record<string, string>) => {
    setError(null);
    setSuccessMessage(null);

    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));

    startTransition(async () => {
      const result = await resetPassword(token, formData);

      if (!result.success) {
        setError(resolveMessage(result.message));
        return;
      }

      setSuccessMessage(resolveMessage(result.message));
      router.push(`/${locale}/login`);
    });
  };

  return {
    error,
    successMessage,
    isPending,
    handleReset,
  } satisfies ResetPasswordFormState & {
    handleReset: (data: Record<string, string>) => void;
  };
}
