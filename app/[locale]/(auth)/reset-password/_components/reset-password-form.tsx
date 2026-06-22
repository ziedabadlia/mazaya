"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "../_utils/validation";

interface ResetPasswordFormProps {
  onSubmit: (data: Record<string, string>) => void;
  isPending: boolean;
  locale: string;
}

export function ResetPasswordForm({
  onSubmit,
  isPending,
  locale,
}: ResetPasswordFormProps) {
  const t = useTranslations("Auth");
  const isRtl = locale === "ar";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const translateError = (message?: string) => {
    if (!message) return undefined;
    try {
      return t(message as Parameters<typeof t>[0]);
    } catch {
      return message;
    }
  };

  const onValid = (data: ResetPasswordInput) => {
    onSubmit(data as Record<string, string>);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className='space-y-4'>
      {/* New Password */}
      <div className='space-y-1.5'>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          {t("new_password_label")}
        </label>
        <div className='relative'>
          <input
            id='password'
            type={showPassword ? "text" : "password"}
            autoComplete='new-password'
            placeholder={
              isRtl ? "أدخل كلمة المرور الجديدة" : "Enter new password"
            }
            {...register("password")}
            className={`w-full h-10 px-3 rounded-lg border text-sm bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors
              ${isRtl ? "pr-3 pl-10" : "pl-3 pr-10"}
              ${
                errors.password
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#22c55e]"
              }`}
          />
          <button
            type='button'
            onClick={() => setShowPassword((p) => !p)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors
              ${isRtl ? "left-3" : "right-3"}`}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        </div>
        {errors.password && (
          <p className='text-xs text-red-500'>
            {translateError(errors.password.message)}
          </p>
        )}
        <p className='text-xs text-gray-400'>{t("password_hint")}</p>
      </div>

      {/* Confirm Password */}
      <div className='space-y-1.5'>
        <label
          htmlFor='confirmPassword'
          className='block text-sm font-medium text-gray-700'
        >
          {t("confirm_password_label")}
        </label>
        <div className='relative'>
          <input
            id='confirmPassword'
            type={showConfirmPassword ? "text" : "password"}
            autoComplete='new-password'
            placeholder={isRtl ? "أعد إدخال كلمة المرور" : "Re-enter password"}
            {...register("confirmPassword")}
            className={`w-full h-10 px-3 rounded-lg border text-sm bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors
              ${isRtl ? "pr-3 pl-10" : "pl-3 pr-10"}
              ${
                errors.confirmPassword
                  ? "border-red-400 focus:border-red-500"
                  : "border-gray-200 focus:border-[#22c55e]"
              }`}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword((p) => !p)}
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors
              ${isRtl ? "left-3" : "right-3"}`}
            tabIndex={-1}
            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
          >
            {showConfirmPassword ? (
              <EyeOff className='w-4 h-4' />
            ) : (
              <Eye className='w-4 h-4' />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className='text-xs text-red-500'>
            {translateError(errors.confirmPassword.message)}
          </p>
        )}
      </div>

      <button
        type='submit'
        disabled={isPending}
        className='w-full h-10 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2'
      >
        {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
        {t("reset_password_button")}
      </button>
    </form>
  );
}
