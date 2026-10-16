// Fills {{name}} placeholders of a text from the locale files, for the server
// code that reads those files directly (client components use i18next).
export const fill = (template: string, vars: Record<string, string | number>) =>
  template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => String(vars[key] ?? ""));

// "Лендинги" -> "лендинги", "Landing pages" -> "landing pages", but "SEO-аудит",
// "SEO audit", "Telegram-боты" and "WordPress websites" stay as they are: only a
// capitalized ordinary word is lowered, so names and abbreviations keep their capitals.
const NAMES = new Set(["Telegram", "Yandex", "Google", "React", "Next"]);
export function lowerFirstWord(text: string, lang: "ru" | "en"): string {
  if (lang === "ru") return /^[А-ЯЁ][а-яё]/.test(text) ? text[0].toLowerCase() + text.slice(1) : text;
  const first = text.split(/[\s-]/)[0];
  return /^[A-Z][a-z]+$/.test(first) && !NAMES.has(first) ? text[0].toLowerCase() + text.slice(1) : text;
}
