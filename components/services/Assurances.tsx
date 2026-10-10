"use client";

import { useTranslation } from "react-i18next";

// One pictogram per promise, in the order of servicePages.common.assurances.
const ICONS = [
  // Who we work with: a person next to an office building.
  <>
    <circle cx="6.5" cy="10.5" r="2.5" />
    <path d="M2 20v-1a4.5 4.5 0 0 1 9 0v1" />
    <path d="M14 20V5a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v15" />
    <path d="M17.5 8h.01M17.5 12h.01M17.5 16h.01" />
  </>,
  // No commitment: an open padlock.
  <>
    <rect x="4" y="11" width="16" height="10" rx="2.5" />
    <path d="M8 11V7.5a4 4 0 0 1 7.6-1.7" />
    <path d="M12 15v2" />
  </>,
];

// A line added to the list without a pictogram of its own gets a plain dot.
const FALLBACK = <circle cx="12" cy="12" r="2.5" />;

// Two short promises next to a button, to settle the usual hesitation before
// a request (who do you work with, am I committing to something). Each is a
// statement the site already makes elsewhere.
export default function Assurances({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const items = t("servicePages.common.assurances", { returnObjects: true }) as string[];
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-400 ${className}`}>
      {items.map((item, index) => (
        <li key={item} className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-5 w-5 shrink-0 text-violet-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {ICONS[index] ?? FALLBACK}
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
