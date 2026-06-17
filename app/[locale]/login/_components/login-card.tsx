"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { LoginForm } from "./login-form";
import { useLoginForm } from "../hooks/use-login-form";
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button";

interface LoginCardProps {
  locale: string;
}

export function LoginCard({ locale }: LoginCardProps) {
  const t = useTranslations("Auth");
  const { handleLogin, isPending, error } = useLoginForm(locale);

  return (
    <div
      className='w-full max-w-[400px] bg-white rounded-2xl shadow-xl p-8 md:p-10'
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
          {t("login_title")}
        </h1>
        <p className='text-sm text-gray-500'>{t("login_subtitle")}</p>
      </div>

      {/* Error banner */}
      {error && (
        <div className='mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 text-center'>
          {error}
        </div>
      )}

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
      <LoginForm onSubmit={handleLogin} isPending={isPending} locale={locale} />

      {/* Register link */}
      <p className='mt-5 text-center text-sm text-gray-500'>
        {t("no_account")}{" "}
        <Link
          href={`/${locale}/register`}
          className='text-[#22c55e] font-medium hover:underline'
        >
          {t("register")}
        </Link>
      </p>
    </div>
  );
}
