"use client";

import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";

export default function Hero() {
  const { t } = useTranslation();
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (smoothNavigate(href)) {
      e.preventDefault();
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source
            src="/video/hero-video-mobile.webm"
            type="video/webm"
            media="(max-width: 767px)"
          />
          <source
            src="/video/hero-video-mobile.mp4"
            type="video/mp4"
            media="(max-width: 767px)"
          />
          <source src="/video/hero-video.webm" type="video/webm" />
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
          {t("hero.titleLine1")}
          <br />
          {t("hero.titleLine2")}
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            onClick={(e) => handleClick(e, "#contact")}
            className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
          >
            {t("hero.ctaPrimary")}
          </a>
          <a
            href="#portfolio"
            onClick={(e) => handleClick(e, "#portfolio")}
            className="text-gray-50 border border-white/30 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition"
          >
            {t("hero.ctaSecondary")}
          </a>
        </div>
      </div>
    </section>
  );
}
