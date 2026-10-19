// The free on-page website check (/site-check). The checks themselves run in the
// Pulse bot's service on the same server (the kel-pulse project, src/api.ts and
// src/checklist.ts); the site's API route (app/api/site-check) passes requests
// to it and keeps the per-visitor limits. Plain types with no imports, so client
// components can use them.
export const SITE_CHECK_PATH = "/site-check";

// ok: passed. critical, warning, info: the issue levels ("Важно", "Стоит
// поправить", "Хорошо бы"). none: a plain fact, not a verdict.
export type RowStatus = "ok" | "critical" | "warning" | "info" | "none";

export type RowGroup = "access" | "security" | "domain" | "search" | "geo" | "page";

export const ROW_GROUPS: RowGroup[] = ["access", "security", "domain", "search", "geo", "page"];

// One row of the report. The service sends no words: `case` picks the text in
// siteCheck.rows.<id>.<case> of the locales, and `data` fills it in.
export type CheckRow = {
  id: string;
  group: RowGroup;
  status: RowStatus;
  case: string;
  data?: Record<string, string | number | boolean | string[]>;
};

// The answer of the checks service, as src/api.ts in kel-pulse builds it.
export type CheckResult = {
  ok: true;
  host: string;
  url: string;
  finalUrl?: string;
  checkedAt: number;
  tookMs: number;
  // The home page loaded and was read; without it the search and page rows are missing.
  pageLoaded: boolean;
  rows: CheckRow[];
};

export type CheckErrorCode = "not-url" | "blocked" | "not-found" | "rate-limited" | "busy" | "unavailable" | "failed";

// The site's name from what someone typed: "https://Example.ru/page" is
// example.ru. Cyrillic names stay Cyrillic (URL would turn them into xn--).
export function typedHost(input: string): string {
  const host = input.trim().replace(/^[a-z][a-z0-9+.-]*:\/\//i, "").split(/[/?#]/)[0] ?? "";
  return host.replace(/:\d+$/, "").replace(/\.$/, "").toLowerCase() || input.trim();
}
