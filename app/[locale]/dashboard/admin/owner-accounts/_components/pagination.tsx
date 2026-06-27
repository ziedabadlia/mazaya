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
            className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg text-sm font-medium transition-colors flex items-center justify-center ${
              page === i
                ? "bg-[#009966] text-white"
                : "text-txt-secondary hover:bg-surface-2 hover:text-txt-primary"
            }`}
          >
            {i}
          </button>,
        );
      } else if (i === page - 2 || i === page + 2) {
        pages.push(
          <span key={i} className='px-0.5 sm:px-1 text-txt-muted'>
            ...
          </span>,
        );
      }
    }
    return pages;
  };

  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-border pt-4 mt-6'>
      <p className='text-sm text-txt-muted text-center sm:text-start'>
        {t("pagination", { min, max, total })}
      </p>
      <div className='flex items-center justify-center gap-1.5 sm:gap-2'>
        {/* Previous */}
        <button
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className='flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border bg-white text-xs sm:text-sm font-medium text-txt-secondary transition-all hover:bg-surface-2 hover:text-txt-primary disabled:opacity-50 disabled:pointer-events-none'
        >
          {!isRtl && <PrevIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />}
          <span>{t("previous")}</span>
          {isRtl && <PrevIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />}
        </button>

        <div className='flex items-center gap-1 mx-0.5 sm:mx-1'>{renderPages()}</div>

        {/* Next */}
        <button
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className='flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border bg-white text-xs sm:text-sm font-medium text-txt-secondary transition-all hover:bg-surface-2 hover:text-txt-primary disabled:opacity-50 disabled:pointer-events-none'
        >
          {isRtl && <NextIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />}
          <span>{t("next")}</span>
          {!isRtl && <NextIcon className='h-3.5 w-3.5 sm:h-4 sm:w-4' />}
        </button>
      </div>
    </div>
  );
}
