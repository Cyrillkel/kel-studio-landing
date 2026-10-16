"use client";

import { I18nextProvider } from "react-i18next";
import { i18nEn } from "@/lib/i18n/en";

export default function I18nProviderEn({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18nEn}>{children}</I18nextProvider>;
}
