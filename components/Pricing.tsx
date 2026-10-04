"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { useSnapSlider } from "./useSnapSlider";
import SliderDots from "./SliderDots";
import { ButtonLink } from "./Button";
import { PRICES_PATH, servicePath } from "@/lib/services";
import SectionGlow from "./SectionGlow";

const icons = [
  <svg
    key="card"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m-9 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>,
  <svg
    key="landing"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 5h16M4 5a1 1 0 00-1 1v12a1 1 0 001 1h16a1 1 0 001-1V6a1 1 0 00-1-1M4 5l8 6 8-6"
    />
  </svg>,
  <svg
    key="corp"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"
    />
  </svg>,
  <svg
    key="shop"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z"
    />
  </svg>,
  <svg
    key="app"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>,
  <svg
    key="design"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
    />
  </svg>,
  <svg
    key="seo"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>,
  <svg
    key="direct"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>,
  <svg
    key="parsing"
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <ellipse cx="12" cy="6" rx="8" ry="3" strokeWidth={2} />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6v6c0 1.657 3.582 3 8 3s8-1.343 8-3V6"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 12v6c0 1.657 3.582 3 8 3s8-1.343 8-3v-6"
    />
  </svg>,
];

type PriceItem = { title: string; price: string };

// Where each price card leads, in the order of pricing.items.
const PRICE_LINKS = [
  servicePath("vizitka"),
  servicePath("landing"),
  servicePath("corporate"),
  servicePath("ecommerce"),
  servicePath("web-apps"),
  servicePath("design"),
  servicePath("seo"),
  servicePath("yandex-direct"),
  servicePath("parsing"),
];

const AUTOPLAY_MS = 4000;

export default function Pricing() {
  const { t } = useTranslation();
  const items = t("pricing.items", { returnObjects: true }) as PriceItem[];
  // On a phone the cards turn by themselves, slowly; a swipe or a tap on the dots
  // pauses it (see useSnapSlider).
  const { sliderRef, activeSlide, scrollToSlide } = useSnapSlider(".pricing-card", "(max-width: 767px)", {
    autoplayMs: AUTOPLAY_MS,
  });

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (smoothNavigate("#contact")) {
      e.preventDefault();
    }
  };

  return (
    <section
      id="pricing"
      className="relative isolate overflow-hidden py-16 md:py-24 bg-[linear-gradient(to_bottom,#141414_0px,#0a0a0a_180px,#0a0a0a_100%)]"
    >
      <SectionGlow />
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center text-white">
          {t("pricing.heading")}
        </h2>
        <p className="text-gray-400 text-center mb-10 md:mb-16">
          {t("pricing.subheading")}
        </p>
        <div
          ref={sliderRef}
          className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:p-0 lg:grid-cols-3"
        >
          {items.map((item, index) => (
            <Link
              key={index}
              href={PRICE_LINKS[index] ?? PRICES_PATH}
              className="pricing-card group relative flex min-h-64 w-full shrink-0 snap-start flex-col bg-white/3 p-6 sm:w-[22rem] sm:p-7 rounded-2xl border border-white/10 hover:-translate-y-1 hover:border-white/25 hover:bg-white/5 hover:shadow-2xl hover:shadow-black/40 transition-[translate,border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 md:min-h-0 md:w-auto"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="absolute right-5 top-5 h-5 w-5 text-gray-500 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              <div className="w-12 h-12 md:w-11 md:h-11 bg-white/10 rounded-lg flex items-center justify-center mb-6 md:mb-5 text-white">
                {icons[index]}
              </div>
              <h3 className="font-heading text-2xl font-bold text-white mb-2 md:text-xl">
                {item.title}
              </h3>
              <p className="mt-auto font-heading text-4xl font-bold md:text-3xl bg-linear-to-br from-white to-gray-400 bg-clip-text text-transparent md:mt-0">
                {item.price}
              </p>
            </Link>
          ))}
        </div>
        <SliderDots
          count={items.length}
          active={activeSlide}
          onSelect={scrollToSlide}
          className="mt-4 md:hidden"
        />
        <div className="mt-10 md:mt-14 text-center">
          <ButtonLink href="#contact" size="lg" onClick={handleClick}>
            {t("pricing.cta")}
          </ButtonLink>
          <div className="mt-6">
            <Link
              href={PRICES_PATH}
              className="text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              {t("pricing.details")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
