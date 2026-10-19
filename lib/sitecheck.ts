// The free on-page website check (/site-check). The checks themselves run in the
// Pulse bot's service on the same server (the kel-pulse project, src/api.ts);
// the site's API route (app/api/site-check) passes requests to it and keeps the
// per-visitor limits. Plain types with no imports, so client components can use them.
export const SITE_CHECK_PATH = "/site-check";

export type FindingLevel = "critical" | "warning" | "info";

// The answer of the checks service, as src/api.ts in kel-pulse builds it.
export type CheckResult = {
  ok: true;
  host: string;
  url: string;
  finalUrl?: string;
  checkedAt: number;
  availability: { ok: boolean; restricted: boolean; status?: number; ms?: number; reason?: string };
  https: boolean;
  tls: { validTo?: number; daysLeft?: number; issuer?: string; problem?: string } | null;
  domain: { name: string; expiresAt?: number; daysLeft?: number } | null;
  indexing: { noindex: boolean; robotsFound: boolean; blockedFor: string[]; sitemapFound: boolean } | null;
  page: { title?: string; description: boolean; h1: number; viewport: boolean } | null;
  findings: { key: string; level: FindingLevel; text: string }[];
};

export type CheckErrorCode = "not-url" | "blocked" | "not-found" | "rate-limited" | "busy" | "unavailable" | "failed";
