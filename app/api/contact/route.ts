import type { NextRequest } from "next/server";
import ru from "@/locales/ru.json";
import { OTHER_SERVICE, parseContact } from "@/lib/contactSchema";
import type { ServiceSlug } from "@/lib/services";

// Leads go to Telegram (instant) and by email as a copy. The hosting blocks
// outbound SMTP ports, so mail goes out through Resend's HTTPS API.

type Lead = {
  name: string;
  email: string;
  phone: string;
  message: string;
  // Russian name of the chosen service (the owner reads the lead in Russian
  // whatever language the visitor used), or empty.
  service: string;
  page?: string;
};

const serviceName = (value: string) =>
  value === OTHER_SERVICE ? "Другое" : value ? ru.servicePages.items[value as ServiceSlug].name : "";

// Nobody writes a real request in under three seconds; bots submit instantly.
const MIN_SECONDS = 3;
const MAX_LINKS = 2;
// Generous enough for an office or a phone behind NAT, where many people
// share one address.
const RATE = { windowMs: 60 * 60 * 1000, max: 15 };

// Single instance, so an in-memory window is enough.
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const fresh = (hits.get(ip) ?? []).filter((time) => now - time < RATE.windowMs);
  fresh.push(now);
  hits.set(ip, fresh);
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (!times.some((time) => now - time < RATE.windowMs)) hits.delete(key);
    }
  }
  return fresh.length > RATE.max;
}

const escapeHtml = (text: string) =>
  text.replace(/[&<>]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[char]!);

async function sendTelegram(lead: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) return false;

  const text = [
    "<b>Новая заявка с сайта</b>",
    lead.service ? `<b>Услуга:</b> ${escapeHtml(lead.service)}` : "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    lead.email ? `<b>Email:</b> ${escapeHtml(lead.email)}` : "",
    lead.phone ? `<b>Телефон:</b> ${escapeHtml(lead.phone)}` : "",
    "Согласие на обработку персональных данных: да",
    lead.page ? `<b>Откуда:</b> ${escapeHtml(lead.page)}` : "",
    "",
    escapeHtml(lead.message),
  ]
    .filter(Boolean)
    .join("\n");

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chat,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!response.ok) console.error("telegram:", response.status, await response.text());
  return response.ok;
}

async function sendEmail(lead: Lead) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_EMAIL_TO;
  const from = process.env.LEADS_EMAIL_FROM;
  if (!key || !to || !from) return false;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      // Reply goes straight to the person who wrote (they may have left only a phone).
      ...(lead.email ? { reply_to: lead.email } : {}),
      // The chosen service goes into the subject, so the mailbox shows it at a glance.
      subject: `Заявка с сайта: ${lead.service ? `${lead.service} - ` : ""}${lead.name}`,
      text: `${lead.service ? `Услуга: ${lead.service}\n` : ""}Имя: ${lead.name}\n${lead.email ? `Email: ${lead.email}\n` : ""}${lead.phone ? `Телефон: ${lead.phone}\n` : ""}Согласие на обработку персональных данных: да\nОткуда: ${lead.page ?? "-"}\n\n${lead.message}`,
    }),
  });
  if (!response.ok) console.error("resend:", response.status, await response.text());
  return response.ok;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const company = String(body.company ?? "").trim();
  const message = String(body.message ?? "");
  const startedAt = Number(body.startedAt ?? 0);

  // Honeypot and speed traps: answer as if all went well, so bots learn nothing.
  const seconds = startedAt ? (Date.now() - startedAt) / 1000 : Infinity;
  const links = (message.match(/https?:\/\//gi) ?? []).length;
  if (company || seconds < MIN_SECONDS || links > MAX_LINKS) {
    return Response.json({ ok: true });
  }

  // Same rules as the form, so a crafted request cannot skip them.
  const fields = parseContact(body);
  if (!fields) return Response.json({ ok: false }, { status: 400 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false }, { status: 429 });

  // Trusted from the form, but it still ends up in a message: keep it short.
  const page = String(body.page ?? "").trim().slice(0, 200);
  const lead: Lead = { ...fields, service: serviceName(fields.service), page };
  const [telegram, mail] = await Promise.all([sendTelegram(lead), sendEmail(lead)]);

  // One channel through is enough for the visitor; the other is logged above.
  if (!telegram && !mail) {
    console.error("lead lost, no channel available:", lead.email || lead.phone);
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
