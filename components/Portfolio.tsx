"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { useSnapSlider } from "./useSnapSlider";
import { useWhenNear } from "./useWhenNear";
import SliderDots from "./SliderDots";
import { ButtonLink } from "./Button";

gsap.registerPlugin(ScrollTrigger);

type ProjectItem = {
  title: string;
  description: string;
  image?: string;
  url?: string;
};

// The slides change by themselves this often until the visitor takes over.
const AUTOPLAY_MS = 5000;

// Where the project lives, for alt text and labels: "mentoralex.ru".
const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

// Desktop: the row starts at the left edge of the page container (where the
// heading starts) and runs to the right edge of the screen, so the first card
// lines up with the heading, the next slide always comes to the same place,
// and slides that have gone by are cut off at the container edge instead of
// showing on the left. Two cards fill the container, the third peeks out on the
// right. The right padding lets even the last slide reach the left edge.
// --x0: the container's left edge; --card: half the container, minus the gap.
const DESKTOP_TRACK = [
  "lg:ml-[var(--x0)] lg:gap-8 lg:px-0",
  "lg:pr-[calc(100%_-_var(--x0)_-_var(--card))]",
  "lg:[--x0:max(1.5rem,calc((100%_-_80rem)/2_+_1.5rem))]",
  "lg:[--card:calc((min(100vw,80rem)_-_5rem)/2)]",
].join(" ");

const arrowButton =
  "flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors duration-200 hover:border-white/30 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 disabled:cursor-default disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-white/5";

export default function Portfolio() {
  const { t } = useTranslation();
  const items = t("portfolio.items", { returnObjects: true }) as ProjectItem[];
  const total = items.length;
  // The project cards plus the "your project could be here" card.
  const slideCount = total + 1;

  const sectionRef = useRef<HTMLElement>(null);
  // A plain scroll-snap row on every screen size: the page scrolls normally
  // past it (nothing is pinned), the visitor swipes, drags the scrollbar, or
  // uses the arrows and dots, and it turns by itself while it is on screen.
  const { sliderRef: trackRef, activeSlide, scrollToSlide } = useSnapSlider(
    ".portfolio-card",
    "all",
    { autoplayMs: AUTOPLAY_MS }
  );

  // The cards slide in once as the section comes into view.
  useWhenNear(sectionRef, (section) => {
    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Animates inner wrappers, not the cards: the slider scales the cards.
      const entrance = gsap
        .timeline({ paused: true })
        .from(section.querySelectorAll(".portfolio-reveal"), {
          x: 60,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          stagger: 0.1,
        });
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => entrance.play(),
      });

      // Same safety net as the other sections: never leave content hidden
      // if a ScrollTrigger start is skipped.
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (entrance.progress() === 0 && !entrance.isActive()) entrance.play();
          observer.disconnect();
        },
        { rootMargin: "0px 0px -20% 0px" }
      );
      observer.observe(section);

      return () => observer.disconnect();
    });

    return () => mm.revert();
  });

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (smoothNavigate("#contact")) {
      e.preventDefault();
    }
  };

  const shown = Math.min(activeSlide + 1, total);
  const progress = slideCount > 1 ? activeSlide / (slideCount - 1) : 0;

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#141414_180px,#141414_calc(100%-200px),#000000_100%)]"
    >
      <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 sm:px-6 lg:mb-10">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          {t("portfolio.heading")}
        </h2>
        <div className="hidden items-center gap-4 pb-2 lg:flex">
          <span
            aria-hidden="true"
            className="font-heading text-sm tabular-nums text-white"
          >
            {String(shown).padStart(2, "0")}
            <span className="text-gray-500">
              {" / "}
              {String(total).padStart(2, "0")}
            </span>
          </span>
          <span
            aria-hidden="true"
            className="relative h-px w-32 overflow-hidden bg-white/15 xl:w-48"
          >
            <span
              className="absolute inset-0 origin-left bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 transition-transform duration-500 ease-out"
              style={{ transform: `scaleX(${progress})` }}
            />
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label={t("slider.prev")}
              disabled={activeSlide === 0}
              onClick={() => scrollToSlide(activeSlide - 1)}
              className={arrowButton}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 6-6 6 6 6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={t("slider.next")}
              disabled={activeSlide >= slideCount - 1}
              onClick={() => scrollToSlide(activeSlide + 1)}
              className={arrowButton}
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 6 6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className={`relative flex snap-x snap-mandatory gap-3 overflow-x-auto px-[10vw] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${DESKTOP_TRACK}`}
      >
        {items.map((item, index) => {
          const host = item.url ? hostOf(item.url) : "";
          const content = (
            <div className="portfolio-reveal group">
              <div className="portfolio-frame relative aspect-video overflow-hidden rounded-2xl border border-white/5 bg-[#1f1f1f]">
                {item.image && (
                  <div className="portfolio-media absolute inset-0">
                    <Image
                      src={item.image}
                      alt={host ? `${item.title} - ${host}` : item.title}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                      className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                )}
                {item.url && (
                  <span
                    aria-hidden="true"
                    className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M7 17 17 7M8 7h9v9" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="portfolio-text mt-5 flex items-start gap-4">
                <span className="pt-1.5 font-heading text-sm tabular-nums text-gray-500">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-gray-400">{item.description}</p>
                </div>
              </div>
            </div>
          );

          return (
            <article
              key={index}
              data-project="true"
              className="portfolio-card w-[80vw] shrink-0 snap-center sm:w-[min(60vw,560px)] lg:w-[var(--card)] lg:snap-start"
            >
              {item.url ? (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.title} - ${host}`}
                  className="block cursor-pointer"
                >
                  {content}
                </a>
              ) : (
                content
              )}
            </article>
          );
        })}

        <article className="portfolio-card w-[80vw] shrink-0 snap-center sm:w-[min(60vw,560px)] lg:w-[var(--card)] lg:snap-start">
          <div className="portfolio-reveal h-full">
            <div className="portfolio-frame relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/2 p-7 sm:p-8">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(168,85,247,0.2),transparent_60%)]"
              />
              <div className="portfolio-text relative">
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                  {t("portfolio.ctaTitle")}
                </h3>
                <p className="mt-3 text-gray-400 leading-relaxed">
                  {t("portfolio.ctaText")}
                </p>
              </div>
              <ButtonLink
                href="#contact"
                className="relative self-start"
                onClick={handleContactClick}
              >
                {t("portfolio.ctaButton")}
              </ButtonLink>
            </div>
          </div>
        </article>
      </div>
      <SliderDots
        count={slideCount}
        active={activeSlide}
        onSelect={scrollToSlide}
        className="mt-6"
      />
    </section>
  );
}
