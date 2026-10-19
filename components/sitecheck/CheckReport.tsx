"use client";

import { useTranslation } from "react-i18next";
import ContactModal from "@/components/ContactModal";
import PulseButton from "@/components/pulse/PulseButton";
import { useLang } from "@/components/useLang";
import type { CheckResult, FindingLevel } from "@/lib/sitecheck";

type Tone = "good" | "warn" | "bad" | "none";

const TONE: Record<Tone, string> = {
  good: "bg-emerald-400",
  warn: "bg-amber-400",
  bad: "bg-rose-400",
  none: "bg-gray-500",
};

const LEVEL: Record<FindingLevel, string> = {
  critical: "border-rose-400/40 bg-rose-400/10 text-rose-400",
  warning: "border-amber-400/40 bg-amber-400/10 text-amber-400",
  info: "border-white/15 bg-white/5 text-gray-400",
};

function Card({ label, tone, title, detail }: { label: string; tone: Tone; title: string; detail?: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-5">
      <p className="flex items-center gap-2 text-sm text-gray-400">
        <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${TONE[tone]}`} />
        {label}
      </p>
      <p className="mt-3 font-heading text-lg leading-snug font-bold text-white">{title}</p>
      {detail && <p className="mt-1 text-sm leading-relaxed text-gray-400">{detail}</p>}
    </div>
  );
}

// The result of one check: a verdict, four cards (uptime, certificate, domain,
// search), the issues worst first, and what to do next (watch it with the bot,
// or ask us to fix it).
export default function CheckReport({ result, onAgain }: { result: CheckResult; onAgain: () => void }) {
  const { t } = useTranslation();
  const lang = useLang();
  const r = (key: string, options?: Record<string, unknown>) => t(`siteCheck.report.${key}`, options);
  const locale = lang === "ru" ? "ru-RU" : "en-US";
  const date = (time: number) =>
    new Intl.DateTimeFormat(locale, lang === "ru"
      ? { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Moscow" }
      : { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Moscow" }).format(time);
  const plural = new Intl.PluralRules(locale);
  const days = (n: number) => {
    const form = plural.select(n);
    return `${n} ${t(`siteCheck.days.${form === "one" ? "one" : form === "few" ? "few" : "many"}`)}`;
  };
  const seconds = (ms: number) => (ms / 1000).toFixed(2).replace(".", lang === "ru" ? "," : ".");

  const { availability: up, tls, domain, indexing } = result;
  // The outage is in the first card; the list does not repeat it.
  const findings = result.findings.filter((f) => f.key !== "unreachable");
  const critical = !up.ok && !up.restricted ? 1 : findings.filter((f) => f.level === "critical").length;
  const warnings = findings.filter((f) => f.level === "warning").length;
  const verdict: { tone: Tone; text: string } = critical
    ? { tone: "bad", text: r("verdictBad") }
    : warnings
      ? { tone: "warn", text: r("verdictWarn") }
      : { tone: "good", text: r("verdictOk") };

  const upCard = up.ok
    ? { tone: "good" as Tone, title: r("up"), detail: up.status && up.ms !== undefined ? r("upDetail", { status: up.status, seconds: seconds(up.ms) }) : undefined }
    : up.restricted
      ? { tone: "warn" as Tone, title: r("restricted"), detail: up.status ? r("restrictedDetail", { status: up.status }) : undefined }
      : { tone: "bad" as Tone, title: r("down"), detail: up.reason };

  const sslCard = !result.https && !tls
    ? { tone: "bad" as Tone, title: r("sslNone"), detail: r("sslNoneDetail") }
    : tls?.problem
      ? { tone: "bad" as Tone, title: r("sslProblem"), detail: tls.problem }
      : tls?.validTo !== undefined
        ? {
            tone: (tls.daysLeft ?? 0) < 14 ? ("warn" as Tone) : ("good" as Tone),
            title: r("sslOk", { date: date(tls.validTo) }),
            detail: r("sslLeft", { days: days(tls.daysLeft ?? 0) }),
          }
        : { tone: "none" as Tone, title: r("indexUnknown") };

  const domainCard = !domain
    ? { tone: "none" as Tone, title: r("domainNone"), detail: r("domainNoneDetail") }
    : domain.expiresAt !== undefined
      ? {
          tone: domain.expiresAt < result.checkedAt ? ("bad" as Tone) : (domain.daysLeft ?? 0) < 30 ? ("warn" as Tone) : ("good" as Tone),
          title: r("domainOk", { date: date(domain.expiresAt) }),
          detail: r("domainLeft", { name: domain.name, days: days(domain.daysLeft ?? 0) }),
        }
      : { tone: "none" as Tone, title: r("domainUnknown"), detail: domain.name };

  const searchCard = !indexing
    ? { tone: "none" as Tone, title: r("indexUnknown") }
    : {
        tone: indexing.noindex || indexing.blockedFor.length > 0 ? ("bad" as Tone) : ("good" as Tone),
        title: indexing.noindex ? r("indexNoindex") : indexing.blockedFor.length > 0 ? r("indexRobots") : r("indexOpen"),
        detail: indexing.sitemapFound ? r("sitemapYes") : r("sitemapNo"),
      };

  return (
    <div className="mt-10 text-left">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 tabIndex={-1} id="check-report" className="font-heading text-2xl font-bold text-white outline-none sm:text-3xl">
          {r("title", { host: result.host })}
        </h2>
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-semibold text-white">
          <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full ${TONE[verdict.tone]}`} />
          {verdict.text}
        </span>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card label={r("availability")} {...upCard} />
        <Card label={r("ssl")} {...sslCard} />
        <Card label={r("domain")} {...domainCard} />
        <Card label={r("indexing")} {...searchCard} />
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6">
        <h3 className="font-heading text-lg font-bold text-white">{r("findingsTitle")}</h3>
        {findings.length > 0 ? (
          <ul className="mt-4 space-y-3">
            {findings.map((finding) => (
              <li key={finding.key} className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                <span className={`inline-flex w-fit shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-semibold sm:mt-0.5 sm:w-36 sm:justify-center ${LEVEL[finding.level]}`}>
                  {r(`levels.${finding.level}`)}
                </span>
                <span className="leading-relaxed text-gray-200">{finding.text}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-gray-300">{indexing ? r("noFindings") : r("notChecked")}</p>
        )}
        {findings.length > 0 && !indexing && <p className="mt-4 text-sm text-gray-400">{r("notChecked")}</p>}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-2xl bg-linear-to-br from-cyan-400 via-violet-500 to-fuchsia-500 p-px">
          <div className="flex h-full flex-col rounded-[15px] bg-card p-5 sm:p-6">
            <h3 className="font-heading text-lg font-bold text-white">{r("watchTitle")}</h3>
            <p className="mt-2 leading-relaxed text-gray-300">{r("watchText", { host: result.host })}</p>
            <div className="mt-5">
              <PulseButton source={lang === "en" ? "site_check_en" : "site_check"} place="Анализ сайта, отчёт" size="md">
                {r("watchCta")}
              </PulseButton>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/3 p-5 sm:p-6">
          <h3 className="font-heading text-lg font-bold text-white">{r("helpTitle")}</h3>
          <p className="mt-2 leading-relaxed text-gray-300">{r("helpText")}</p>
          <div className="mt-auto pt-5">
            <ContactModal place="Анализ сайта, отчёт" size="md" variant="outline">
              {r("helpCta")}
            </ContactModal>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={onAgain}
        className="mt-6 cursor-pointer text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
      >
        {r("again")}
      </button>
    </div>
  );
}
