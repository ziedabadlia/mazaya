"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ArrowLeft, KeySquare, Mail, AlertCircle } from "lucide-react";
import { otpSchema, type OtpInput } from "../_utils/validation";

interface OtpFormProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  isPending: boolean;
  email: string;
}

export function OtpForm({ onVerify, onBack, isPending, email }: OtpFormProps) {
  const t = useTranslations("Auth");

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
  const translateError = (message?: string) =>
    message ? t(message as Parameters<typeof t>[0]) : undefined;

  const onValid = (data: OtpInput) => {
    onVerify(data.code.trim());
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-6 text-start" noValidate>
      {/* Informative Status Card */}
      <div className="flex flex-col items-center gap-2 rounded-md border border-border bg-surface-2/60 px-4 py-4 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold/10 text-gold ring-1 ring-gold/20">
          <Mail className="h-4 w-4" />
        </div>
        <p className="text-xs leading-relaxed text-txt-secondary">
          {t("otp_sent_notice")}
        </p>
        <p className="text-sm font-semibold text-txt-primary" dir="ltr">
          {email}
        </p>
      </div>

      {/* Security Token Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-txt-secondary">
          {t("otp_label")}
        </label>
        <div className="group relative">
          <KeySquare
            className={`pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-gold ${
              errors.code ? "text-status-danger" : "text-txt-muted"
            }`}
          />
          <input
            type="text"
            {...register("code")}
            aria-invalid={!!errors.code}
            maxLength={6}
            inputMode="numeric"
            dir="ltr"
            className={`w-full rounded-md border bg-surface-2/80 px-4 py-3 text-center font-mono text-xl tracking-[0.5em] text-txt-primary placeholder:text-txt-muted/50 transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.code
                ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20"
                : "border-border focus:border-gold focus:bg-surface-2 focus:ring-gold/20"
            }`}
            placeholder="000000"
            disabled={isPending}
            autoFocus
          />
        </div>
        {errors.code && (
          <p className="flex items-center justify-center gap-1.5 text-xs text-status-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {translateError(errors.code.message)}
          </p>
        )}
      </div>

      {/* Action Navigation Column */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-to-r from-gold to-gold-dim px-4 py-3 text-sm font-semibold text-surface-0 shadow-lg shadow-gold/10 transition-all hover:shadow-gold/25 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:brightness-100"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("verify_button")}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-transparent px-4 py-2.5 text-sm font-medium text-txt-secondary transition-colors hover:border-gold/40 hover:text-gold focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("back_button")}
        </button>
      </div>
    </form>
  );
}