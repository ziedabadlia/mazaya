"use client";

import {
  useLanguageSwitcher,
  type SupportedLocale,
} from "@/hooks/use-language-switcher";
import { Languages, ChevronDown, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

const LOCALES: { value: SupportedLocale; nativeLabel: string }[] = [
  { value: "ar", nativeLabel: "العربية" },
  { value: "en", nativeLabel: "English" },
];

export function LanguageSwitcher() {
  const { currentLocale, isPending, switchLocale } = useLanguageSwitcher();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentOption = LOCALES.find((l) => l.value === currentLocale);

  return (
    /*
     * dir="ltr" on the container ensures the button layout (globe → label → chevron)
     * always reads left-to-right visually, and crucially makes `left-0` on the
     * dropdown always mean the physical right edge — never flipped by RTL.
     */
    <div ref={containerRef} className='relative' dir='ltr'>
      {/* Trigger */}
      <button
        type='button'
        onClick={() => setIsOpen((o) => !o)}
        disabled={isPending}
        aria-haspopup='listbox'
        aria-expanded={isOpen}
        className='flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-60'
      >
        {isPending ? (
          <Loader2 className='h-4 w-4 animate-spin text-gray-400' />
        ) : (
          <Languages className='h-4 w-4 text-gray-400' />
        )}
        <span>{currentOption?.nativeLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown — left-0 is a physical property (not logical), stays right in RTL too */}
      {isOpen && (
        <ul
          role='listbox'
          className='absolute left-0 mt-1.5 w-36 rounded-lg border border-gray-200 bg-white py-1 shadow-lg z-50'
        >
          {LOCALES.map((locale) => (
            <li
              key={locale.value}
              role='option'
              aria-selected={locale.value === currentLocale}
            >
              <button
                type='button'
                onClick={() => {
                  switchLocale(locale.value);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center px-3 py-2 text-sm transition-colors hover:bg-gray-50 ${
                  locale.value === currentLocale
                    ? "font-semibold text-[#22c55e]"
                    : "text-gray-700"
                }`}
              >
                {locale.nativeLabel}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
