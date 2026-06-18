"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { ForgotPasswordForm } from "./forgot-password-form";
import { useForgotPasswordForm } from "../hooks/use-forgot-password-form";

interface ForgotPasswordCardProps {
  locale: string;
}

export function ForgotPasswordCard({ locale }: ForgotPasswordCardProps) {
  const t = useTranslations("Auth");
  const { handleRequest, isPending, error, successMessage } =
    useForgotPasswordForm(locale);

  return (
    <div
      className='w-full max-w-[400px] p-5 sm:p-6 md:p-10 max-h-full overflow-y-auto'
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Logo */}
      <div className='flex justify-center mb-4 sm:mb-6'>
        <Image
          src='/logo.svg'
          alt='Mazaya'
          width={72}
          height={36}
          className='object-contain w-16 sm:w-20 h-auto'
          priority
        />
      </div>

      {/* Heading */}
      <div className='mb-4 sm:mb-6 text-center'>
        <h1 className='text-lg sm:text-[22px] font-bold text-gray-900 leading-tight mb-1'>
          {t("forgot_password_title")}
        </h1>
        <p className='text-sm text-gray-500'>
          {t("forgot_password_subtitle")}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className='mb-3 sm:mb-4 px-4 py-2.5 sm:py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center'>
          {error}
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className='mb-3 sm:mb-4 px-4 py-2.5 sm:py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center'>
          {successMessage}
        </div>
      )}

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
    </div>
  );
}
