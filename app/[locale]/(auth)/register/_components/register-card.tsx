"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { InfoForm } from "./info-form";
import { OtpForm } from "./otp-form";
import { useRegisterForm } from "../hooks/use-register-form";
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button";
import { AuthCard } from "@/components/auth/auth-card";

interface RegisterCardProps {
  locale: string;
}

export function RegisterCard({ locale }: RegisterCardProps) {
  const t = useTranslations("Auth");
  const {
    step,
    email,
    error,
    successMessage,
    isPending,
    handleInitiate,
    handleVerify,
    goBack,
  } = useRegisterForm(locale);

  const isOtpStep = step === "OTP";

  return (
    <AuthCard
      locale={locale}
      title={isOtpStep ? t("verify_title") : t("register_title")}
      subtitle={isOtpStep ? t("2fa_desc") : t("register_subtitle")}
      error={error}
      successMessage={successMessage}
    >
      {/* Step View Switching Hub */}
      {isOtpStep ? (
        <OtpForm
          onVerify={handleVerify}
          onBack={goBack}
          isPending={isPending}
          email={email}
          locale={locale}
        />
      ) : (
        <>
          {/* Google OAuth */}
          <GoogleSignInButton locale={locale} />

          {/* Divider */}
          <div className='relative my-4 sm:my-5'>
            <div className='absolute inset-0 flex items-center'>
              <div className='w-full border-t border-gray-200' />
            </div>
            <div className='relative flex justify-center'>
              <span className='bg-white px-3 text-xs text-gray-400'>
                {t("or_continue_with_email")}
              </span>
            </div>
          </div>

          {/* Form */}
          <InfoForm
            onSubmit={handleInitiate}
            isPending={isPending}
            locale={locale}
          />

          {/* Login link */}
          <p className='mt-4 sm:mt-5 text-center text-sm text-gray-500'>
            {t("have_account")}{" "}
            <Link
              href={`/${locale}/login`}
              className='text-[#22c55e] font-medium hover:underline'
            >
              {t("login")}
            </Link>
          </p>

          {/* Step indicator */}
          <div className='mt-4 flex items-center justify-center gap-1.5'>
            <span className='h-1.5 w-4 rounded-full bg-[#22c55e]' />
            <span className='h-1.5 w-1.5 rounded-full bg-gray-200' />
          </div>
        </>
      )}
    </AuthCard>
  );
}
