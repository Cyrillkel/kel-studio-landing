"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLang } from "./useLang";
import type { Lang } from "@/lib/lang";
import { alternatePath } from "@/lib/routes";
import { GOALS, reachGoal } from "@/lib/metrika";

const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "en", label: "English", flag: "🇬🇧" },
];

// The language is the address of the page (/ for Russian, /en for English), so
// switching is a plain link to the same page in the other language, which crawlers
// can follow too. Between the two the browser loads a new document, because the
// languages have their own root layouts (app/(ru)/layout.tsx, app/(en)/layout.tsx).
export default function LanguageSwitcher({
  className = "",
}: {
  className?: string;
}) {
  const { t } = useTranslation();
  const lang = useLang();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const current = LANGUAGES.find((item) => item.code === lang) ?? LANGUAGES[0];

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={t("nav.language")}
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-gray-300 transition hover:border-white/30 hover:text-white cursor-pointer"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="font-medium uppercase">{current.code}</span>
        <svg
          className={`h-3.5 w-3.5 transition-transform duration-200 max-[379px]:hidden ${
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
        <ul
          className="absolute right-0 z-50 mt-2 w-40 overflow-hidden rounded-lg border border-white/10 bg-popover shadow-2xl shadow-shade/50"
        >
          {LANGUAGES.map((item) => {
            const active = item.code === current.code;
            const itemClass = `flex w-full items-center gap-2.5 px-3 py-2.5 text-sm transition ${
              active ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`;
            return (
              <li key={item.code}>
                {active ? (
                  <span aria-current="true" className={itemClass}>
                    <span className="text-base leading-none">{item.flag}</span>
                    <span lang={item.code}>{item.label}</span>
                  </span>
                ) : (
                  <Link
                    href={alternatePath(pathname, item.code)}
                    hrefLang={item.code}
                    lang={item.code}
                    prefetch={false}
                    onClick={() => {
                      reachGoal(GOALS.langSwitch, { lang: item.code });
                      setOpen(false);
                    }}
                    className={itemClass}
                  >
                    <span className="text-base leading-none">{item.flag}</span>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
