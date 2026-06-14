"use client";

import { useTranslations } from "next-intl";
import { InfoForm } from "./info-form";
import { OtpForm } from "./otp-form";
import { useRegisterForm } from "../hooks/use-register-form";

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
    <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
      {/* Dynamic Context Header Branding */}
      <div className="text-center space-y-1.5">
        <span className="text-3xl font-black text-orange-600 tracking-tight">مزايا</span>
        <h2 className="text-xl font-bold text-gray-900">
          {step === "INFO" 
            ? (t("register_title") || "Create Restaurant Account") 
            : (t("verify_title") || "Two-Factor Verification")}
        </h2>
      </div>

      {/* Global Notice Status Banners */}
      {error && (
        <div className="rounded-xl bg-red-50 p-3.5 text-sm font-medium text-red-600 border border-red-100">
          {error}
        </div>
      )}
      {successMessage && (
        <div className="rounded-xl bg-emerald-50 p-3.5 text-sm font-medium text-emerald-600 border border-emerald-100">
          {successMessage}
        </div>
      )}

      {/* Step View Switching Hub */}
      {step === "INFO" ? (
        <InfoForm onSubmit={handleInitiate} isPending={isPending} />
      ) : (
        <OtpForm 
          onVerify={handleVerify} 
          onBack={setStepBack} 
          isPending={isPending} 
          email={userEmail} 
        />
      )}
    </div>
  );
}