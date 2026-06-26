"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface StatusTabsProps {
  currentStatus: string;
  onChange: (status: string) => void;
  counts: {
    ALL: number;
    PENDING: number;
    ACTIVE: number;
    SUSPENDED: number;
  };
  /** When true, shows skeleton badges instead of count numbers */
  isLoading?: boolean;
}

/**
 * Chip color design (matches image):
 *
 *  ALL       — dark slate (active) / ghost (inactive)
 *  PENDING   — solid amber/yellow  (active) / ghost (inactive)
 *  ACTIVE    — solid green         (active) / ghost (inactive)
 *  SUSPENDED — solid red/rose      (active) / ghost (inactive)
 *
 * Active chip: fully colored background, white text, white/translucent badge.
 * Inactive chip: white/surface background, colored text + border on hover.
 */
const TAB_CONFIG = {
  ALL: {
    active: {
      container: "bg-gray-800 text-white border-gray-800 dark:bg-gray-700 dark:border-gray-700",
      badge: "bg-white/20 text-white",
    },
    inactive: {
      container: "bg-surface-1 text-txt-secondary border-border hover:border-gray-400 hover:text-gray-700 dark:hover:border-gray-500 dark:hover:text-gray-300",
      badge: "bg-surface-3 text-txt-muted",
    },
    dot: null,
  },
  PENDING: {
    active: {
      container: "bg-amber-400 text-white border-amber-400 dark:bg-amber-500 dark:border-amber-500",
      badge: "bg-white/25 text-amber-800",
    },
    inactive: {
      container: "bg-surface-1 text-txt-secondary border-border hover:border-amber-300 hover:text-amber-600 dark:hover:border-amber-700 dark:hover:text-amber-400",
      badge: "bg-surface-3 text-txt-muted",
    },
    dot: null,
  },
  ACTIVE: {
    active: {
      container: "bg-emerald-500 text-white border-emerald-500 dark:bg-emerald-600 dark:border-emerald-600",
      badge: "bg-white/25 text-emerald-800",
    },
    inactive: {
      container: "bg-surface-1 text-txt-secondary border-border hover:border-emerald-300 hover:text-emerald-600 dark:hover:border-emerald-700 dark:hover:text-emerald-400",
      badge: "bg-surface-3 text-txt-muted",
    },
    dot: null,
  },
  SUSPENDED: {
    active: {
      container: "bg-rose-500 text-white border-rose-500 dark:bg-rose-600 dark:border-rose-600",
      badge: "bg-white/25 text-rose-800",
    },
    inactive: {
      container: "bg-surface-1 text-txt-secondary border-border hover:border-rose-300 hover:text-rose-500 dark:hover:border-rose-700 dark:hover:text-rose-400",
      badge: "bg-surface-3 text-txt-muted",
    },
    dot: null,
  },
} as const;

type TabId = keyof typeof TAB_CONFIG;

export function StatusTabs({
  currentStatus,
  onChange,
  counts,
  isLoading = false,
}: StatusTabsProps) {
  const t = useTranslations("OwnerAccounts");

  /**
   * Optimistic local state — switches the active chip instantly on click
   * without waiting for the router.replace → URL change → re-render cycle.
   */
  const [optimisticStatus, setOptimisticStatus] = useState(currentStatus);

  useEffect(() => {
    setOptimisticStatus(currentStatus);
  }, [currentStatus]);

  const handleClick = (id: TabId) => {
    setOptimisticStatus(id);
    onChange(id);
  };

  const tabs: { id: TabId; label: string; count: number }[] = [
    { id: "ALL", label: t("all"), count: counts.ALL || 0 },
    { id: "PENDING", label: t("pending"), count: counts.PENDING || 0 },
    { id: "ACTIVE", label: t("active"), count: counts.ACTIVE || 0 },
    { id: "SUSPENDED", label: t("suspended"), count: counts.SUSPENDED || 0 },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {tabs.map((tab) => {
        const config = TAB_CONFIG[tab.id];
        const isActive = optimisticStatus === tab.id;
        const containerCls = isActive
          ? config.active.container
          : config.inactive.container;
        const badgeCls = isActive
          ? config.active.badge
          : config.inactive.badge;

        return (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border transition-all cursor-pointer ${containerCls}`}
          >
            <span>{tab.label}</span>
            {isLoading ? (
              /* Skeleton badge — same size as the real badge, no content */
              <span
                className={`min-w-[1.5rem] h-5 rounded-full animate-pulse ${
                  isActive ? "bg-white/30" : "bg-surface-3"
                }`}
              />
            ) : (
              <span
                className={`min-w-[1.375rem] px-1.5 py-0.5 rounded-full text-xs font-semibold text-center ${badgeCls}`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
