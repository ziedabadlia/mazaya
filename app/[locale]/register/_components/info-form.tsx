"use client";

import { useTranslations } from "next-intl";
import { Loader2, User, Building2, Mail, Lock } from "lucide-react";

// Explicitly define the expected form value payload
export interface InfoFormValues {
  name: string;
  restaurantName: string;
  email: string;
}

interface InfoFormProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isPending: boolean;
}

export function InfoForm({ onSubmit, isPending }: InfoFormProps) {
  const t = useTranslations("Auth");

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-start">
      {/* Full Name */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          {t("owner_name_label") || "Full Name"}
        </label>
        <div className="relative">
          <User className="absolute start-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="name"
            required
            className="w-full rounded-xl border border-gray-200 py-2.5 pe-4 ps-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50"
            placeholder={t("owner_name_placeholder") || "John Doe"}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Restaurant Name */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          {t("restaurant_name_label") || "Restaurant Name"}
        </label>
        <div className="relative">
          <Building2 className="absolute start-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            name="restaurantName"
            required
            className="w-full rounded-xl border border-gray-200 py-2.5 pe-4 ps-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50"
            placeholder={t("restaurant_name_placeholder") || "Mazaya Bistro"}
            disabled={isPending}
          />
        </div>
      </div>

      {/* Email Address */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          {t("email_label") || "Email Address"}
        </label>
        <div className="relative">
          <Mail className="absolute start-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="email"
            name="email"
            required
            className="w-full rounded-xl border border-gray-200 py-2.5 pe-4 ps-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50"
            placeholder="name@example.com"
            disabled={isPending}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-1">
        <label className="text-xs font-semibold text-gray-700">
          {t("password_label") || "Password"}
        </label>
        <div className="relative">
          <Lock className="absolute start-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-xl border border-gray-200 py-2.5 pe-4 ps-10 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:bg-gray-50"
            placeholder="••••••••"
            disabled={isPending}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 transition-colors focus:outline-none disabled:bg-orange-400"
      >
        {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
        {t("continue_button") || "Continue Registration"}
      </button>
    </form>
  );
}