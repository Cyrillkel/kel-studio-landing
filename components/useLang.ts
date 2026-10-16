import { useTranslation } from "react-i18next";
import type { Lang } from "@/lib/lang";
import { localizePath } from "@/lib/routes";

// The language of the page the component sits on: the translator of the page
// is fixed to one language (see lib/i18n/create.ts).
export function useLang(): Lang {
  const { i18n } = useTranslation();
  return i18n.language === "en" ? "en" : "ru";
}

// Turns a Russian-structure address ("/services", "/#contact") into the one
// for the page's language.
export function useLocalePath() {
  const lang = useLang();
  return (path: string) => localizePath(path, lang);
}
