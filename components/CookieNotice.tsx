"use client";

import { useSyncExternalStore } from "react";
import { Trans, useTranslation } from "react-i18next";

const KEY = "kel-cookie-notice";

// The choice lives in localStorage. If the browser blocks storage, the notice
// is still hidden for the rest of the visit.
let dismissedThisVisit = false;
const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const isDismissed = () => {
  if (dismissedThisVisit) return true;
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

const dismiss = () => {
  dismissedThisVisit = true;
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // Storage is blocked: the module flag above is enough for this visit.
  }
  listeners.forEach((listener) => listener());
};

// A short notice that the site uses cookies (Yandex Metrika sets them). The
// server renders nothing; after hydration it shows up unless it was already
// accepted. The text is deliberately brief: a big block of text here could
// become the page's largest paint and slow down its measured load time.
export default function CookieNotice() {
  const { t } = useTranslation();
  const dismissed = useSyncExternalStore(subscribe, isDismissed, () => true);

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label={t("cookies.label")}
      className="cookie-notice fixed inset-x-3 bottom-3 z-30 flex flex-col gap-3 rounded-2xl border border-white/10 bg-[#141018]/95 p-4 shadow-2xl shadow-black/60 backdrop-blur-md sm:bottom-6 sm:left-auto sm:right-6 sm:max-w-md sm:flex-row sm:items-center sm:gap-4"
    >
      <p className="text-balance text-[13px] leading-snug text-gray-300">
        <Trans
          i18nKey="cookies.text"
          components={{
            policy: (
              <a
                href="/privacy"
                className="text-violet-300 underline underline-offset-2 transition-colors hover:text-white"
              />
            ),
          }}
        />
      </p>
      <button
        type="button"
        onClick={dismiss}
        className="shrink-0 cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-gray-200 active:scale-95"
      >
        {t("cookies.accept")}
      </button>
    </div>
  );
}
