"use client";

import { Search, Calendar, ArrowUpDown, ChevronDown, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { DateRangePicker } from "./date-range-picker";
import { useFilterBar } from "../hooks/use-filter-bar";

interface FilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: string;
  onSortChange: (value: string) => void;
  dateFrom: string;
  onDateFromChange: (value: string) => void;
  dateTo: string;
  onDateToChange: (value: string) => void;
  dateType: string;
  onDateTypeChange: (value: string) => void;
}

export function FilterBar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
  dateType,
  onDateTypeChange,
}: FilterBarProps) {
  const t = useTranslations("OwnerAccounts");
  const {
    localSearch,
    setLocalSearch,
    localDateFrom,
    localDateTo,
    pickerOpen,
    setPickerOpen,
    pickerRef,
    hasDate,
    dateLabel,
    handleLocalDateFromChange,
    handleLocalDateToChange,
    handleClearDate,
  } = useFilterBar({
    search,
    dateFrom,
    dateTo,
    onSearchChange,
    onDateFromChange,
    onDateToChange,
  });

  return (
    <div className='flex flex-col md:flex-row gap-4 mb-6 items-center justify-between'>
      <div className='relative w-full md:w-96'>
        <Search className='absolute end-3 top-1/2 -translate-y-1/2 h-5 w-5 text-txt-muted pointer-events-none' />
        <input
          type='text'
          placeholder={t("search")}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className='w-full rounded-full border border-border bg-surface-1 py-2.5 pe-10 ps-4 text-sm font-medium text-txt-primary placeholder:text-txt-muted focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all'
        />
      </div>

      <div className='flex flex-wrap items-center gap-3 w-full md:w-auto'>
        <div className='relative' ref={pickerRef}>
          <button
            onClick={() => setPickerOpen((v) => !v)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
              hasDate
                ? "border-brand/40 bg-brand/5 text-brand"
                : "border-border bg-surface-1 text-txt-secondary hover:border-brand/30 hover:text-txt-primary"
            }`}
          >
            <Calendar className='h-4 w-4 shrink-0' />
            <span className='max-w-[220px] truncate'>{dateLabel}</span>
            {hasDate ? (
              <span
                onClick={handleClearDate}
                className='ms-1 text-brand/60 hover:text-brand cursor-pointer'
              >
                <X className='h-3.5 w-3.5' />
              </span>
            ) : (
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${pickerOpen ? "rotate-180" : ""}`}
              />
            )}
          </button>

          {pickerOpen && (
            <div
              className='absolute top-full mt-2 start-0 z-50 rounded-2xl border border-border bg-surface-1 shadow-lg p-4'
              dir='ltr'
            >
              <DateRangePicker
                dateFrom={localDateFrom}
                dateTo={localDateTo}
                dateType={dateType}
                onDateFromChange={handleLocalDateFromChange}
                onDateToChange={handleLocalDateToChange}
                onDateTypeChange={onDateTypeChange}
              />
            </div>
          )}
        </div>

        <button
          onClick={() => onSortChange(sort === "desc" ? "asc" : "desc")}
          className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
            sort !== "desc"
              ? "border-brand/40 bg-brand/5 text-brand"
              : "border-border bg-surface-1 text-txt-secondary hover:border-brand/30 hover:text-txt-primary"
          }`}
        >
          <ArrowUpDown className='h-4 w-4 shrink-0' />
          <span>{sort === "desc" ? t("newest_first") : t("oldest_first")}</span>
        </button>
      </div>
    </div>
  );
}
