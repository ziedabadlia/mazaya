"use client";

import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User, Building2, Mail, Lock, AlertCircle } from "lucide-react";
import { registrationInfoSchema, type RegistrationInfoInput } from "../_utils/validation";

interface InfoFormProps {
  onSubmit: (data: Record<string, string>) => void; // <-- data object, not form event
  isPending: boolean;
}

export function InfoForm({ onSubmit, isPending }: InfoFormProps) {
  const t = useTranslations("Auth");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationInfoInput>({
    resolver: zodResolver(registrationInfoSchema),
    mode: "onBlur",
  });

  // Zod messages are translation keys (e.g. "errors.name_min"); resolve them
  // through next-intl so validation feedback matches the active locale.
  const translateError = (message?: string) =>
    message ? t(message as Parameters<typeof t>[0]) : undefined;

  // react-hook-form validates first; on success we hand the native form event
  // off to the existing server-action submission pipeline untouched.
  const onValid = (data: RegistrationInfoInput) => {
    onSubmit(data as Record<string, string>);
  };

  return (
    <form onSubmit={handleSubmit(onValid)} className="space-y-5 text-start" noValidate>
      {/* Full Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-txt-secondary">
          {t("owner_name_label")}
        </label>
        <div className="group relative">
          <User
            className={`pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-gold ${
              errors.name ? "text-status-danger" : "text-txt-muted"
            }`}
          />
          <input
            type="text"
            {...register("name")}
            aria-invalid={!!errors.name}
            className={`w-full rounded-md border bg-surface-2/80 py-2.5 ps-10 pe-3.5 text-sm text-txt-primary placeholder:text-txt-muted transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.name
                ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20"
                : "border-border focus:border-gold focus:bg-surface-2 focus:ring-gold/20"
            }`}
            placeholder={t("owner_name_placeholder")}
            disabled={isPending}
          />
        </div>
        {errors.name && (
          <p className="flex items-center gap-1.5 text-xs text-status-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {translateError(errors.name.message)}
          </p>
        )}
      </div>

      {/* Restaurant Name */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-txt-secondary">
          {t("restaurant_name_label")}
        </label>
        <div className="group relative">
          <Building2
            className={`pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-gold ${
              errors.restaurantName ? "text-status-danger" : "text-txt-muted"
            }`}
          />
          <input
            type="text"
            {...register("restaurantName")}
            aria-invalid={!!errors.restaurantName}
            className={`w-full rounded-md border bg-surface-2/80 py-2.5 ps-10 pe-3.5 text-sm text-txt-primary placeholder:text-txt-muted transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.restaurantName
                ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20"
                : "border-border focus:border-gold focus:bg-surface-2 focus:ring-gold/20"
            }`}
            placeholder={t("restaurant_name_placeholder")}
            disabled={isPending}
          />
        </div>
        {errors.restaurantName && (
          <p className="flex items-center gap-1.5 text-xs text-status-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {translateError(errors.restaurantName.message)}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-txt-secondary">
          {t("email_label")}
        </label>
        <div className="group relative">
          <Mail
            className={`pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-gold ${
              errors.email ? "text-status-danger" : "text-txt-muted"
            }`}
          />
          <input
            type="email"
            {...register("email")}
            aria-invalid={!!errors.email}
            dir="ltr"
            className={`w-full rounded-md border bg-surface-2/80 py-2.5 ps-10 pe-3.5 text-start text-sm text-txt-primary placeholder:text-txt-muted transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.email
                ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20"
                : "border-border focus:border-gold focus:bg-surface-2 focus:ring-gold/20"
            }`}
            placeholder={t("email_placeholder")}
            disabled={isPending}
          />
        </div>
        {errors.email && (
          <p className="flex items-center gap-1.5 text-xs text-status-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {translateError(errors.email.message)}
          </p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-txt-secondary">
          {t("password_label")}
        </label>
        <div className="group relative">
          <Lock
            className={`pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors group-focus-within:text-gold ${
              errors.password ? "text-status-danger" : "text-txt-muted"
            }`}
          />
          <input
            type="password"
            {...register("password")}
            aria-invalid={!!errors.password}
            dir="ltr"
            className={`w-full rounded-md border bg-surface-2/80 py-2.5 ps-10 pe-3.5 text-start text-sm text-txt-primary placeholder:text-txt-muted transition-all focus:outline-none focus:ring-2 disabled:opacity-50 ${
              errors.password
                ? "border-status-danger focus:border-status-danger focus:ring-status-danger/20"
                : "border-border focus:border-gold focus:bg-surface-2 focus:ring-gold/20"
            }`}
            placeholder="••••••••"
            disabled={isPending}
          />
        </div>
        {errors.password ? (
          <p className="flex items-center gap-1.5 text-xs text-status-danger">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            {translateError(errors.password.message)}
          </p>
        ) : (
          <p className="text-[11px] text-txt-muted">{t("password_hint")}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="group relative mt-3 flex w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-gradient-to-r from-gold to-gold-dim px-4 py-3 text-sm font-semibold text-surface-0 shadow-lg shadow-gold/10 transition-all hover:shadow-gold/25 hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:brightness-100"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("continue_button")}
      </button>
    </form>
  );
}