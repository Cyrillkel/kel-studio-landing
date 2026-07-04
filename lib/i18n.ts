import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";

export const STORAGE_KEY = "kel-studio-language";
export const SUPPORTED_LANGUAGES = ["ru", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
    // Always start with "ru" on both server and the client's first render so
    // they match exactly. The actual stored preference (if any) is applied
    // client-side after hydration — see I18nProvider.
    lng: "ru",
    fallbackLng: "ru",
    interpolation: { escapeValue: false },
  });
}

export function changeLanguage(lng: SupportedLanguage) {
  i18n.changeLanguage(lng);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, lng);
  }
}

export default i18n;
