import { after, type NextRequest } from "next/server";
import ru from "@/locales/ru.json";
import { OTHER_SERVICE, parseContact } from "@/lib/contactSchema";
import type { ServiceSlug } from "@/lib/services";

// Leads go to Telegram and by email. The hosting blocks outbound SMTP ports,
// so mail goes out through Resend's HTTPS API.

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

// Telegram is the shaky channel from this server: connections to api.telegram.org
// fail in streaks of up to about ten seconds (the first tries after a quiet period,
// measured on 04.10.2026), while the mail API answers every time. So every attempt
// has a time limit, a channel keeps trying with pauses for a while (long enough to
// outlast a streak), and the visitor is answered as soon as ONE channel has the
// lead; the other one carries on after that.
type Attempts = { windowMs: number; attemptMs: number; pauseMs: number };
const TELEGRAM: Attempts = { windowMs: 20000, attemptMs: 3000, pauseMs: 2000 };
const EMAIL: Attempts = { windowMs: 15000, attemptMs: 8000, pauseMs: 1000 };

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// What went wrong, with the network code (ETIMEDOUT and the like) that fetch
// keeps in `cause`.
function reason(error: unknown) {
  if (!(error instanceof Error)) return String(error);
  const code = (error.cause as { code?: string } | undefined)?.code;
  return code ? `${error.message} (${code})` : error.message;
}

// One POST of JSON. A 429 or 5xx answer throws, so that deliver() tries again;
// any other refusal is final.
async function postJson(
  label: string,
  url: string,
  body: unknown,
  signal: AbortSignal,
  headers: Record<string, string> = {},
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
    signal,
  });
  if (response.ok) return true;
  const detail = (await response.text()).slice(0, 200);
  if (response.status === 429 || response.status >= 500) throw new Error(`${response.status} ${detail}`);
  console.error(`${label}:`, response.status, detail);
  return false;
}

// Runs one channel until the lead is through or its time window is used up.
// `send` throws when another try may help (the network, a timeout, a busy
// service) and returns false when the lead is refused for good. Never rejects,
// so it can go on in the background.
async function deliver(
  label: string,
  { windowMs, attemptMs, pauseMs }: Attempts,
  send: (signal: AbortSignal) => Promise<boolean>,
) {
  const giveUpAt = Date.now() + windowMs;
  for (let attempt = 1; ; attempt++) {
    try {
      const sent = await send(AbortSignal.timeout(attemptMs));
      if (sent && attempt > 1) console.log(`${label}: delivered on attempt ${attempt}`);
      return sent;
    } catch (error) {
      console.error(`${label}: attempt ${attempt} failed:`, reason(error));
    }
    if (Date.now() + pauseMs >= giveUpAt) return false;
    await sleep(pauseMs);
  }
}

// True the moment any channel has the lead, false once all of them have given up.
function anyDelivered(channels: Promise<boolean>[]) {
  return new Promise<boolean>((resolve) => {
    let pending = channels.length;
    for (const channel of channels) {
      channel.then((delivered) => {
        if (delivered) resolve(true);
        else if (--pending === 0) resolve(false);
      });
    }
  });
}

async function sendTelegram(lead: Lead, signal: AbortSignal) {
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

  return postJson(
    "telegram",
    `https://api.telegram.org/bot${token}/sendMessage`,
    { chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true },
    signal,
  );
}

async function sendEmail(lead: Lead, signal: AbortSignal) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEADS_EMAIL_TO;
  const from = process.env.LEADS_EMAIL_FROM;
  if (!key || !to || !from) return false;

  return postJson(
    "resend",
    "https://api.resend.com/emails",
    {
      from,
      to: [to],
      // Reply goes straight to the person who wrote (they may have left only a phone).
      ...(lead.email ? { reply_to: lead.email } : {}),
      // The chosen service goes into the subject, so the mailbox shows it at a glance.
      subject: `Заявка с сайта: ${lead.service ? `${lead.service} - ` : ""}${lead.name}`,
      text: `${lead.service ? `Услуга: ${lead.service}\n` : ""}Имя: ${lead.name}\n${lead.email ? `Email: ${lead.email}\n` : ""}${lead.phone ? `Телефон: ${lead.phone}\n` : ""}Согласие на обработку персональных данных: да\nОткуда: ${lead.page ?? "-"}\n\n${lead.message}`,
    },
    signal,
    { Authorization: `Bearer ${key}` },
  );
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
  // How long the form was open, measured by the visitor's own browser. Not a
  // timestamp compared with this server's clock: a phone whose clock runs
  // ahead would make a real visitor look like a bot and lose their request
  // while the form says "sent". A missing or odd value is not held against anyone.
  const openMs = Number(body.openMs);

  // Honeypot and speed traps: answer as if all went well, so bots learn nothing.
  const seconds = Number.isFinite(openMs) && openMs >= 0 ? openMs / 1000 : Infinity;
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
  // Both channels start now and retry on their own; whichever is still trying
  // when the answer goes out carries on after it.
  const telegram = deliver("telegram", TELEGRAM, (signal) => sendTelegram(lead, signal));
  const mail = deliver("email", EMAIL, (signal) => sendEmail(lead, signal));
  after(() => Promise.all([telegram, mail]));

  // One channel through is enough for the visitor; the other logs its own failure.
  if (!(await anyDelivered([telegram, mail]))) {
    console.error("lead lost, no channel available:", lead.email || lead.phone);
    return Response.json({ ok: false }, { status: 502 });
  }
  return Response.json({ ok: true });
}
