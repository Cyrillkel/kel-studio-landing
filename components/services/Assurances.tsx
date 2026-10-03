"use client";

import { useTranslation } from "react-i18next";

// Three short promises next to a button, to settle the usual hesitation before
// a request (what will it cost, who do you work with, am I committing to
// something). Each is a statement the site already makes elsewhere.
export default function Assurances({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  const items = t("servicePages.common.assurances", { returnObjects: true }) as string[];
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400 ${className}`}>
      {items.map((item) => (
        <li key={item} className="flex items-center gap-2">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 shrink-0 text-violet-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m5 12 5 5 9-10" />
          </svg>
          {item}
        </li>
      ))}
    </ul>
  );
}
