"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { flushSync } from "react-dom";
import { useTranslation } from "react-i18next";
import ContactModal from "@/components/ContactModal";
import PulseButton from "@/components/pulse/PulseButton";
import { useLang } from "@/components/useLang";
import { GOALS, reachGoal } from "@/lib/metrika";
import { PULSE_BOT, pulseBotUrl } from "@/lib/pulse";
import { CONTACT_EMAIL, SITE_URL, TELEGRAM_URL } from "@/lib/site";
import { ROW_GROUPS, type CheckResult, type CheckRow, type RowStatus } from "@/lib/sitecheck";
import { useRowText, type RowText } from "./useRowText";

type Filter = "all" | "issues" | "ok";
type Shown = { row: CheckRow; text: RowText };

const ISSUES: RowStatus[] = ["critical", "warning", "info"];

// Colours of a status: the mark, the label and the tint of a row with an issue.
const TONE: Record<RowStatus, { text: string; mark: string; row: string; stroke: string }> = {
  ok: { text: "text-emerald-400", mark: "bg-emerald-400/15 text-emerald-400", row: "", stroke: "stroke-emerald-400" },
  critical: { text: "text-rose-400", mark: "bg-rose-400/15 text-rose-400", row: "bg-rose-400/[0.05]", stroke: "stroke-rose-400" },
  warning: { text: "text-amber-400", mark: "bg-amber-400/15 text-amber-400", row: "bg-amber-400/[0.04]", stroke: "stroke-amber-400" },
  info: { text: "text-violet-300", mark: "bg-violet-400/15 text-violet-300", row: "", stroke: "stroke-violet-400" },
  none: { text: "text-gray-400", mark: "bg-white/8 text-gray-400", row: "", stroke: "stroke-gray-400" },
};

const MARKS: Record<RowStatus, string> = {
  ok: "M5 12.5l4.5 4.5L19 7.5",
  critical: "M12 6.5v7M12 17.5h.01",
  warning: "M12 6.5v7M12 17.5h.01",
  info: "M12 10.5v7M12 6.5h.01",
  none: "M7.5 12h9",
};

function StatusMark({ status, className = "h-6 w-6" }: { status: RowStatus; className?: string }) {
  return (
    <span aria-hidden="true" className={`flex shrink-0 items-center justify-center rounded-full ${TONE[status].mark} ${className}`}>
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round">
        <path d={MARKS[status]} />
      </svg>
    </span>
  );
}

// How many checks passed, as a circle that fills up when the report appears.
function ScoreRing({ passed, total, status, label, caption }: { passed: number; total: number; status: RowStatus; label: string; caption: string }) {
  const radius = 44;
  const circle = 2 * Math.PI * radius;
  const offset = circle * (1 - (total ? passed / total : 0));
  return (
    <div role="img" aria-label={label} className="relative h-32 w-32 shrink-0">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" strokeWidth={7} className="stroke-white/10" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          strokeWidth={7}
          strokeLinecap="round"
          strokeDasharray={circle}
          strokeDashoffset={offset}
          className={`score-ring ${TONE[status].stroke}`}
          style={{ "--ring-empty": circle } as CSSProperties}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-bold text-white">
          {passed}
          <span className="text-lg text-gray-500">/{total}</span>
        </span>
        <span className="text-xs text-gray-400">{caption}</span>
      </div>
    </div>
  );
}

