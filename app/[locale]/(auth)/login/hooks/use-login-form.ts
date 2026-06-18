"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";

export function useLoginForm(locale: string) {
  const router = useRouter();
  const t = useTranslations("Auth");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (data: Record<string, string>) => {
    setError(null);

    startTransition(async () => {
      try {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: false,
        });

        if (result?.error) {
          setError(t("errors.invalid_credentials" as any));
          return;
        }

        // Let the middleware handle where to redirect based on tenant status
        router.refresh();
        router.push(`/${locale}/dashboard`);
      } catch (err) {
        setError(t("errors.unexpected" as any));
      }
    });
  };

  return {
    isPending,
    error,
    handleLogin,
  };
}