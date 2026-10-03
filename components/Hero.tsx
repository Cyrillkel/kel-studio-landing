"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { ButtonLink } from "./Button";
import { StarsCompact, StarsWide, useTechStars } from "./hero/TechStars";
import HeroTitle from "./hero/HeroTitle";

export default function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  useTechStars(sectionRef);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);

    mm.add("(hover: hover) and (pointer: fine)", () => {
      const glow = section.querySelector<HTMLElement>(".hero-grid-glow")!;
      const spot = { x: 0, y: 0 };
      const paint = () => {
        glow.style.setProperty("--mx", `${spot.x}px`);
        glow.style.setProperty("--my", `${spot.y}px`);
      };
      const xTo = gsap.quickTo(spot, "x", { duration: 0.6, ease: "power3.out", onUpdate: paint });
      const yTo = gsap.quickTo(spot, "y", { duration: 0.6, ease: "power3.out", onUpdate: paint });

      const local = (e: PointerEvent) => {
        const box = section.getBoundingClientRect();
        return [e.clientX - box.left, e.clientY - box.top] as const;
      };
      const onEnter = (e: PointerEvent) => {
        [spot.x, spot.y] = local(e);
        paint();
        gsap.to(glow, { opacity: 1, duration: 0.5, overwrite: "auto" });
      };
      const onMove = (e: PointerEvent) => {
        const [x, y] = local(e);
        xTo(x);
        yTo(y);
      };
      const onLeave = () => gsap.to(glow, { opacity: 0, duration: 0.6, overwrite: "auto" });

      section.addEventListener("pointerenter", onEnter);
      section.addEventListener("pointermove", onMove);
      section.addEventListener("pointerleave", onLeave);
      return () => {
        section.removeEventListener("pointerenter", onEnter);
        section.removeEventListener("pointermove", onMove);
        section.removeEventListener("pointerleave", onLeave);
        gsap.killTweensOf([spot, glow]);
        gsap.set(glow, { clearProps: "opacity" });
      };
    });

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
      <div aria-hidden="true" className="absolute inset-0 bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />
        {/* Same grid in violet, revealed only in a soft spot around the cursor. */}
        <div className="hero-grid-glow absolute inset-0 opacity-0 bg-[linear-gradient(rgba(167,139,250,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(167,139,250,0.5)_1px,transparent_1px)] bg-size-[56px_56px] [mask-image:radial-gradient(260px_circle_at_var(--mx,50%)_var(--my,50%),black,transparent)]" />
      </div>
      <StarsWide />

      {/* The intro (.hero-line, .hero-subtitle, .hero-action) is plain CSS in globals.css, so the text is painted with the HTML instead of waiting for the JS bundle. */}
      <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 py-24 md:py-32 text-center">
        <StarsCompact />
        {/* data-stars-avoid: the wide sky keeps icons clear of these boxes. */}
        <HeroTitle />
        <p data-stars-avoid className="hero-subtitle text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          {t("hero.subtitle")}
        </p>
        <div data-stars-avoid className="flex flex-col sm:flex-row gap-4 justify-center">
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
