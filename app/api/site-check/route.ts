// POST /api/site-check {url, lang}: the on-page website check (lib/sitecheck.ts).
// Passes the request to the checks service of the Pulse bot on this server and
// keeps the limits per visitor, so the page cannot be used to hammer other
// people's sites: a few checks in ten minutes, a few dozen a day.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const WINDOW_MS = 10 * 60_000;
const PER_WINDOW = 8;
const PER_DAY = 40;
const DAY_MS = 24 * 3600_000;

// Check times by visitor address, in this process's memory.
const hits = new Map<string, number[]>();

// Seconds until the next check is allowed, or 0 when it is allowed now.
function wait(ip: string, now: number): number {
  const times = (hits.get(ip) ?? []).filter((at) => now - at < DAY_MS);
  const recent = times.filter((at) => now - at < WINDOW_MS);
  if (recent.length >= PER_WINDOW) return Math.ceil((recent[0]! + WINDOW_MS - now) / 1000);
  if (times.length >= PER_DAY) return Math.ceil((times[0]! + DAY_MS - now) / 1000);
  times.push(now);
  hits.set(ip, times);
  // Old visitors drop out now and then, so the map does not grow for ever.
  if (hits.size > 5000) for (const [key, list] of hits) if (now - list[list.length - 1]! > DAY_MS) hits.delete(key);
  return 0;
}

export async function POST(request: Request) {
  // nginx sets X-Real-IP from the connection itself; X-Forwarded-For can be written by the visitor.
  const ip = request.headers.get("x-real-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  let url = "";
  let lang = "ru";
  try {
    const body = (await request.json()) as { url?: unknown; lang?: unknown };
    url = typeof body.url === "string" ? body.url.trim().slice(0, 300) : "";
    lang = body.lang === "en" ? "en" : "ru";
  } catch {
    return Response.json({ ok: false, error: "not-url" }, { status: 400 });
  }
  if (!url) return Response.json({ ok: false, error: "not-url" });

  const retryAfter = wait(ip, Date.now());
  if (retryAfter > 0) {
    return Response.json({ ok: false, error: "rate-limited", retryAfter }, { status: 429, headers: { "retry-after": String(retryAfter) } });
  }

  const key = process.env.PULSE_API_KEY;
  try {
    const res = await fetch(`${process.env.PULSE_API_URL ?? "http://127.0.0.1:3200"}/check`, {
      method: "POST",
      headers: { "content-type": "application/json", ...(key ? { "x-pulse-key": key } : {}) },
      body: JSON.stringify({ url, lang }),
      signal: AbortSignal.timeout(60_000),
      cache: "no-store",
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    // A wrong or unknown address is an answer for the visitor, not a failed
    // request: it comes back as 200, so the browser does not log an error.
    const answered = data.ok || ["not-url", "blocked", "not-found"].includes(data.error ?? "");
    return Response.json(data, { status: answered ? 200 : res.status, headers: { "cache-control": "no-store" } });
  } catch {
    return Response.json({ ok: false, error: "unavailable" }, { status: 503 });
  }
}
