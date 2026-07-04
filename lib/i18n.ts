import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ru from "@/locales/ru.json";
import en from "@/locales/en.json";

export const STORAGE_KEY = "kel-studio-language";
export const SUPPORTED_LANGUAGES = ["ru", "en"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

function getInitialLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "ru";
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && (SUPPORTED_LANGUAGES as readonly string[]).includes(stored)
    ? (stored as SupportedLanguage)
    : "ru";
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      ru: { translation: ru },
      en: { translation: en },
    },
    lng: getInitialLanguage(),
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