// The result of one check: how many checks passed and the verdict, then every
// check in a table by groups, issues first within a group (a click on an issue
// opens what it means and how to fix it); then what next (watch the site with
// the bot, or ask us to fix it).
// "Save as PDF" prints it: only the report, in the light theme, every row with
// its explanation, with our contacts at the end (print styles in globals.css).
export default function CheckReport({ result, onAgain }: { result: CheckResult; onAgain: () => void }) {
  const { t } = useTranslation();
  const lang = useLang();
  const describe = useRowText();
  const [filter, setFilter] = useState<Filter>("all");
  // Rows whose explanation is open: the table shows only the verdicts, a click
  // anywhere on a row opens what the issue means and how to fix it.
  const [opened, setOpened] = useState<string[]>([]);
  const toggle = (id: string) => {
    // Selecting text in an open explanation must not close it.
    if (window.getSelection()?.toString()) return;
    setOpened((ids) => (ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id]));
  };
  const r = (key: string, options?: Record<string, unknown>) => t(`siteCheck.report.${key}`, options);
  const locale = lang === "ru" ? "ru-RU" : "en-US";

  const shown: Shown[] = [];
  for (const row of result.rows) {
    const text = describe(row);
    if (text) shown.push({ row, text });
  }
  const count = (status: RowStatus) => shown.filter(({ row }) => row.status === status).length;
  const counts = { ok: count("ok"), critical: count("critical"), warning: count("warning"), info: count("info") };
  const judged = counts.ok + counts.critical + counts.warning + counts.info;
  const issues = counts.critical + counts.warning + counts.info;
  const worst: RowStatus = counts.critical ? "critical" : counts.warning ? "warning" : "ok";
  const verdict = counts.critical ? "bad" : counts.warning ? "warn" : counts.info ? "fine" : "ok";

  const open = result.rows.find((row) => row.id === "open");
  const notChecked = result.pageLoaded
    ? null
    : open?.status === "critical"
      ? "down"
      : open?.case === "restricted"
        ? "restricted"
        : "partial";

  const visible = (status: RowStatus) => (filter === "all" ? true : filter === "ok" ? status === "ok" : ISSUES.includes(status));
  const rank = (status: RowStatus) => ["critical", "warning", "info", "ok", "none"].indexOf(status);
  const groups = ROW_GROUPS.map((group) => {
    const all = shown.filter(({ row }) => row.group === group);
    const rows = all.filter(({ row }) => visible(row.status)).sort((a, b) => rank(a.row.status) - rank(b.row.status));
    const judgedHere = all.filter(({ row }) => row.status !== "none");
    return { group, rows, passed: judgedHere.filter(({ row }) => row.status === "ok").length, judged: judgedHere.length };
  }).filter((group) => group.rows.length > 0);

  // Printing (the button, or Ctrl+P): every row, the light theme, and a file
  // name with the site and the date for "Save as PDF"; all back afterwards.
  // What to put back: kept in a ref, since the filter change re-renders the report.
  const saved = useRef<{ theme: string | null; title: string } | null>(null);
  useEffect(() => {
    const html = document.documentElement;
    const before = () => {
      if (!saved.current) saved.current = { theme: html.getAttribute("data-theme"), title: document.title };
      flushSync(() => setFilter("all"));
      html.setAttribute("data-theme", "light");
      const day = new Intl.DateTimeFormat(lang === "ru" ? "ru-RU" : "en-US", { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Europe/Moscow" }).format(result.checkedAt);
      document.title = t("siteCheck.report.print.file", { host: result.host, date: day });
    };
    const after = () => {
      if (!saved.current) return;
      if (saved.current.theme) html.setAttribute("data-theme", saved.current.theme);
      document.title = saved.current.title;
      saved.current = null;
    };
    window.addEventListener("beforeprint", before);
    window.addEventListener("afterprint", after);
    return () => {
      window.removeEventListener("beforeprint", before);
      window.removeEventListener("afterprint", after);
    };
  }, [lang, result.checkedAt, result.host, t]);

  const print = () => {
    reachGoal(GOALS.reportPdf);
    window.print();
  };

  const time = new Date(result.checkedAt);
  const checked = r("checked", {
    date: new Intl.DateTimeFormat(locale, { day: "numeric", month: "long", timeZone: "Europe/Moscow" }).format(time),
    time: new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Moscow" }).format(time),
    seconds: new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(result.tookMs / 1000),
  });

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: r("filters.all"), count: shown.length },
    { id: "issues", label: r("filters.issues"), count: issues },
    { id: "ok", label: r("filters.ok"), count: counts.ok },
  ];

  let index = 0;
  return (
    <div className="print-exact mt-10 text-left print:mt-0">
      <div className="mb-5 hidden items-baseline justify-between gap-4 border-b border-white/10 pb-3 print:flex">
        <span className="font-heading text-xl font-bold text-white">KEL Studio</span>
        <span className="text-sm text-gray-500">{r("print.by")}</span>
      </div>
      <section aria-labelledby="check-report" className="report-in rounded-3xl border border-white/10 bg-white/3 p-5 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <ScoreRing
            passed={counts.ok}
            total={judged}
            status={worst}
            label={r("passedLabel", { passed: counts.ok, total: judged })}
            caption={r("passed")}
          />
          <div className="min-w-0 flex-1">
            <h2 tabIndex={-1} id="check-report" className="font-heading text-2xl font-bold wrap-anywhere text-white outline-none sm:text-3xl">
              {r("title", { host: result.host })}
            </h2>
            <p className={`mt-3 flex items-center gap-2 text-lg font-semibold ${TONE[worst].text}`}>
              <StatusMark status={worst} />
              {r(`verdict.${verdict}`)}
            </p>
            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {(["critical", "warning", "info", "ok"] as const)
                .filter((status) => counts[status] > 0)
                .map((status) => (
                  <div key={status} className="flex items-baseline gap-1.5">
                    <dt className="order-2 text-sm text-gray-400">{r(`counts.${status}`)}</dt>
                    <dd className={`order-1 font-heading text-lg font-bold ${TONE[status].text}`}>{counts[status]}</dd>
                  </div>
                ))}
            </dl>
            <p className="mt-3 text-sm text-gray-500">{checked}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 print:hidden">
              <button
                type="button"
                onClick={print}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/30 hover:bg-white/5"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" />
                </svg>
                {r("print.button")}
              </button>
              <span className="text-xs text-gray-500">{r("print.note")}</span>
            </div>
          </div>
        </div>
      </section>

      <div role="group" aria-label={r("filters.label")} className="report-in mt-8 inline-flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/3 p-1 print:hidden">
        {filters.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={filter === item.id}
            onClick={() => setFilter(item.id)}
            className={`cursor-pointer rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              filter === item.id ? "bg-white text-black" : "text-gray-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
            <span className="ml-1.5 opacity-60">{item.count}</span>
          </button>
        ))}
      </div>

      {groups.length > 0 ? (
        <div className="report-in mt-4 overflow-hidden rounded-2xl border border-white/10 print:mt-6">
          <table className="report-table w-full border-collapse text-left">
            <caption className="sr-only">{r("caption", { host: result.host })}</caption>
            <thead className="bg-white/5 text-xs tracking-wider text-gray-400 uppercase">
              <tr>
                <th scope="col" className="w-12 py-3 pl-4 sm:w-16 sm:pl-6">
                  <span className="sr-only">{r("columns.status")}</span>
                </th>
                <th scope="col" className="px-4 py-3 font-semibold sm:pl-2">
                  {r("columns.check")}
                </th>
                <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell sm:pr-6">
                  {r("columns.result")}
                </th>
              </tr>
            </thead>
            {groups.map(({ group, rows, passed, judged: judgedHere }) => (
              <tbody key={group} className="divide-y divide-white/10 border-t border-white/10">
                <tr>
                  <th colSpan={3} scope="colgroup" className="bg-white/[0.02] px-4 pt-5 pb-2 text-left sm:px-6">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="font-heading text-base font-bold text-white">{r(`groups.${group}`)}</span>
                      {judgedHere > 0 && (
                        <span className="text-sm font-normal text-gray-500">
                          {passed}/{judgedHere}
                        </span>
                      )}
                    </span>
                  </th>
                </tr>
                {rows.map(({ row, text }) => {
                  const issue = ISSUES.includes(row.status);
                  const open = opened.includes(row.id);
                  const hintId = `hint-${row.id}`;
                  const heading = (
                    <>
                      <span className="font-medium text-white">{text.label}</span>
                      {issue && (
                        <span className={`text-xs font-semibold tracking-wider uppercase ${TONE[row.status].text}`}>
                          {r(`status.${row.status}`)}
                        </span>
                      )}
                    </>
                  );
                  return (
                    <tr
                      key={row.id}
                      onClick={text.hint ? () => toggle(row.id) : undefined}
                      className={`report-row align-top transition-colors hover:bg-white/3 ${TONE[row.status].row} ${text.hint ? "cursor-pointer" : ""}`}
                      style={{ "--i": index++ } as CSSProperties}
                    >
                      <td className="py-4 pl-4 sm:pl-6">
                        <StatusMark status={row.status} />
                      </td>
                      <th scope="row" className="px-4 py-4 text-left font-normal sm:pl-2">
                        {text.hint ? (
                          // The click reaches the row, which opens the explanation; the button is
                          // there for the keyboard and screen readers.
                          <button
                            type="button"
                            aria-expanded={open}
                            aria-controls={hintId}
                            className="flex cursor-pointer flex-wrap items-baseline gap-x-2.5 gap-y-0.5 text-left"
                          >
                            {heading}
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              className={`h-3.5 w-3.5 self-center text-gray-500 transition-transform duration-200 print:hidden ${open ? "rotate-180" : ""}`}
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2.5}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M6 9l6 6 6-6" />
                            </svg>
                          </button>
                        ) : (
                          <span className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">{heading}</span>
                        )}
                        <span className="mt-1 block wrap-anywhere text-gray-300 sm:hidden">{text.value}</span>
                        {text.hint && (
                          <span id={hintId} className={`mt-1.5 max-w-xl text-sm leading-relaxed text-gray-400 print:block ${open ? "block" : "hidden"}`}>
                            {text.hint}
                          </span>
                        )}
                      </th>
                      <td className="hidden w-[38%] py-4 pr-6 pl-4 wrap-anywhere text-gray-200 sm:table-cell">
                        <span className="sr-only">{r(`status.${row.status}`)}: </span>
                        {text.value}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            ))}
          </table>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl border border-white/10 bg-white/3 p-5 text-gray-300">{r("noIssues")}</p>
      )}

      {notChecked && <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-400">{r(`notChecked.${notChecked}`)}</p>}

      <div className="mt-6 hidden rounded-2xl border border-white/10 p-5 text-sm leading-relaxed text-gray-300 print:block">
        <p>
          <strong className="text-white">{r("print.helpTitle")}</strong> {r("print.helpText")}{" "}
          <a href={SITE_URL}>kel.agency</a>, Telegram <a href={TELEGRAM_URL}>{TELEGRAM_URL.replace("https://", "")}</a>,{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
        <p className="mt-2">
          {r("print.watchText")} <a href={pulseBotUrl(lang === "en" ? "site_check_pdf_en" : "site_check_pdf")}>t.me/{PULSE_BOT}</a>
        </p>
      </div>

      <div className="mt-8 grid gap-3 md:grid-cols-[1.4fr_1fr] print:hidden">
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
        className="mt-6 cursor-pointer text-gray-400 underline underline-offset-4 transition-colors hover:text-white print:hidden"
      >
        {r("again")}
      </button>
    </div>
  );
}
