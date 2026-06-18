"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { useLoginForm } from "../hooks/use-login-form";
import { GoogleSignInButton } from "@/components/ui/google-sign-in-button";
import { AuthCard } from "@/components/auth/auth-card";

interface LoginCardProps {
  locale: string;
}

export function LoginCard({ locale }: LoginCardProps) {
  const t = useTranslations("Auth");
  const { isPending, error, handleLogin } = useLoginForm(locale);

  return (
    <AuthCard
      locale={locale}
      title={t("login_title")}
      subtitle={t("login_subtitle")}
      error={error}
    >
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
      <LoginForm onSubmit={handleLogin} isPending={isPending} locale={locale} />

      {/* Register link */}
      <p className='mt-4 sm:mt-5 text-center text-sm text-gray-500'>
        {t("no_account")}{" "}
        <Link
          href={`/${locale}/register`}
          className='text-[#22c55e] font-medium hover:underline'
        >
          {t("register")}
        </Link>
      </p>
    </AuthCard>
  );
}
