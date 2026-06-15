"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { useLoginForm } from "../hooks/use-login-form";

interface LoginCardProps {
  locale: string;
}

export function LoginCard({ locale }: LoginCardProps) {
  const t = useTranslations("Auth");
  const { isPending, error, handleLogin } = useLoginForm(locale);

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

          <h2 className='text-2xl font-bold tracking-tight text-txt-primary'>
            {t("login_title")}
          </h2>
        </div>

        {/* Error banner */}
        {error && (
          <div className='flex items-start gap-2.5 rounded-md border border-status-danger-bg bg-status-danger-bg px-3.5 py-3 text-sm font-medium text-status-danger'>
            <span className='mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-status-danger' />
            <span>{error}</span>
          </div>
        )}

        <LoginForm onSubmit={handleLogin} isPending={isPending} />

        {/* Register link */}
        <p className='text-center text-xs text-txt-muted'>
          {t("no_account")}{" "}
          <Link
            href={`/${locale}/register`}
            className='font-semibold text-gold hover:text-gold-light transition-colors'
          >
            {t("register")}
          </Link>
        </p>
      </div>
    </div>
  );
}
