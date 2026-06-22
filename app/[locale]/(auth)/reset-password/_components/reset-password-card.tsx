"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ResetPasswordForm } from "./reset-password-form";
import { useResetPasswordForm } from "../hooks/use-reset-password-form";
import { AuthCard } from "@/components/auth/auth-card";

interface ResetPasswordCardProps {
  locale: string;
  token: string | null;
}

export function ResetPasswordCard({ locale, token }: ResetPasswordCardProps) {
  const t = useTranslations("Auth");
  const { isPending, error, successMessage, handleReset } =
    useResetPasswordForm(locale, token ?? "");

  // No token in the URL at all — nothing to recover, send the user back.
  if (!token) {
    return (
      <AuthCard
        locale={locale}
        title={t("reset_password_title")}
        error={t("errors.reset_link_invalid")}
      >
        <p className='text-center text-sm text-gray-500'>
          <Link
            href={`/${locale}/forgot-password`}
            className='text-[#22c55e] font-medium hover:underline'
          >
            {t("request_new_link")}
          </Link>
        </p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      locale={locale}
      title={t("reset_password_title")}
      error={error}
      successMessage={successMessage}
    >
      <ResetPasswordForm
        onSubmit={handleReset}
        isPending={isPending}
        locale={locale}
      />

      <p className='mt-4 sm:mt-5 text-center text-sm text-gray-500'>
        <Link
          href={`/${locale}/login`}
          className='text-[#22c55e] font-medium hover:underline'
        >
          {t("back_to_login")}
        </Link>
      </p>
    </AuthCard>
  );
}
