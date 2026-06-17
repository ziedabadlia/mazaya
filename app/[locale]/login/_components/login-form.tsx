"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { loginSchema, type LoginInput } from "../_utils/validation";

interface LoginFormProps {
  onSubmit: (data: Record<string, string>) => void;
  isPending: boolean;
  locale: string;
}

export function LoginForm({ onSubmit, isPending, locale }: LoginFormProps) {
  const t = useTranslations("Auth");
  const isRtl = locale === "ar";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const translateError = (message?: string) => {
    if (!message) return undefined;
    try {
      return t(message as Parameters<typeof t>[0]);
    } catch {
      return message;
    }
  };

  const onValid = (data: LoginInput) => {
    onSubmit(data as Record<string, string>);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} noValidate className='space-y-4'>
      {/* Email */}
      <div className='space-y-1.5'>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700'
        >
          {t("email_label")}
        </label>
        <input
          id='email'
          type='email'
          autoComplete='email'
          placeholder={t("email_placeholder")}
          dir='ltr'
          {...register("email")}
          className={`w-full h-10 px-3 rounded-lg border text-sm bg-white text-gray-900 placeholder:text-gray-400 outline-none transition-colors
            ${isRtl ? "text-right" : "text-left"}
            ${
              errors.email
                ? "border-red-400 focus:border-red-500"
                : "border-gray-200 focus:border-[#22c55e]"
            }`}
        />
        {errors.email && (
          <p className='text-xs text-red-500'>
            {translateError(errors.email.message)}
          </p>
        )}
      </div>

      {/* Password */}
      <div className='space-y-1.5'>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700'
        >
          {t("password_label")}
        </label>
        <div className='relative'>
          <input
            id='password'
            type={showPassword ? "text" : "password"}
            autoComplete='current-password'
            placeholder={isRtl ? "أدخل كلمة المرور" : "Enter your password"}
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
      </div>

      {/* Submit */}
      <button
        type='submit'
        disabled={isPending}
        className='w-full h-10 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] active:bg-[#15803d] text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2'
      >
        {isPending && <Loader2 className='w-4 h-4 animate-spin' />}
        {t("login_button")}
      </button>
    </form>
  );
}
