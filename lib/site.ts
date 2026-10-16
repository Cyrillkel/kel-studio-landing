import type { Lang } from "./lang";

// Search engines are allowed in (since 29.09). Flip to false to close the
// site again: it switches the robots meta tag, /robots.txt and the
// X-Robots-Tag header at once (lib/pageMetadata.ts, app/robots.ts, next.config.ts).
export const INDEXABLE = true;

export const SITE_URL = "https://kel.agency";
export const SITE_NAME = "KEL Studio";

// When the text or structure of the pages last changed, for <lastmod> in the
// sitemap. Set by hand: bump it when a page's content changes. A build-time
// date would claim every page changed on every deploy, and search engines then
// stop trusting the field.
export const CONTENT_UPDATED = "2026-10-16";

// The home page's title and description in each language: the <title> and meta
// tags (lib/pageMetadata.ts) and the
// description of the company in the structured data.
export const SITE_TEXT: Record<Lang, { title: string; description: string }> = {
  ru: {
    title: "Разработка сайтов под ключ и digital-продуктов | KEL Studio",
    description:
      "Веб-студия полного цикла KEL Studio: разработка сайтов, дизайн, продвижение и создание digital-продуктов для бизнеса. Создаём решения под задачи вашего проекта",
  },
  en: {
    title: "Turnkey Website and Digital Product Development | KEL Studio",
    description:
      "KEL Studio is a full-cycle web studio: website development, design, SEO and promotion, Telegram bots and digital products for business.",
  },
};
export const SITE_TITLE = SITE_TEXT.ru.title;
export const SITE_DESCRIPTION = SITE_TEXT.ru.description;

export const CONTACT_EMAIL = "info@kel.agency";
export const TELEGRAM_URL = "https://t.me/io112";
// The studio's Telegram channel (blog author block, blog footer, structured data).
export const TELEGRAM_CHANNEL_URL = "https://t.me/kel_studio";
// Shown in the footer and the mobile menu (tap to call, WhatsApp chat).
export const PHONE = "+7 999 219-35-01";
export const PHONE_URL = "tel:+79992193501";
export const WHATSAPP_URL = "https://wa.me/79992193501";

// Yandex Metrika counter (metrika.yandex.ru). Started by components/YandexMetrika.tsx.
export const YANDEX_METRIKA_ID = 113363027;

// Ownership codes from Yandex Webmaster, Google Search Console and Dzen. Next
// turns them into the meta tags the panels look for (`other` is for the ones
// Next has no named field for: Dzen wants <meta name="zen-verification">).
export const VERIFICATION = {
  yandex: "7b7b35e4bbf56e1b",
  google: "jqW6WGmgGgiSqInsX8XOOkVM3VBunaDnPzEOokzf9FI",
  other: {
    "zen-verification": "7KA3pzKKSgauZmh4OoFv4jiUXZ5mg2gH4bvCVlaSHHRcujUFPcvIIgwxcIzguSfB",
  },
};
