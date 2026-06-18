"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { InfoForm } from "./info-form";
import { OtpForm } from "./otp-form";
import { useRegisterForm } from "../hooks/use-register-form";
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button";

interface RegisterCardProps {
  locale: string;
}

export function RegisterCard({ locale }: RegisterCardProps) {
  const t = useTranslations("Auth");

  const {
    step,
    isPending,
    error,
    successMessage,
    email,
    handleInitiate,
    handleVerify,
    goBack,
  } = useRegisterForm(locale);

  return (
    <div
      className='w-full max-w-[400px] bg-white p-8 md:p-10'
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      {/* Logo */}
      <div className='flex justify-center mb-6'>
        <Image
          src='/logo.svg'
          alt='Mazaya'
          width={80}
          height={40}
          className='object-contain'
          priority
        />
      </div>

      {/* Heading */}
      <div className='mb-6 text-center'>
        <h1 className='text-[22px] font-bold text-gray-900 leading-tight mb-1'>
          {step === "INFO" ? t("register_title") : t("verify_title")}
        </h1>
        <p className='text-sm text-gray-500'>
          {step === "INFO" ? t("register_subtitle") : t("otp_sent_notice")}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className='mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center'>
          {error}
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className='mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 text-center'>
          {successMessage}
        </div>
      )}

      {/* Step View Switching Hub */}
      {step === "INFO" ? (
        <>
          {/* Google OAuth */}
          <GoogleSignInButton locale={locale} />

          {/* Divider */}
          <div className='relative my-5'>
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
            locale={locale}
            onSubmit={handleInitiate}
            isPending={isPending}
          />

          {/* Login link */}
          <p className='mt-5 text-center text-sm text-gray-500'>
            {t("have_account")}{" "}
            <Link
              href={`/${locale}/login`}
              className='text-[#22c55e] font-medium hover:underline'
            >
              {t("login")}
            </Link>
          </p>
        </>
      ) : (
        <OtpForm
          onVerify={handleVerify}
          onBack={goBack}
          isPending={isPending}
          email={email}
          locale={locale}
        />
      )}

      {/* Step indicator */}
      <div className='mt-6 flex items-center justify-center gap-2'>
        <span
          className={`h-1.5 rounded-full transition-all ${
            step === "INFO" ? "w-8 bg-[#22c55e]" : "w-4 bg-gray-200"
          }`}
        />
        <span
          className={`h-1.5 rounded-full transition-all ${
            step === "OTP" ? "w-8 bg-[#22c55e]" : "w-4 bg-gray-200"
          }`}
        />
      </div>
    </div>
  );
}
