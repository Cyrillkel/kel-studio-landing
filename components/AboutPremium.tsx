"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import AmbientBlobs from "./AmbientBlobs";

gsap.registerPlugin(ScrollTrigger);

type FocusItem = { title: string; description: string };

export default function AboutPremium() {
  const { t } = useTranslation();
  const focuses = t("about.focuses", { returnObjects: true }) as FocusItem[];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = new Map<Element, gsap.core.Timeline>();

      const reveal = (trigger: Element, tl: gsap.core.Timeline) => {
        reveals.set(trigger, tl);
        ScrollTrigger.create({
          trigger,
          start: "top 85%",
          once: true,
          onEnter: () => tl.play(),
        });
      };

      const intro = section.querySelector(".about-intro")!;
      reveal(
        intro,
        gsap
          .timeline({ paused: true, defaults: { ease: "power3.out" } })
          .from(".about-line", {
            yPercent: 110,
            duration: 1.1,
            ease: "expo.out",
            stagger: 0.12,
          })
          .from(
            ".about-copy > *",
            { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 },
            0.25
          )
      );

      const grid = section.querySelector(".about-grid")!;
      reveal(
        grid,
        gsap.timeline({ paused: true }).from(".about-card", {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
        })
      );

      // Safety net: if a ScrollTrigger start is skipped, play the same
      // timeline (never a second, competing tween) once the block is in view.
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const tl = reveals.get(entry.target);
            if (tl && tl.progress() === 0 && !tl.isActive()) tl.play();
            observer.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -35% 0px" }
      );
      reveals.forEach((_, el) => observer.observe(el));

      return () => observer.disconnect();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative isolate py-20 sm:py-32 md:py-48 overflow-hidden bg-black"
    >
      <AmbientBlobs
        blobs={[
          {
            side: "right",
            vertical: "top-1/4",
            size: "w-52 h-52 sm:w-72 sm:h-72 md:w-96 md:h-96",
            gradient:
              "bg-[linear-gradient(135deg,rgba(217,70,239,0.55),rgba(168,85,247,0.45),rgba(99,102,241,0.4),rgba(34,211,238,0.35))]",
            delay: "-9s",
            morph: true,
          },
        ]}
      />
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-12">
        <div className="about-intro grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-start">
          <h2 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none">
            {[t("about.titleLine1"), t("about.titleLine2")].map((line) => (
              <span key={line} className="block overflow-hidden pb-2">
                <span className="about-line block bg-linear-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <div className="about-copy space-y-6 sm:space-y-8">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 leading-relaxed font-light">
              {t("about.lead")}
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              {t("about.body")}
            </p>
          </div>
        </div>

        <div className="about-grid grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-24">
          {focuses.map((focus, index) => (
            <div
              key={index}
              className="about-card group relative p-6 sm:p-8 border border-white/10 rounded-2xl bg-white/2 transition-[border-color,background-color,box-shadow] duration-500 hover:border-white/30 hover:bg-white/5 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <h3 className="font-heading text-xl font-bold text-white mb-3 transition-colors duration-300 group-hover:text-gray-100">
                {focus.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed transition-colors duration-300 group-hover:text-gray-300">
                {focus.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
