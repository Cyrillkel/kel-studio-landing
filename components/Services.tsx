"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import {
  SERVICES_PATH,
  servicePath,
  type ServiceCopy,
  type ServiceSlug,
} from "@/lib/services";
import { cn } from "@/lib/utils";
import { useLang, useLocalePath } from "./useLang";
import AmbientBlobs from "./AmbientBlobs";
import ServiceIcon from "./ServiceIcon";

gsap.registerPlugin(ScrollTrigger);

// The services of the block on the home page, one tab each. Their words are
// those of the service pages (servicePages.items.<slug> in locales/*.json), so
// the block always says what the page of the service says.
const TAB_SERVICES: readonly ServiceSlug[] = [
  "landing",
  "corporate",
  "ecommerce",
  "web-apps",
  "telegram-bots",
  "ai-assistants",
  "seo",
  "yandex-direct",
];

// Arrow keys move between the tabs (the next one comes up at once).
const KEY_STEPS: Record<string, number> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

const pad = (n: number) => String(n).padStart(2, "0");

// A four-pointed star on the joints of the card grid (wide screens only).
function Sparkle({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("pointer-events-none absolute hidden h-3.5 w-3.5 text-white/35 xl:block", className)}
    >
      <path d="M12 0C12.6 6.6 17.4 11.4 24 12 17.4 12.6 12.6 17.4 12 24 11.4 17.4 6.6 12.6 0 12 6.6 11.4 11.4 6.6 12 0Z" />
    </svg>
  );
}

