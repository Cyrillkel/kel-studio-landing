"use client";

import { useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { applyTheme, getTheme, subscribeTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

// Round glass button in the header, the same size and look as the burger and
// the contact buttons. It shows the theme it switches to; which of the two
// icons is visible is decided by CSS from <html data-theme> (globals.css), so
// it is right before React is even loaded. Only the label needs the state.
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { t } = useTranslation();
  // The server (and the first client render) assume dark, as the page does by
  // default; the real value follows at once.
  const theme = useSyncExternalStore(subscribeTheme, getTheme, () => "dark" as const);
  const label = t(theme === "dark" ? "theme.toLight" : "theme.toDark");

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={() => applyTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "theme-toggle relative flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors duration-200 hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
        className
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-sun h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="theme-moon h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    </button>
  );
}
