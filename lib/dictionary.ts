import ru from "@/locales/ru.json";
import en from "@/locales/en.json";
import type { Lang } from "./lang";

// The texts of the site, for code that runs on the server (page metadata,
// structured data, the blog pages). Client components do not import this file:
// they get the texts of their page's language from react-i18next, and importing
// both dictionaries here would put them into the browser bundle.
//
// The two files have the same keys (tools/i18n-check/check_keys.py), so one type serves both.
export type Dictionary = typeof ru;

export const getDictionary = (lang: Lang): Dictionary => (lang === "en" ? (en as unknown as Dictionary) : ru);
