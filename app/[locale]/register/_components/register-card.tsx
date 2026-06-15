"use client";

import { useTranslations } from "next-intl";
import { InfoForm } from "./info-form";
import { OtpForm } from "./otp-form";
import { useRegisterForm } from "../hooks/use-register-form";
import Link from "next/link";

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
    userEmail,
    handleInitiate,
    handleVerify,
    setStepBack,
  } = useRegisterForm(locale);

  return (
    <div className='relative z-10 w-full max-w-md'>
      {/* Top accent glow bar */}
      <div className='absolute -top-px start-6 end-6 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent' />

      <div className='space-y-7 rounded-xl border border-border bg-gradient-to-b from-surface-1 to-surface-1/60 p-8 shadow-2xl shadow-black/50 backdrop-blur-sm sm:p-9'>
        {/* Brand mark + header */}
        <div className='flex flex-col items-center space-y-5 text-center'>
          {/* Logo */}
          <div className='relative flex h-24 w-24 shrink-0 items-center justify-center'>
            <img
              src='/mazaya-logo.png'
              alt='Mazaya'
              className='h-full w-full object-contain drop-shadow-lg'
            />
          </div>

          {/* Page title only */}
          <h2 className='text-2xl font-bold tracking-tight text-txt-primary'>
            {step === "INFO" ? t("register_title") : t("verify_title")}
          </h2>
        </div>

        {/* Global Notice Status Banners */}
        {error && (
          <div className='flex items-start gap-2.5 rounded-md border border-status-danger-bg bg-status-danger-bg px-3.5 py-3 text-sm font-medium text-status-danger'>
            <span className='mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-status-danger' />
            {error}
          </div>
        )}
        {successMessage && (
          <div className='flex items-start gap-2.5 rounded-md border border-status-success-bg bg-status-success-bg px-3.5 py-3 text-sm font-medium text-status-success'>
            <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-status-success' />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Step View Switching Hub */}
        {step === "INFO" ? (
          <InfoForm
            locale={locale}
            onSubmit={handleInitiate}
            isPending={isPending}
          />
        ) : (
          <OtpForm
            onVerify={handleVerify}
            onBack={setStepBack}
            isPending={isPending}
            email={userEmail}
          />
        )}
      </div>

      {/* Step indicator */}
      <div className='mt-6 flex items-center justify-center gap-2'>
        <span
          className={`h-1.5 rounded-full transition-all ${
            step === "INFO" ? "w-8 bg-gold" : "w-4 bg-surface-3"
          }`}
        />
        <span
          className={`h-1.5 rounded-full transition-all ${
            step === "OTP" ? "w-8 bg-gold" : "w-4 bg-surface-3"
          }`}
        />
      </div>
    </div>
  );
}
