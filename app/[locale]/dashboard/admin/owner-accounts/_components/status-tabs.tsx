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
    chip: "bg-surface-1 border-border text-txt-secondary hover:border-brand/30 hover:bg-brand/5",
    badge: "bg-surface-3 text-txt-muted",
    activeChip: "bg-brand border-brand text-white shadow-sm",
    activeBadge: "bg-white/25 text-white",
  },
  PENDING: {
    chip: "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100 hover:border-amber-300",
    badge: "bg-amber-200 text-amber-800 font-bold",
    activeChip: "bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-200",
    activeBadge: "bg-white/25 text-white",
  },
  ACTIVE: {
    chip: "bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-300",
    badge: "bg-emerald-200 text-emerald-800 font-bold",
    activeChip: "bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200",
    activeBadge: "bg-white/25 text-white",
  },
  SUSPENDED: {
    chip: "bg-rose-50 border-rose-200 text-rose-800 hover:bg-rose-100 hover:border-rose-300",
    badge: "bg-rose-200 text-rose-800 font-bold",
    activeChip: "bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-200",
    activeBadge: "bg-white/25 text-white",
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
        const chipCls = isActive ? config.activeChip : config.chip;
        const badgeCls = isActive ? config.activeBadge : config.badge;

        return (
          <button
            key={tab.id}
            onClick={() => handleClick(tab.id)}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 cursor-pointer ${chipCls}`}
          >
            <span>{tab.label}</span>
            {isLoading ? (
              <span
                className={`min-w-[1.5rem] h-5 rounded-full animate-pulse ${
                  isActive ? "bg-white/30" : "bg-surface-3"
                }`}
              />
            ) : (
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full min-w-[1.5rem] text-center ${badgeCls}`}
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
