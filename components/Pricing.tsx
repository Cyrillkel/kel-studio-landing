"use client";

import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";

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

export default function Pricing() {
  const { t } = useTranslation();
  const items = t("pricing.items", { returnObjects: true }) as PriceItem[];

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
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-center text-white">
          {t("pricing.heading")}
        </h2>
        <p className="text-gray-400 text-center mb-10 md:mb-16">
          {t("pricing.subheading")}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-[#1f1f1f] p-6 sm:p-7 rounded-2xl border border-white/5 hover:-translate-y-1 hover:border-white/20 hover:shadow-2xl hover:shadow-black/40 transition-all duration-300"
            >
              <div className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center mb-5 text-white">
                {icons[index]}
              </div>
              <h3 className="font-heading text-lg sm:text-xl font-bold text-white mb-2">
                {item.title}
              </h3>
              <p className="font-heading text-2xl sm:text-3xl font-bold bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                {item.price}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 md:mt-14 text-center">
          <a
            href="#contact"
            onClick={handleClick}
            className="inline-block bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
          >
            {t("pricing.cta")}
          </a>
        </div>
      </div>
    </section>
  );
}
