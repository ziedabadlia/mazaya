import { useState, useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { formatDisplayDate } from "../_utils/date-format";
import { useTranslations } from "next-intl";

interface UseFilterBarProps {
  search: string;
  dateFrom: string;
  dateTo: string;
  onSearchChange: (v: string) => void;
  onDateFromChange: (v: string) => void;
  onDateToChange: (v: string) => void;
}

/** Manages search debounce, date buffering, picker visibility, and derived label for FilterBar. */
export function useFilterBar({
  search,
  dateFrom,
  dateTo,
  onSearchChange,
  onDateFromChange,
  onDateToChange,
}: UseFilterBarProps) {
  const locale = useLocale();
  const t = useTranslations("OwnerAccounts");

  const [localSearch, setLocalSearch] = useState(search);
  const [localDateFrom, setLocalDateFrom] = useState(dateFrom);
  const [localDateTo, setLocalDateTo] = useState(dateTo);
  const [pickerOpen, setPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);
  useEffect(() => {
    setLocalDateFrom(dateFrom);
  }, [dateFrom]);
  useEffect(() => {
    setLocalDateTo(dateTo);
  }, [dateTo]);

  useEffect(() => {
    const handler = setTimeout(() => onSearchChange(localSearch), 500);
    return () => clearTimeout(handler);
  }, [localSearch, onSearchChange]);

  useEffect(() => {
    if (!pickerOpen) return;
    const handler = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [pickerOpen]);

  const handleLocalDateFromChange = (v: string) => {
    setLocalDateFrom(v);
    setLocalDateTo("");
  };

  /** Flushes both dates to the URL only when the range is complete. */
  const handleLocalDateToChange = (v: string) => {
    setLocalDateTo(v);
    if (localDateFrom && v) {
      onDateFromChange(localDateFrom);
      onDateToChange(v);
    }
  };

  const handleClearDate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalDateFrom("");
    setLocalDateTo("");
    onDateFromChange("");
    onDateToChange("");
  };

  const hasDate = Boolean(localDateFrom || localDateTo);

  const dateLabel = (() => {
    if (localDateFrom && localDateTo)
      return `${formatDisplayDate(localDateFrom, locale)} – ${formatDisplayDate(localDateTo, locale)}`;
    if (localDateFrom) return `${formatDisplayDate(localDateFrom, locale)} –`;
    if (localDateTo) return `– ${formatDisplayDate(localDateTo, locale)}`;
    return t("date_placeholder");
  })();

  return {
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
  };
}
