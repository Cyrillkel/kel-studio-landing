import i18next from "i18next";
import type { Lang } from "../lang";

// One translator per language, fixed for the page: the language of a page is
// its address, never a setting that changes while the page is open. The texts
// are given inline, so init finishes at once and the first render already has them.
export function createI18n(lng: Lang, translation: Record<string, unknown>) {
  const instance = i18next.createInstance();
  instance.init({
    resources: { [lng]: { translation } },
    lng,
    fallbackLng: false,
    interpolation: { escapeValue: false },
  });
  return instance;
}