// Services as tabs: a card per service and one large panel with what the chosen
// one includes, its price and timeline, and a link to its page. On wide screens
// (xl) the panel sits on the left of a two-column grid of cards; on tablets the
// cards are a grid above the panel, on phones a row of chips that scrolls sideways.
//
// Every panel is rendered, so all the texts and links are in the HTML for search
// engines. On wide screens the hidden ones stay in the same grid cell, invisible:
// the panel is as tall as the longest one and the cards beside it never change
// size. On narrower screens a hidden panel takes no room, so the panel fits its
// own text, and the page height changes with the tab.
export default function Services() {
  const { t } = useTranslation();
  const lang = useLang();
  const lp = useLocalePath();
  const baseId = useId();
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const shown = useRef(active);

  const services = TAB_SERVICES.map((slug) => ({
    slug,
    copy: t(`servicePages.items.${slug}`, { returnObjects: true }) as ServiceCopy,
  }));
  const count = services.length;
  const tabId = (index: number) => `${baseId}-tab-${index}`;
  const panelId = (index: number) => `${baseId}-panel-${index}`;

  // The panel that comes up rises in line by line. Only on a change of tab: the
  // first panel is simply there.
  useEffect(() => {
    if (shown.current === active) return;
    shown.current = active;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The page height changed (below xl, see above): let ScrollSmoother and the
    // scroll animations further down re-measure, as the FAQ does.
    if (!window.matchMedia("(min-width: 1280px)").matches) ScrollTrigger.refresh();

    // On phones the cards are a strip that scrolls sideways: bring the chosen
    // one to its start, so the next ones show.
    const tab = tabRefs.current[active];
    const strip = tab?.parentElement;
    if (tab && strip && strip.scrollWidth > strip.clientWidth) {
      const offset = tab.getBoundingClientRect().left - strip.getBoundingClientRect().left;
      strip.scrollTo({
        left: strip.scrollLeft + offset - parseFloat(getComputedStyle(strip).paddingLeft),
        behavior: reduced ? "auto" : "smooth",
      });
    }

    const panel = panelRefs.current[active];
    if (!panel || reduced) return;
    const lines = panel.querySelectorAll("[data-reveal]");
    const tween = gsap.fromTo(
      lines,
      { opacity: 0, y: 14 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.035 }
    );
    return () => {
      tween.kill();
      gsap.set(lines, { clearProps: "opacity,transform" });
    };
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = KEY_STEPS[e.key];
    const next =
      step !== undefined
        ? (active + step + count) % count
        : e.key === "Home"
          ? 0
          : e.key === "End"
            ? count - 1
            : null;
    if (next === null) return;
    e.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden py-16 md:py-24 fade-top [--from:var(--page)] [--to:var(--band-home)]"
    >
      <AmbientBlobs
        blobs={[
          {
            side: "left",
            vertical: "top-1/4",
            size: "w-40 h-40 sm:w-56 sm:h-56 md:w-72 md:h-72",
            gradient:
              "bg-[linear-gradient(135deg,rgba(59,130,246,0.55),rgba(168,85,247,0.4),rgba(217,70,239,0.3))]",
            delay: "-4s",
          },
          {
            side: "right",
            vertical: "bottom-24",
            size: "w-36 h-36 sm:w-48 sm:h-48 md:w-60 md:h-60",
            gradient:
              "bg-[linear-gradient(135deg,rgba(34,211,238,0.5),rgba(59,130,246,0.4),rgba(168,85,247,0.3))]",
            delay: "-13s",
          },
        ]}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center text-white">
          {t("services.heading")}
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-center text-gray-400 text-pretty md:mb-16">
          {t("services.subheading")}
        </p>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_1fr] xl:gap-5">
          <div
            role="tablist"
            aria-label={t("services.tabsLabel")}
            onKeyDown={onKeyDown}
            className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-2 overflow-x-auto overscroll-x-contain px-5 py-1 [mask-image:linear-gradient(to_right,transparent,black_1.25rem,black_calc(100%-2rem),transparent)] [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden md:mx-0 md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:p-0 md:[mask-image:none] lg:grid-cols-4 xl:col-start-2 xl:row-start-1 xl:auto-rows-fr xl:grid-cols-2 xl:gap-4"
          >
            {services.map(({ slug, copy }, index) => {
              const selected = index === active;
              // The stars sit on the joints between the two columns of the wide grid.
              const leftColumn = index % 2 === 0;
              return (
                <button
                  key={slug}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  type="button"
                  role="tab"
                  id={tabId(index)}
                  aria-selected={selected}
                  aria-controls={panelId(index)}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(index)}
                  className="group relative shrink-0 cursor-pointer snap-start rounded-full border border-white/10 p-1 text-left transition-colors duration-300 hover:border-white/25 aria-selected:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400 md:rounded-2xl md:p-1.5"
                >
                  {leftColumn && (
                    <Sparkle className={cn("-right-3.75", index < 2 ? "-top-1.75" : "-top-3.75")} />
                  )}
                  {leftColumn && index >= count - 2 && <Sparkle className="-right-3.75 -bottom-1.75" />}
                  <span className="relative flex h-full items-center gap-2 overflow-hidden rounded-full border border-white/5 bg-card py-1 pr-4 pl-1 md:gap-3 md:rounded-xl md:p-3 xl:flex-col xl:items-start xl:gap-0 xl:p-5">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-[linear-gradient(135deg,rgb(34_211_238/0.14),rgb(139_92_246/0.22)_50%,rgb(217_70_239/0.16))] opacity-0 transition-opacity duration-300 group-aria-selected:opacity-100"
                    />
                    <span className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 text-white transition-colors duration-300 group-aria-selected:text-snow md:h-9 md:w-9 md:rounded-lg xl:mb-4 xl:h-11 xl:w-11">
                      <span
                        aria-hidden="true"
                        className="absolute inset-0 bg-linear-to-br from-cyan-400 via-violet-500 to-fuchsia-500 opacity-0 transition-opacity duration-300 group-aria-selected:opacity-100"
                      />
                      <ServiceIcon slug={slug} className="relative h-4 w-4 md:h-5 md:w-5 xl:h-6 xl:w-6" />
                    </span>
                    <span className="relative text-sm leading-snug font-semibold whitespace-nowrap text-white md:whitespace-normal xl:font-heading xl:text-lg xl:font-bold">
                      {copy.name}
                    </span>
                    {/* A preview of the panel's text: screen readers hear it there. */}
                    <span aria-hidden="true" className="relative mt-2 hidden xl:block">
                      <span className="line-clamp-2 text-sm leading-relaxed text-gray-400">
                        {copy.short}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative grid overflow-hidden rounded-3xl border border-white/10 bg-card-violet xl:col-start-1 xl:row-start-1">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--grid-line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line-soft)_1px,transparent_1px)] bg-size-[24px_24px] [mask-image:linear-gradient(to_top,black,transparent_80%)]"
            />
            <div
              aria-hidden="true"
              className="glow-wash pointer-events-none absolute inset-0 [--glow-shape:ellipse_at_0%_100%] [--glow-color:var(--glow-visual)] [--glow-end:75%]"
            />

            {services.map(({ slug, copy }, index) => {
              const selected = index === active;
              return (
                <div
                  key={slug}
                  ref={(el) => {
                    panelRefs.current[index] = el;
                  }}
                  role="tabpanel"
                  id={panelId(index)}
                  aria-labelledby={tabId(index)}
                  inert={!selected}
                  className={cn(
                    "relative flex flex-col p-6 [grid-area:1/1] sm:p-8 xl:p-9",
                    !selected && "max-xl:hidden xl:invisible"
                  )}
                >
                  <div
                    data-reveal
                    className="flex items-center justify-between gap-4 text-sm text-gray-500"
                  >
                    <span>[ {t("services.label.service")} ]</span>
                    <span className="tabular-nums">
                      [ {pad(index + 1)} / {pad(count)} ]
                    </span>
                  </div>
                  <h3
                    data-reveal
                    className="mt-4 font-heading text-2xl leading-tight font-bold text-white sm:text-3xl xl:text-4xl"
                  >
                    {copy.name}
                  </h3>

                  <div data-reveal className="mt-6 grid gap-2 sm:grid-cols-[9rem_1fr] sm:gap-6">
                    <span className="text-sm text-gray-500">[ {t("services.label.about")} ]</span>
                    <p className="leading-relaxed text-gray-300">{copy.short}</p>
                  </div>

                  <p data-reveal className="mt-8 text-sm text-gray-500">
                    [ {t("services.label.includes")} ]
                  </p>
                  <ol className="mt-3 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2">
                    {copy.includes.map((item, itemIndex) => (
                      <li
                        key={item}
                        data-reveal
                        className="rounded-xl border border-white/10 p-1"
                      >
                        <div className="flex h-full flex-col rounded-lg border border-white/5 bg-white/3 p-3.5">
                          <span aria-hidden="true" className="text-xs text-gray-500 tabular-nums">
                            [ {pad(itemIndex + 1)} ]
                          </span>
                          <span className="mt-2 text-[15px] leading-snug text-gray-200">{item}</span>
                        </div>
                      </li>
                    ))}
                  </ol>

                  <div
                    data-reveal
                    className="mt-auto flex flex-col gap-5 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-6"
                  >
                    {/* The figures wrap, the button keeps its corner in every panel. */}
                    <dl className="flex min-w-0 flex-wrap gap-x-8 gap-y-3">
                      <div>
                        <dt className="text-xs tracking-wider text-gray-500 uppercase">
                          {t("servicePages.common.priceLabel")}
                        </dt>
                        <dd className="mt-1 font-semibold text-white">{copy.price}</dd>
                      </div>
                      <div>
                        <dt className="text-xs tracking-wider text-gray-500 uppercase">
                          {t("servicePages.common.termLabel")}
                        </dt>
                        <dd className="mt-1 font-semibold text-white">{copy.term}</dd>
                      </div>
                    </dl>
                    <Link
                      href={servicePath(slug, lang)}
                      className="group/more inline-flex shrink-0 items-center gap-2 self-start rounded-xl border sm:self-auto border-white/15 bg-white/5 px-4 py-2.5 font-semibold text-white transition-colors duration-300 hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-400"
                    >
                      {t("services.more")}
                      <span className="sr-only">: {copy.name}</span>
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-4 w-4 transition-transform duration-300 group-hover/more:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 text-center md:mt-14">
          <Link
            href={lp(SERVICES_PATH)}
            className="text-gray-300 underline underline-offset-4 transition-colors hover:text-white"
          >
            {t("services.all")}
          </Link>
        </div>
      </div>
    </section>
  );
}
