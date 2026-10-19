"use client";

import { useTranslation } from "react-i18next";
import ScanVisual from "./ScanVisual";

function StepMark({ state }: { state: "done" | "active" | "next" }) {
  if (state === "done") {
    return (
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-400">
        <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={3.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return <span className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-violet-400 border-t-transparent motion-reduce:animate-none" />;
  }
  return <span className="h-5 w-5 shrink-0 rounded-full border-2 border-white/10" />;
}

// What the page shows while a check runs: the scanner and the steps, one after
// another by time (the check itself is one request, so its real progress is not
// known; the last step waits for the answer).
export default function CheckProgress({ host, step }: { host: string; step: number }) {
  const { t } = useTranslation();
  const steps = t("siteCheck.progress.steps", { returnObjects: true }) as string[];
  const share = Math.min(0.94, (step + 0.5) / steps.length);

  return (
    <div id="check-progress" className="report-in mt-8 rounded-3xl border border-white/10 bg-white/3 p-5 sm:p-8">
      <p className="sr-only">
        {t("siteCheck.progress.title", { host })}: {steps[step]}
      </p>
      <div aria-hidden="true" className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <ScanVisual host={host} lit={step} />
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">{t("siteCheck.progress.eyebrow")}</p>
          <p className="mt-2 font-heading text-xl font-bold wrap-anywhere text-white sm:text-2xl">
            {t("siteCheck.progress.title", { host })}
          </p>
          <ol className="mt-5 space-y-2.5">
            {steps.map((label, index) => {
              const state = index < step ? "done" : index === step ? "active" : "next";
              return (
                <li
                  key={label}
                  className={`flex items-center gap-3 transition-colors duration-300 ${
                    state === "done" ? "text-gray-400" : state === "active" ? "text-white" : "text-gray-500"
                  }`}
                >
                  <StepMark state={state} />
                  {label}
                </li>
              );
            })}
          </ol>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-[width] duration-700 ease-out"
              style={{ width: `${share * 100}%` }}
            />
          </div>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">{t("siteCheck.progress.note")}</p>
        </div>
      </div>
    </div>
  );
}
