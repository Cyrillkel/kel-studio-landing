"use client";

import { I18nextProvider } from "react-i18next";
import { i18nRu } from "@/lib/i18n/ru";

// Gives the components of a Russian page their texts. A separate provider for
// each language, so that a page carries only its own language's texts.
export default function I18nProviderRu({ children }: { children: React.ReactNode }) {
  return <I18nextProvider i18n={i18nRu}>{children}</I18nextProvider>;
}
