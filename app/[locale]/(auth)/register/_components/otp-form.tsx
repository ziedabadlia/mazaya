"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, AlertCircle, Mail } from "lucide-react";
import { otpSchema, type OtpInput } from "../_utils/validation";

interface OtpFormProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  isPending: boolean;
  email: string;
  locale: string;
}

export function OtpForm({
  onVerify,
  onBack,
  isPending,
  email,
  locale,
}: OtpFormProps) {
  const t = useTranslations("Auth");
  const isRtl = locale === "ar";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    mode: "onSubmit",
  });

  // Zod messages are translation keys (e.g. "errors.otp_length"); resolve
  // them through next-intl so validation feedback matches the active locale.
  const translateError = (message?: string) => {
    if (!message) return undefined;
    try {
      return t(message as Parameters<typeof t>[0]);
    } catch {
      return message;
    }
  };

  const onValid = (data: OtpInput) => {
    onVerify(data.code.trim());
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className='space-y-4'>
      {/* Email confirmation chip */}
      <div className='flex items-center justify-center gap-2 rounded-lg bg-gray-50 border border-gray-200 px-4 py-3 text-center'>
        <Mail className='w-4 h-4 text-gray-400 shrink-0' />
        <p className='text-sm font-medium text-gray-700 truncate' dir='ltr'>
          {email}
        </p>
      </div>

      {/* OTP Input */}
      <div className='space-y-1.5'>
        <label
          htmlFor='code'
          className='block text-sm font-medium text-gray-700 text-center'
        >
          {t("otp_label")}
        </label>
        <input
          id='code'
          type='text'
          inputMode='numeric'
          maxLength={6}
          dir='ltr'
          autoFocus
          disabled={isPending}
          placeholder='000000'
          {...register("code")}
          className={`w-full h-12 px-3 rounded-lg border text-center font-mono text-xl tracking-[0.5em] bg-white text-gray-900 placeholder:text-gray-300 outline-none transition-colors disabled:opacity-60
            ${
              errors.code
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-[#22c55e]"
            }`}
        />
        {errors.code && (
          <p className='flex items-center justify-center gap-1.5 text-xs text-red-500'>
            <AlertCircle className='w-3.5 h-3.5 shrink-0' />
            {translateError(errors.code.message)}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type='submit'
        disabled={isPending}
        className='w-full h-10 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2'
      >
        {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
        {t("verify_button")}
      </button>

      {/* Back */}
      <button
        type='button'
        onClick={onBack}
        disabled={isPending}
        className='w-full h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:bg-gray-100 text-sm font-medium text-gray-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
      >
        <ArrowLeft className={`w-4 h-4 ${isRtl ? "rotate-180" : ""}`} />
        {t("back_button")}
      </button>
    </form>
  );
}
