"use client";

import { useTranslations } from "next-intl";
import { Loader2, ArrowLeft, KeySquare } from "lucide-react";

interface OtpFormProps {
  onVerify: (code: string) => void;
  onBack: () => void;
  isPending: boolean;
  email: string;
}

export function OtpForm({ onVerify, onBack, isPending, email }: OtpFormProps) {
  const t = useTranslations("Auth");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const codeValue = formData.get("code") as string;
    onVerify(codeValue.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 text-start">
      {/* Informative Status Card */}
      <div className="rounded-xl bg-gray-50 p-3.5 border border-gray-100 text-center">
        <p className="text-xs text-gray-500 leading-normal">
          {t("otp_sent_notice") || "We sent a security verification pin code safely to:"}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate mt-0.5">{email}</p>
      </div>

      {/* Security Token Input */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          {t("otp_label") || "Verification Token"}
        </label>
        <div className="relative">
          <KeySquare className="absolute start-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="code"
            required
            maxLength={6}
            pattern="\D*" // Ensure input handling filters down gracefully
            className="w-full tracking-[0.4em] text-center font-mono text-lg rounded-xl border border-gray-200 py-2.5 px-4 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50"
            placeholder="000000"
            disabled={isPending}
            autoFocus
          />
        </div>
      </div>

      {/* Action Navigation Column */}
      <div className="flex flex-col gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors focus:outline-none disabled:bg-orange-400"
        >
          {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("verify_button") || "Confirm Code & Finish"}
        </button>

        <button
          type="button"
          onClick={onBack}
          disabled={isPending}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors focus:outline-none"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t("back_button") || "Back to Info"}
        </button>
      </div>
    </form>
  );
}