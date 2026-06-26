"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, total, limit, onChange }: PaginationProps) {
  const t = useTranslations("OwnerAccounts");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const min = Math.min((page - 1) * limit + 1, total);
  const max = Math.min(page * limit, total);

  const renderPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        pages.push(
          <button
            key={i}
            onClick={() => onChange(i)}
            className={`h-8 w-8 rounded-md text-sm font-medium transition-colors flex items-center justify-center ${
              page === i
                ? "bg-brand text-white"
                : "text-txt-secondary hover:bg-surface-2 hover:text-txt-primary"
            }`}
          >
            {i}
          </button>,
        );
      } else if (i === page - 2 || i === page + 2) {
        pages.push(
          <span key={i} className='px-1 text-txt-muted'>
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  /*
   * FIX: chevron directions were hardcoded for RTL only.
   * In RTL:  ChevronRight = "previous", ChevronLeft = "next"  (reading flows right-to-left)
   * In LTR:  ChevronLeft  = "previous", ChevronRight = "next" (reading flows left-to-right)
   *
   * Also fixed: pagination text was hardcoded Arabic. Now uses i18n.
   */
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className='flex items-center justify-between border-t border-border pt-4 mt-6'>
      <p className='text-sm text-txt-muted'>
        {t("pagination", { min, max, total })}
      </p>
      <div className='flex items-center gap-1'>
        {/* Previous */}
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className='flex h-8 w-8 items-center justify-center rounded-md text-txt-secondary hover:bg-surface-2 hover:text-txt-primary disabled:opacity-50 disabled:pointer-events-none'
          aria-label='Previous page'
        >
          <PrevIcon className='h-4 w-4' />
        </button>

        <div className='flex items-center gap-1 mx-2'>{renderPages()}</div>

        {/* Next */}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className='flex h-8 w-8 items-center justify-center rounded-md text-txt-secondary hover:bg-surface-2 hover:text-txt-primary disabled:opacity-50 disabled:pointer-events-none'
          aria-label='Next page'
        >
          <NextIcon className='h-4 w-4' />
        </button>
      </div>
    </div>
  );
}
