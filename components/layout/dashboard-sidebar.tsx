"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut, MoveRight } from "lucide-react";
import { navIconMap, type NavItem } from "@/config/dashboard-nav";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface SidebarProps {
  items: NavItem[];
  user: {
    name?: string | null;
    role: string;
    email?: string | null;
  };
}

export function DashboardSidebar({ items, user }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations("Nav");
  const locale = useLocale();
  const isRtl = locale === "ar";

  // Strip locale prefix for active matching
  const pathnameWithoutLocale = pathname.replace(/^\/(ar|en)/, "");

  return (
    <>
      {/* Mobile top bar */}
      <div className='flex items-center justify-between border-b border-border bg-surface-1 px-4 py-3 md:hidden'>
        <img src='/logo.svg' alt='Mazaya' className='h-8 w-8 object-contain' />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-txt-secondary hover:text-txt-primary transition-colors'
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar panel
       *
       * FIX: mobile slide animation was using translate-x-full (physical right)
       * which is wrong in LTR — sidebar should slide in from the left.
       * Now uses logical inset-inline-start (start-0) and the translate
       * is driven by a data attribute so we can target it with a CSS var.
       *
       * Approach: use translate-x-full to hide (off-screen to the right in RTL,
       * to the left in LTR) — but since the sidebar is on the START side in both
       * locales we need to push it off the START edge when closed:
       *   RTL → sidebar is on the right → hide with -translate-x-full (move left, off screen)
       *   LTR → sidebar is on the left  → hide with -translate-x-full (move left, off screen)
       * So -translate-x-full is actually correct for LTR but WRONG for RTL (should be +translate-x-full).
       * The cleanest solution: use `translate-x-full` when RTL (push to the right = off the right edge)
       * and `-translate-x-full` when LTR (push to the left = off the left edge).
       */}
      <aside
        className={`
          fixed inset-y-0 start-0 z-50 flex w-64 flex-col
          border-e border-border bg-surface-1
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${
            isOpen
              ? "translate-x-0"
              : isRtl
                ? "translate-x-full" // RTL closed: slide off to the right
                : "-translate-x-full" // LTR closed: slide off to the left
          }
        `}
      >
        {/* Logo + role */}
        <div className='flex items-center gap-3 px-5 py-5'>
          <img
            src='/logo.svg'
            alt='Mazaya'
            className='h-9 w-9 object-contain'
          />
          <span className='text-sm font-semibold text-txt-primary'>
            {user.role === "SUPER_ADMIN" ? t("SuperAdmin") : user.name}
          </span>
        </div>

        {/* Nav links */}
        <nav className='flex-1 space-y-0.5 overflow-y-auto px-3 py-2'>
          <div className='px-2 pb-2 pt-1 text-xs font-medium text-txt-muted'>
            {t("Overview")}
          </div>
          {items.map((item) => {
            const isActive =
              pathnameWithoutLocale === item.href ||
              pathnameWithoutLocale.startsWith(`${item.href}/`);
            const Icon = navIconMap[item.iconKey];

            return (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-2.5 text-sm font-medium
                  transition-all rounded-xl
                  ${
                    isActive
                      ? "bg-brand/10 text-brand font-semibold"
                      : "text-txt-secondary hover:bg-surface-2/60 hover:text-txt-primary"
                  }
                `}
              >
                <Icon
                  className={`h-[18px] w-[18px] shrink-0 ${isActive ? "text-brand" : "text-txt-muted"}`}
                />
                <span>{t(item.translationKey as any)}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className='px-3 pb-5 pt-2 border-t border-border'>
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
            className='flex w-full items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-colors hover:bg-red-50'
            style={{ color: "#C1440E" }}
          >
            <LogOut className='h-[18px] w-[18px] shrink-0' />
            <span>{t("Logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
