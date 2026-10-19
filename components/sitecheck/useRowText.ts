"use client";

import { useTranslation } from "react-i18next";
import { useLang } from "@/components/useLang";
import type { CheckRow } from "@/lib/sitecheck";

const ENCODINGS: Record<string, string> = { br: "Brotli", gzip: "Gzip", "x-gzip": "Gzip", deflate: "Deflate", zstd: "Zstandard" };

export type RowText = { label: string; value: string; hint?: string };

// Turns a row of the report into words: siteCheck.rows.<id>.label, then the
// value and the advice of its case, with the data formatted for the language
// (dates in Moscow time, sizes in KB, plurals by i18next). A context picks a
// variant of the value where the data asks for one (HTTP/3 next to HTTP/2 ...).
// Returns null for a row the texts do not know yet (a newer bot than the site).
export function useRowText(): (row: CheckRow) => RowText | null {
  const { t, i18n } = useTranslation();
  const lang = useLang();
  const locale = lang === "ru" ? "ru-RU" : "en-US";

  const date = (time: number) =>
    new Intl.DateTimeFormat(
      locale,
      lang === "ru"
        ? { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Moscow" }
        : { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Moscow" },
    ).format(time);
  const decimal = (value: number, digits: number) =>
    new Intl.NumberFormat(locale, { minimumFractionDigits: digits, maximumFractionDigits: digits }).format(value);
  const days = (n: number) => t("siteCheck.report.days", { count: n });
  const size = (bytes: number) =>
    bytes >= 1_000_000
      ? t("siteCheck.report.mb", { value: decimal(bytes / 1_000_000, 1) })
      : t("siteCheck.report.kb", { value: decimal(Math.max(1, Math.round(bytes / 1000)), 0) });
  const list = (items: unknown) => (Array.isArray(items) ? items.join(", ") : "");
  const engines = (items: unknown) => {
    const names = (Array.isArray(items) ? items : []).map((name) => t(`siteCheck.report.engines.${name}`));
    return names.length > 1 ? `${names.slice(0, -1).join(", ")} ${t("siteCheck.report.engines.and")} ${names.at(-1)}` : (names[0] ?? "");
  };
  const reason = (data: CheckRow["data"]) => {
    if (data?.error) return t(`siteCheck.reasons.${data.error}`, { defaultValue: t("siteCheck.reasons.network") });
    const status = Number(data?.status ?? 0);
    return i18n.exists(`siteCheck.reasons.${status}`) ? t(`siteCheck.reasons.${status}`) : t("siteCheck.reasons.status", { status });
  };

  return (row) => {
    const base = `siteCheck.rows.${row.id}`;
    if (!i18n.exists(`${base}.label`) || !i18n.exists(`${base}.${row.case}`)) return null;
    const data = row.data ?? {};
    const vars: Record<string, unknown> = { ...data };
    let context: string | undefined;

    if (typeof data.validTo === "number") vars.date = date(data.validTo);
    if (typeof data.expiresAt === "number") vars.date = date(data.expiresAt);
    if (typeof data.days === "number") vars.days = days(data.days);

    switch (row.id) {
      case "open":
        if (row.case === "down") vars.reason = reason(data);
        break;
      case "speed":
        vars.seconds = decimal(Number(data.ms ?? 0) / 1000, 2);
        break;
      case "http2":
        if (data.h3) context = "h3";
        break;
      case "compression":
        vars.encoding = ENCODINGS[String(data.encoding)] ?? String(data.encoding ?? "");
        vars.size = size(Number(data.size ?? 0));
        if (typeof data.bytes === "number") vars.bytes = size(data.bytes);
        break;
      case "ssl":
        if (row.case === "invalid") vars.reason = t(`siteCheck.tlsReasons.${data.reason}`, { defaultValue: t("siteCheck.tlsReasons.other") });
        if (row.case === "valid" && data.issuer) context = "issuer";
        break;
      case "hsts":
        if (row.case === "short" && data.days === 0) context = "hours";
        break;
      case "headers":
        vars.missing = list(data.missing);
        break;
      case "versions":
        vars.list = list(data.list);
        break;
      case "mail":
        if (row.case === "no-spf" && !data.dmarc) context = "nodmarc";
        break;
      case "robots":
        if (row.case === "blocks") vars.engines = engines(data.engines);
        break;
      case "sitemap":
        if (typeof data.entries === "number") {
          context = data.index ? "index" : "urls";
          vars.count = data.entries;
        }
        break;
      case "title":
      case "description":
        if (typeof data.length === "number") vars.count = data.length;
        break;
      case "h1":
        if (row.case === "ok" && !data.text) context = "notext";
        break;
      case "og":
        if (!data.title) context = "notitle";
        break;
      case "schema":
        vars.types = list(data.types);
        break;
      case "alt":
        if (row.case === "ok") vars.count = data.images;
        break;
    }

    const key = `${base}.${row.case}`;
    return {
      label: t(`${base}.label`),
      value: t(`${key}.value`, { ...vars, context }),
      hint: i18n.exists(`${key}.hint`) ? t(`${key}.hint`, vars) : undefined,
    };
  };
}
