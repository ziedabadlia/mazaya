import { useState } from "react";
import { useLocale } from "next-intl";
import {
  getDaysInMonth,
  getFirstDayOfWeek,
  MONTH_NAMES_EN,
  MONTH_NAMES_AR,
  DAY_LABELS_EN,
  DAY_LABELS_AR,
  YEAR_RANGE,
} from "../_utils/date-format";

interface UseDateRangePickerProps {
  dateFrom: string;
  dateTo: string;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
}

/** Encapsulates all calendar state and interaction logic for DateRangePicker. */
export function useDateRangePicker({
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
}: UseDateRangePickerProps) {
  const locale = useLocale();
  const isRtl = locale === "ar";

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [yearPickerOpen, setYearPickerOpen] = useState(false);

  /** Which half of the range the next click will set. */
  const selecting: "start" | "end" = dateFrom && !dateTo ? "end" : "start";

  const monthNames = isRtl ? MONTH_NAMES_AR : MONTH_NAMES_EN;
  const dayLabels = isRtl ? DAY_LABELS_AR : DAY_LABELS_EN;

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleYearSelect = (y: number) => {
    setViewYear(y);
    setYearPickerOpen(false);
  };

  const prevYearRange = () => setViewYear((y) => y - YEAR_RANGE);
  const nextYearRange = () => setViewYear((y) => y + YEAR_RANGE);

  const handleDayClick = (dayStr: string) => {
    if (selecting === "start") {
      onDateFromChange(dayStr);
      onDateToChange("");
    } else {
      if (dayStr < dateFrom) {
        onDateFromChange(dayStr);
        onDateToChange(dateFrom);
      } else {
        onDateToChange(dayStr);
      }
    }
  };

  const handleClear = () => {
    onDateFromChange("");
    onDateToChange("");
    setHoverDate(null);
  };

  /** Returns the Tailwind classes for a given day cell based on range selection state. */
  const getDayClass = (dayStr: string): string => {
    const isStart = dayStr === dateFrom;
    const isEnd = dayStr === dateTo;
    const effectiveTo =
      dateTo || (selecting === "end" && hoverDate ? hoverDate : null);
    const inRange =
      dateFrom && effectiveTo && dayStr > dateFrom && dayStr < effectiveTo;

    if (isStart && isEnd)
      return "rounded-full bg-brand text-white font-semibold";
    if (isStart) return "rounded-s-full bg-brand text-white font-semibold";
    if (isEnd) return "rounded-e-full bg-brand text-white font-semibold";
    if (inRange) return "bg-brand/10 text-brand font-medium";
    return "rounded-full hover:bg-surface-3 text-txt-primary";
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDow = getFirstDayOfWeek(viewYear, viewMonth);
  const blanks = Array(firstDow).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const yearStart = viewYear - Math.floor(YEAR_RANGE / 2);
  const years = Array.from({ length: YEAR_RANGE }, (_, i) => yearStart + i);

  return {
    today,
    viewYear,
    viewMonth,
    yearPickerOpen,
    setYearPickerOpen,
    hoverDate,
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
    YEAR_RANGE,
  };
}
