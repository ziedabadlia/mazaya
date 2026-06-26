"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { useDateRangePicker } from "../hooks/use-date-range-picker";
import { YEAR_RANGE } from "../_utils/date-format";

export interface DateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  dateType: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
  onDateTypeChange: (v: string) => void;
  onClear: () => void;
}

export function DateRangePicker({
  dateFrom,
  dateTo,
  dateType,
  onDateFromChange,
  onDateToChange,
  onDateTypeChange,
  onClear,
}: DateRangePickerProps) {
  const t = useTranslations("OwnerAccounts");
  const {
    today,
    viewYear,
    viewMonth,
    yearPickerOpen,
    setYearPickerOpen,
    setHoverDate,
    selecting,
    monthNames,
    dayLabels,
    blanks,
    days,
    years,
    prevMonth,
    nextMonth,
    handleYearSelect,
    handleDayClick,
    handleClear,
    getDayClass,
  } = useDateRangePicker({
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    onClear,
  });

  return (
    <div className='w-72 select-none' dir='ltr'>
      {/* Date type toggle */}
      <div className='flex rounded-lg bg-surface-2 p-1 mb-3 gap-1'>
        {[
          { id: "submission", label: t("date_type_submission") },
          { id: "approval", label: t("date_type_approval") },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onDateTypeChange(opt.id)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${
              dateType === opt.id
                ? "bg-surface-1 text-txt-primary shadow-sm"
                : "text-txt-muted hover:text-txt-secondary"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Month / year navigation */}
      <div className='flex items-center justify-between mb-3 px-1'>
        <button
          onClick={prevMonth}
          className='p-1 rounded-full hover:bg-surface-2 text-txt-muted hover:text-txt-primary transition-colors'
        >
          <ChevronLeft className='h-4 w-4' />
        </button>
        <button
          onClick={() => setYearPickerOpen((v) => !v)}
          className='flex items-center gap-1 text-sm font-semibold text-txt-primary hover:text-brand transition-colors rounded px-1'
        >
          <span>
            {monthNames[viewMonth]} {viewYear}
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-txt-muted transition-transform duration-200 ${yearPickerOpen ? "rotate-180" : ""}`}
          />
        </button>
        <button
          onClick={nextMonth}
          className='p-1 rounded-full hover:bg-surface-2 text-txt-muted hover:text-txt-primary transition-colors'
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>

      {yearPickerOpen ? (
        <div className='mb-3'>
          <div className='flex items-center justify-between mb-2 px-1'>
            <button
              onClick={() => handleYearSelect(viewYear - YEAR_RANGE)}
              className='p-1 rounded-full hover:bg-surface-2 text-txt-muted hover:text-txt-primary transition-colors'
            >
              <ChevronLeft className='h-3.5 w-3.5' />
            </button>
            <span className='text-xs font-medium text-txt-muted'>
              {years[0]} – {years[years.length - 1]}
            </span>
            <button
              onClick={() => handleYearSelect(viewYear + YEAR_RANGE)}
              className='p-1 rounded-full hover:bg-surface-2 text-txt-muted hover:text-txt-primary transition-colors'
            >
              <ChevronRight className='h-3.5 w-3.5' />
            </button>
          </div>
          <div className='grid grid-cols-4 gap-1'>
            {years.map((y) => (
              <button
                key={y}
                onClick={() => handleYearSelect(y)}
                className={`py-1.5 rounded-lg text-sm font-medium transition-all ${
                  y === viewYear
                    ? "bg-brand text-white"
                    : y === today.getFullYear()
                      ? "border border-brand/40 text-brand"
                      : "hover:bg-surface-2 text-txt-secondary hover:text-txt-primary"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-7 mb-1'>
            {dayLabels.map((d) => (
              <div
                key={d}
                className='text-center text-xs font-medium text-txt-muted py-1'
              >
                {d}
              </div>
            ))}
          </div>
          <div className='grid grid-cols-7'>
            {blanks.map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {days.map((day) => {
              const dayStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              return (
                <div
                  key={day}
                  onClick={() => handleDayClick(dayStr)}
                  onMouseEnter={() =>
                    selecting === "end" && setHoverDate(dayStr)
                  }
                  onMouseLeave={() => setHoverDate(null)}
                  className={`text-center text-sm py-1.5 cursor-pointer transition-colors ${getDayClass(dayStr)}`}
                >
                  {day}
                </div>
              );
            })}
          </div>
        </>
      )}

      <div className='flex items-center justify-between mt-3 pt-3 border-t border-border'>
        <button
          onClick={handleClear}
          className='text-xs text-txt-muted hover:text-txt-primary transition-colors'
        >
          {t("date_clear")}
        </button>
        <span className='text-xs text-txt-muted italic'>
          {selecting === "start" ? t("date_hint_start") : t("date_hint_end")}
        </span>
      </div>
    </div>
  );
}
