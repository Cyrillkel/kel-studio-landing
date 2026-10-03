import { YANDEX_METRIKA_ID } from "./site";

// The `ym` function of the Yandex Metrika counter. Before the counter script
// arrives it is a stub that queues calls in `a` (see components/YandexMetrika.tsx).
export type Ym = ((id: number, method: string, ...args: unknown[]) => void) & {
  a?: unknown[];
  l?: number;
};

declare global {
  interface Window {
    ym?: Ym;
    dataLayer?: unknown[];
  }
}

// Goal identifiers sent from the site. Each needs a goal of the type
// "JavaScript event" with the same identifier in Metrika (Settings -> Goals).
export const GOALS = {
  // A request went through the contact form: the main conversion.
  formSent: "form_sent",
  // The visitor started filling the form in.
  formStart: "form_start",
  // A click on any "contact us" button or link (parameter `place`: where).
  ctaContact: "cta_contact",
  // A click on a link to Telegram.
  telegramClick: "telegram_click",
  // A click on a link to WhatsApp.
  whatsappClick: "whatsapp_click",
  // A tap on the phone number (starts a call on a phone).
  phoneClick: "phone_click",
  // A click on the email link (opens the visitor's mail app).
  emailClick: "email_click",
  // The language was switched (parameter `lang`).
  langSwitch: "lang_switch",
} as const;

// Does nothing when the counter is not running (local builds, preview hosts),
// so callers never need to check.
export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.ym?.(YANDEX_METRIKA_ID, "reachGoal", goal, params);
}
