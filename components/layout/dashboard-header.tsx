"use client";

import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { Bell } from "lucide-react";
import { dashboardNavItems } from "@/config/dashboard-nav";
import { useTranslations } from "next-intl";

export function DashboardHeader() {
  const pathname = usePathname();
  const t = useTranslations("Nav");

  // Strip the locale prefix (e.g. /ar/dashboard/... → /dashboard/...)
  // so href comparisons in dashboardNavItems work regardless of active locale.
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

  // Find the best-matching nav item (longest href match wins for nested routes)
  let currentTitle = "الرئيسية";
  let bestMatchLength = 0;

  for (const item of dashboardNavItems) {
    if (
      pathnameWithoutLocale === item.href ||
      pathnameWithoutLocale.startsWith(`${item.href}/`)
    ) {
      if (item.href.length > bestMatchLength) {
        bestMatchLength = item.href.length;
        // FIX: use the translationKey directly — "OwnerAccounts" is in the Nav namespace.
        // No special-casing needed any more.
        try {
          currentTitle = t(item.translationKey as any);
        } catch {
          currentTitle = item.translationKey;
        }
      }
    }
  }

  return (
    <header className='flex items-center justify-between border-b border-border bg-surface-1 px-4 py-3 md:px-8'>
      <div className='flex items-center'>
        <h1 className='text-lg font-bold text-txt-primary'>{currentTitle}</h1>
      </div>

      <div className='flex items-center gap-4'>
        <LanguageSwitcher />
        <button className='relative text-txt-secondary hover:text-brand transition-colors p-1'>
          <Bell className='h-[20px] w-[20px]' />
          <span className='absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-surface-1 bg-status-info' />
        </button>
      </div>
    </header>
  );
}
