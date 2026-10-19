"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { revealBelowHeader } from "@/components/smoothNavigate";
import { GOALS, reachGoal } from "@/lib/metrika";
import { typedHost, type CheckErrorCode, type CheckResult } from "@/lib/sitecheck";
import CheckProgress from "./CheckProgress";
import CheckReport from "./CheckReport";

type Status =
  | { kind: "idle" }
  | { kind: "loading"; host: string; step: number }
  | { kind: "done"; result: CheckResult }
  | { kind: "error"; code: CheckErrorCode };

const ERRORS: CheckErrorCode[] = ["not-url", "blocked", "not-found", "rate-limited", "busy", "unavailable", "failed"];

// How long each step of the progress shows; the last one waits for the answer.
const STEP_MS = 1600;

// The address field of the website check and the report under it. The address
// also goes into the page's ?url=, so a report can be reloaded or shared, and a
// link from elsewhere (the form on the home page) runs the check at once.
export default function SiteCheckForm() {
  const { t } = useTranslation();
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const inputRef = useRef<HTMLInputElement>(null);
  const steps = t("siteCheck.progress.steps", { returnObjects: true }) as string[];

  const run = useCallback(
    async (address: string) => {
      const value = address.trim();
      if (!value) {
        inputRef.current?.focus();
        return;
      }
      const params = new URLSearchParams(window.location.search);
      params.set("url", value);
      window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
      reachGoal(GOALS.siteCheck);

      setStatus({ kind: "loading", host: typedHost(value), step: 0 });
      // The form and the scanner under it come into view (after a frame, so the
      // page's ScrollSmoother exists when the check starts on arrival).
      requestAnimationFrame(() => requestAnimationFrame(() => revealBelowHeader("#site-check")));
      const timer = setInterval(
        () => setStatus((s) => (s.kind === "loading" ? { ...s, step: Math.min(s.step + 1, steps.length - 1) } : s)),
        STEP_MS,
      );
      try {
        const res = await fetch("/api/site-check", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ url: value }),
        });
        const data = (await res.json()) as CheckResult | { ok: false; error?: string };
        if (data.ok) setStatus({ kind: "done", result: data });
        else setStatus({ kind: "error", code: ERRORS.includes(data.error as CheckErrorCode) ? (data.error as CheckErrorCode) : "failed" });
      } catch {
        setStatus({ kind: "error", code: "unavailable" });
      } finally {
        clearInterval(timer);
      }
    },
    [steps.length],
  );

  // A link with ?url= starts the check right away (once: development mode runs effects twice).
  const started = useRef(false);
  useEffect(() => {
    const address = new URLSearchParams(window.location.search).get("url");
    if (!address || started.current) return;
    started.current = true;
    setUrl(address);
    void run(address);
  }, [run]);

  // The report gets the focus when it appears, so a screen reader reads it.
  useEffect(() => {
    if (status.kind === "done") document.getElementById("check-report")?.focus({ preventScroll: true });
  }, [status.kind]);

  const again = () => {
    setStatus({ kind: "idle" });
    setUrl("");
    inputRef.current?.focus();
  };

  const loading = status.kind === "loading";

  return (
    <div id="site-check" className="scroll-mt-28">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!loading) void run(url);
        }}
        className="flex max-w-2xl flex-col gap-3 sm:flex-row print:hidden"
      >
        <label htmlFor="site-check-url" className="sr-only">
          {t("siteCheck.inputLabel")}
        </label>
        <input
          ref={inputRef}
          id="site-check-url"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={300}
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder={t("siteCheck.placeholder")}
          className="h-14 w-full min-w-0 rounded-xl sm:flex-1 border border-white/15 bg-field px-5 text-lg text-white placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="h-14 cursor-pointer rounded-xl bg-white px-7 text-lg font-semibold text-black transition-[opacity,translate] duration-200 hover:opacity-90 active:translate-y-px disabled:cursor-wait disabled:opacity-60"
        >
          {t("siteCheck.submit")}
        </button>
      </form>

      <div aria-live="polite">
        {status.kind === "loading" && <CheckProgress host={status.host} step={status.step} />}
        {status.kind === "error" && <p className="mt-5 max-w-2xl text-rose-400">{t(`siteCheck.errors.${status.code}`)}</p>}
      </div>

      {status.kind === "done" && <CheckReport result={status.result} onAgain={again} />}
    </div>
  );
}
