"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { navIconMap, type NavItem } from "@/config/dashboard-nav";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";

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

  return (
    <>
      {/* Mobile Header */}
      <div className='flex items-center justify-between border-b border-border bg-surface-1 px-4 py-3 md:hidden'>
        <img
          src='/mazaya-logo.png'
          alt='Mazaya'
          className='h-8 w-8 object-contain'
        />
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-txt-secondary hover:text-txt-primary transition-colors'
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-border bg-surface-1 transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        {/* Desktop Logo */}
        <div className='flex items-center gap-3 border-b border-border px-5 py-5'>
          <img
            src='/mazaya-logo.png'
            alt='Mazaya'
            className='h-10 w-10 object-contain'
          />
          <span className='text-lg font-bold text-gold tracking-wide'>
            مزايا
          </span>
        </div>

        {/* Nav Links */}
        <nav className='flex-1 space-y-1 overflow-y-auto p-3'>
          {items.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = navIconMap[item.iconKey]; // <-- resolve here

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all border
        ${
          isActive
            ? "bg-gold/10 text-gold border-gold/20"
            : "text-txt-secondary hover:bg-surface-2 hover:text-txt-primary border-transparent"
        }`}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 ${isActive ? "text-gold" : "text-txt-muted"}`}
                />
                <span>{t(item.translationKey as any)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className='border-t border-border p-3 space-y-1'>
          {/* User Info */}
          <div className='flex items-center gap-3 rounded-lg px-3 py-2.5'>
            <div className='flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold ring-1 ring-gold/20'>
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className='flex flex-col truncate'>
              <span className='truncate text-sm font-medium text-txt-primary'>
                {user.name}
              </span>
              <span className='text-xs text-txt-muted'>{user.role}</span>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className='flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-sm font-medium text-txt-secondary transition-all hover:border-status-danger/20 hover:bg-status-danger-bg hover:text-status-danger'
          >
            <LogOut className='h-4 w-4 shrink-0' />
            <span>{t("Logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden'
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
