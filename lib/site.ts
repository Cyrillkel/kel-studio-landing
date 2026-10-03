// Search engines are allowed in (since 29.09). Flip to false to close the
// site again: it switches the robots meta tag, /robots.txt and the
// X-Robots-Tag header at once (app/layout.tsx, app/robots.ts, next.config.ts).
export const INDEXABLE = true;

export const SITE_URL = "https://kel.agency";
export const SITE_NAME = "KEL Studio";
export const CONTACT_EMAIL = "info@kel.agency";
export const TELEGRAM_URL = "https://t.me/io112";
// Shown in the footer and the mobile menu (tap to call, WhatsApp chat).
export const PHONE = "+7 999 219-35-01";
export const PHONE_URL = "tel:+79992193501";
export const WHATSAPP_URL = "https://wa.me/79992193501";

// Yandex Metrika counter (metrika.yandex.ru). Started by components/YandexMetrika.tsx.
export const YANDEX_METRIKA_ID = 113363027;

// Ownership codes from Yandex Webmaster and Google Search Console. Next turns
// them into the meta tags both panels look for.
export const VERIFICATION = {
  yandex: "7b7b35e4bbf56e1b",
  google: "jqW6WGmgGgiSqInsX8XOOkVM3VBunaDnPzEOokzf9FI",
};
