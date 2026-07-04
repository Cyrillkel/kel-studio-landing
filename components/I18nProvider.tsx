"use client";

import { useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n, {
  STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  type SupportedLanguage,
} from "@/lib/i18n";

export default function I18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (
      stored &&
      (SUPPORTED_LANGUAGES as readonly string[]).includes(stored) &&
      stored !== i18n.language
    ) {
      i18n.changeLanguage(stored as SupportedLanguage);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
