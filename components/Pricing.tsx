"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { useSnapSlider } from "./useSnapSlider";
import SliderDots from "./SliderDots";
import { ButtonLink } from "./Button";
import { PRICES_PATH, servicePath } from "@/lib/services";
import { useLang, useLocalePath } from "./useLang";
import SectionGlow from "./SectionGlow";
import ServiceIcon from "./ServiceIcon";

type PriceItem = { title: string; price: string };

// Where each price card leads, in the order of pricing.items.
const PRICE_SERVICES = [
  "vizitka",
  "landing",
  "corporate",
  "ecommerce",
  "web-apps",
  "design",
  "seo",
  "yandex-direct",
  "parsing",
] as const;

const AUTOPLAY_MS = 4000;

export default function Pricing() {
  const { t } = useTranslation();
  const lang = useLang();
  const lp = useLocalePath();
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
      className="relative isolate overflow-hidden py-16 md:py-24 fade-top [--from:var(--band-home)] [--to:var(--page)]"
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
              href={PRICE_SERVICES[index] ? servicePath(PRICE_SERVICES[index], lang) : lp(PRICES_PATH)}
              className="pricing-card group relative flex min-h-64 w-full shrink-0 snap-start flex-col bg-white/3 p-6 sm:w-[22rem] sm:p-7 rounded-2xl border border-white/10 hover:-translate-y-1 hover:border-white/25 hover:bg-white/5 hover:shadow-2xl hover:shadow-shade/40 transition-[translate,border-color,background-color,box-shadow] duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60 md:min-h-0 md:w-auto"
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
                {PRICE_SERVICES[index] && <ServiceIcon slug={PRICE_SERVICES[index]} />}
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
              href={lp(PRICES_PATH)}
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
