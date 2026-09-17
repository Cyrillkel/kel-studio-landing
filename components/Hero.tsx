"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { ButtonLink } from "./Button";
import { StarsCompact, StarsWide, useTechStars } from "./hero/TechStars";

export default function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  useTechStars(sectionRef);

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
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.1,
          })
          .from(".hero-subtitle", { y: 24, opacity: 0, duration: 0.7 }, 0.25)
          .from(
            ".hero-action",
            { y: 20, opacity: 0, duration: 0.6, stagger: 0.08 },
            0.45
          );
      }
    );

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

      {/* Hidden until the intro timeline takes over, so SSR text doesn't flash before animating in. */}
      <div
        className="hero-content relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 text-center"
        style={{ visibility: "hidden" }}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: "<style>.hero-content{visibility:visible!important}</style>",
          }}
        />
        <StarsCompact />
        {/* data-stars-avoid: the wide sky keeps icons clear of these boxes. */}
        <h1 data-stars-avoid className="font-heading text-5xl md:text-7xl [@media(max-height:500px)]:text-4xl roomy:text-[clamp(3rem,min(4.6vw,8vh),4.5rem)] font-bold mb-6 leading-tight">
          {[t("hero.titleLine1"), t("hero.titleLine2")].map((line, index) => (
            // Extra bottom padding keeps descenders out of the mask's clip.
            <span key={index} className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
              <span className="hero-line block gradient-text">{line}</span>{" "}
            </span>
          ))}
        </h1>
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
