"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { changeLanguage, type SupportedLanguage } from "@/lib/i18n";

const LANGUAGES: { code: SupportedLanguage; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current =
    LANGUAGES.find((lang) => lang.code === i18n.language) ?? LANGUAGES[0];

  const select = (code: SupportedLanguage) => {
    changeLanguage(code);
    setOpen(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 transition hover:border-white/30 hover:text-white"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-medium uppercase">{current.code}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-white/10 bg-[#141414] shadow-2xl shadow-black/50"
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="option"
              aria-selected={lang.code === current.code}
              onClick={() => select(lang.code)}
              className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition ${
                lang.code === current.code
                  ? "bg-white/10 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span className="text-base leading-none">{lang.flag}</span>
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
