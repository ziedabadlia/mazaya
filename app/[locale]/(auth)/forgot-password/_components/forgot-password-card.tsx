"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { ForgotPasswordForm } from "./forgot-password-form";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";
import { AuthCard } from "@/components/auth/auth-card";

interface ForgotPasswordCardProps {
  locale: string;
}

export function ForgotPasswordCard({ locale }: ForgotPasswordCardProps) {
  const t = useTranslations("Auth");
  const { isPending, error, successMessage, handleRequest } =
    useForgotPasswordForm(locale);

  return (
    <AuthCard
      locale={locale}
      title={t("forgot_password_title")}
      subtitle={t("forgot_password_subtitle")}
      error={error}
      successMessage={successMessage}
    >
      {/* Form */}
      <ForgotPasswordForm
        onSubmit={handleRequest}
        isPending={isPending}
        locale={locale}
      />

      {/* Back to login link */}
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
