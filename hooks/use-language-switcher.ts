"use client";

import { useRouter, usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";

export type SupportedLocale = "ar" | "en";

export interface UseLanguageSwitcherReturn {
  currentLocale: SupportedLocale;
  isPending: boolean;
  switchLocale: (locale: SupportedLocale) => void;
  isRtl: boolean;
}

export function useLanguageSwitcher(): UseLanguageSwitcherReturn {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as SupportedLocale;
  const [isPending, startTransition] = useTransition();

  const switchLocale = (nextLocale: SupportedLocale) => {
    if (nextLocale === locale) return;

    startTransition(() => {
      // Replace the locale segment in the current pathname
      // e.g. /ar/login → /en/login
      const segments = pathname.split("/");
      segments[1] = nextLocale;
      router.push(segments.join("/"));
    });
  };

  return {
    currentLocale: locale,
    isPending,
    switchLocale,
    isRtl: locale === "ar",
  };
}
