"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogOut } from "lucide-react";
import { type NavItem } from "@/config/dashboard-nav";
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
      {/* Mobile Header & Trigger */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4 md:hidden">
        <span className="text-2xl font-bold text-orange-600">مزايا</span>
        <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`
          fixed inset-y-0 start-0 z-50 flex w-64 flex-col border-e border-gray-200 bg-white transition-transform duration-300 ease-in-out md:static md:translate-x-0
          ${isOpen ? "translate-x-0" : "translate-x-full md:translate-x-0"}
        `}
      >
        {/* Desktop Brand Logo */}
        <div className="hidden items-center justify-center border-b border-gray-100 py-6 md:flex">
          <span className="text-3xl font-extrabold text-orange-600 tracking-tight">
            مزايا
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map((item) => {
            // Determine active state, considering the locale prefix in the pathname
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors
                  ${
                    isActive
                      ? "bg-orange-50 text-orange-600 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <item.icon
                  className={`h-5 w-5 ${
                    isActive ? "text-orange-600" : "text-gray-400"
                  }`}
                />
                <span>{t(item.translationKey as any)}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Profile & Logout Footer */}
        <div className="border-t border-gray-100 p-4">
          <div className="mb-4 flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-orange-700 font-bold">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex flex-col truncate">
              <span className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span>{t("Logout")}</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay Background */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}