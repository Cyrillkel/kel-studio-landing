"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { ButtonLink } from "./Button";

const HERO_POSTER = "/video/hero-poster.webp";

export default function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);

    // Both queries listed so the callback always runs (matchMedia skips it
    // when no condition matches).
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        motionOk: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        gsap.set(".hero-content", { visibility: "visible" });
        if (reduceMotion) return;

        // Same vocabulary as the Process and About sections: masked line
        // roll-up, then fade-up copy.
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".hero-line", {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
          })
          .from(".hero-subtitle", { y: 24, opacity: 0, duration: 0.9 }, 0.35)
          .from(
            ".hero-action",
            { y: 20, opacity: 0, duration: 0.8, stagger: 0.1 },
            0.65
          );
      }
    );

    return () => mm.revert();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (smoothNavigate(href)) {
      e.preventDefault();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Hoisted to <head> by React — the poster is the LCP candidate, fetch it before the video data. */}
      <link rel="preload" as="image" href={HERO_POSTER} fetchPriority="high" />
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
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
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/15 via-[#0a0a0a]/40 to-[#0a0a0a]/75" />
        <div className="absolute inset-x-0 bottom-0 h-40 sm:h-56 bg-gradient-to-b from-transparent to-[#0a0a0a]" />
      </div>

      {/* Hidden until the intro timeline takes over, so SSR text doesn't flash before animating in. */}
      <div
        className="hero-content relative z-10 max-w-7xl mx-auto px-6 py-32 text-center"
        style={{ visibility: "hidden" }}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: "<style>.hero-content{visibility:visible!important}</style>",
          }}
        />
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {[t("hero.titleLine1"), t("hero.titleLine2")].map((line, index) => (
            // Extra bottom padding keeps descenders out of the mask's clip.
            <span key={index} className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
              <span className="hero-line block gradient-text">{line}</span>{" "}
            </span>
          ))}
        </h1>
        <p className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          {t("hero.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Wrappers take the reveal transform so the buttons keep their own press effect. */}
          <div className="hero-action flex flex-col">
            <ButtonLink
              href="#contact"
              size="lg"
              onClick={(e) => handleClick(e, "#contact")}
            >
              {t("hero.ctaPrimary")}
            </ButtonLink>
          </div>
          <div className="hero-action flex flex-col">
            <ButtonLink
              href="#portfolio"
              variant="outline"
              size="lg"
              onClick={(e) => handleClick(e, "#portfolio")}
            >
              {t("hero.ctaSecondary")}
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
