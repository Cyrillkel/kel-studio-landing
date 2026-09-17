"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useTranslation } from "react-i18next";
import AmbientBlobs from "./AmbientBlobs";
import ProcessIllustration from "./ProcessIllustration";
import SectionGlow from "./SectionGlow";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type StepItem = { title: string; description: string };

export default function Process() {
  const { t } = useTranslation();
  const steps = t("process.items", { returnObjects: true }) as StepItem[];
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        // matchMedia only runs the callback when some condition matches.
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          reduceMotion: boolean;
        };
        // Markup is fully visible by default, so reduced motion needs no setup.
        if (reduceMotion) return;

        const reveals = new Map<Element, gsap.core.Timeline>();

        const heading = section.querySelector(".process-heading")!;
        const headingTl = gsap
          .timeline({ paused: true })
          .from(heading.children, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            stagger: 0.15,
          });
        reveals.set(heading, headingTl);
        ScrollTrigger.create({
          trigger: heading,
          start: "top 85%",
          once: true,
          onEnter: () => headingTl.play(),
        });

        // The line tip sits at 60% of the viewport; dots light up at the same point.
        gsap.fromTo(
          ".process-progress",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: ".process-timeline",
              start: "top 60%",
              end: "bottom 60%",
              scrub: true,
            },
          }
        );

        gsap.utils.toArray<HTMLElement>(".process-step").forEach((step) => {
          const q = gsap.utils.selector(step);
          const side = step.dataset.side === "left" ? -1 : 1;
          const cardX = isDesktop ? side * 80 : 40;
          const visualX = isDesktop ? -side * 80 : 40;

          const tl = gsap.timeline({
            paused: true,
            defaults: { ease: "power3.out" },
          });
          tl.from(q(".process-card"), {
            x: cardX,
            opacity: 0,
            filter: "blur(10px)",
            duration: 1,
            clearProps: "filter",
          })
            .from(
              q(".process-visual"),
              { x: visualX, opacity: 0, scale: 0.94, duration: 1.1 },
              0.1
            )
            .from(
              q(".process-number"),
              { yPercent: 110, rotate: 8, duration: 1, ease: "expo.out" },
              0.15
            )
            .from(
              q(".process-connector"),
              { scaleX: 0, duration: 0.6, ease: "power2.out" },
              0.2
            )
            .from(q(".process-title"), { y: 24, opacity: 0, duration: 0.8 }, 0.3)
            .from(
              q(".process-accent"),
              { scaleX: 0, duration: 0.8, ease: "expo.out" },
              0.4
            )
            .from(q(".process-text"), { y: 24, opacity: 0, duration: 0.8 }, 0.45)
            .from(
              q("[data-draw]"),
              {
                drawSVG: 0,
                duration: 1.2,
                ease: "power2.inOut",
                stagger: 0.05,
              },
              0.35
            )
            .from(
              q("[data-pop]"),
              {
                scale: 0,
                transformOrigin: "50% 50%",
                duration: 0.5,
                ease: "back.out(2.5)",
                stagger: 0.06,
              },
              0.95
            );

          reveals.set(step, tl);
          ScrollTrigger.create({
            trigger: step,
            start: "top 75%",
            once: true,
            onEnter: () => tl.play(),
          });

          const dot = q(".process-dot")[0];
          const dotTl = gsap
            .timeline({ paused: true })
            .fromTo(
              q(".process-dot-fill"),
              { scale: 0 },
              { scale: 1, duration: 0.5, ease: "back.out(3)" }
            )
            .fromTo(
              dot,
              { borderColor: "rgba(255,255,255,0.15)" },
              { borderColor: "rgba(232,121,249,0.9)", duration: 0.4 },
              0
            );
          const pulse = gsap.fromTo(
            q(".process-dot-ring"),
            { scale: 1, opacity: 0.9 },
            {
              scale: 3,
              opacity: 0,
              duration: 0.9,
              ease: "power2.out",
              paused: true,
              immediateRender: false,
            }
          );
          ScrollTrigger.create({
            trigger: dot,
            start: "center 60%",
            onEnter: () => {
              dotTl.play();
              pulse.restart();
            },
            onLeaveBack: () => dotTl.reverse(),
          });

          if (isDesktop) {
            gsap.fromTo(
              q(".process-illus"),
              { yPercent: 6 },
              {
                yPercent: -6,
                ease: "none",
                scrollTrigger: {
                  trigger: step,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              }
            );
          }
        });

        // Same safety net as AboutPremium: if a ScrollTrigger start is ever
        // missed, play the reveal once the block is well inside the viewport
        // so content can't stay hidden.
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
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative isolate overflow-hidden py-16 md:py-28 bg-[linear-gradient(to_bottom,#000000_0px,#0a0a0a_180px,#0a0a0a_calc(100%-180px),#000000_100%)]"
    >
      <SectionGlow />
      <AmbientBlobs
        blobs={[
          {
            side: "left",
            vertical: "top-1/3",
            size: "w-44 h-44 sm:w-60 sm:h-60 md:w-80 md:h-80",
            gradient:
              "bg-[linear-gradient(135deg,rgba(34,211,238,0.45),rgba(168,85,247,0.4),rgba(217,70,239,0.3))]",
            delay: "-7s",
          },
        ]}
      />
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="process-heading text-center mb-12 md:mb-20">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-3 text-white">
            {t("process.heading")}
          </h2>
          <p className="text-gray-400">{t("process.subheading")}</p>
        </div>

        <div className="process-timeline relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_6%,black_94%,transparent)]"
          >
            <div className="absolute top-0 bottom-0 left-4 md:left-1/2 w-px -translate-x-1/2 bg-white/10" />
            <div className="process-progress absolute top-0 bottom-0 left-4 md:left-1/2 w-0.5 -translate-x-1/2 origin-top bg-linear-to-b from-cyan-400 via-violet-500 to-fuchsia-500 shadow-[0_0_14px_rgba(168,85,247,0.7)]" />
          </div>

          {/* Cards are filled, not see-through: on narrow screens the ambient blob sits right behind them. */}
          <ol className="relative space-y-14 md:space-y-24">
            {steps.map((step, index) => {
              const isLeft = index % 2 === 0;
              const number = String(index + 1).padStart(2, "0");

              return (
                <li
                  key={index}
                  data-side={isLeft ? "left" : "right"}
                  className="process-step relative grid items-center gap-5 md:grid-cols-2 md:gap-20 pl-12 md:pl-0"
                >
                  <span
                    aria-hidden="true"
                    className="process-dot absolute left-4 md:left-1/2 top-7 md:top-1/2 z-10 h-4 w-4 -translate-x-1/2 md:-translate-y-1/2 rounded-full border border-fuchsia-400/90 bg-[#0a0a0a]"
                  >
                    <span className="process-dot-fill absolute inset-[3px] rounded-full bg-linear-to-br from-cyan-300 to-fuchsia-500" />
                    <span className="process-dot-ring absolute inset-0 rounded-full border border-fuchsia-400 opacity-0" />
                  </span>
                  <span
                    aria-hidden="true"
                    className={`process-connector hidden md:block absolute top-1/2 h-px w-10 bg-fuchsia-400/40 ${
                      isLeft ? "right-1/2 origin-right" : "left-1/2 origin-left"
                    }`}
                  />

                  <div
                    className={`md:row-start-1 ${
                      isLeft ? "md:col-start-1" : "md:col-start-2"
                    }`}
                  >
                    <div
                      className={`process-card rounded-2xl border border-white/10 bg-[#16121e] p-6 sm:p-8 transition-colors duration-500 hover:border-white/25 hover:bg-[#1b1624] ${
                        isLeft ? "md:text-right" : ""
                      }`}
                    >
                      <div className="overflow-hidden pb-1">
                        <span className="process-number inline-block font-heading text-5xl sm:text-6xl font-bold leading-none bg-linear-to-br from-white via-violet-200 to-fuchsia-400 bg-clip-text text-transparent">
                          {number}
                        </span>
                      </div>
                      <h3 className="process-title mt-5 font-heading text-xl sm:text-2xl font-bold text-white">
                        {step.title}
                      </h3>
                      <span
                        aria-hidden="true"
                        className={`process-accent mt-4 block h-0.5 w-16 bg-linear-to-r from-cyan-400 to-fuchsia-500 origin-left ${
                          isLeft ? "md:ml-auto md:origin-right" : ""
                        }`}
                      />
                      <p className="process-text mt-4 text-gray-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`md:row-start-1 ${
                      isLeft ? "md:col-start-2" : "md:col-start-1"
                    }`}
                  >
                    <div className="process-visual relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 bg-[#16121e] bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[24px_24px]">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(168,85,247,0.16),transparent_65%)]"
                      />
                      <div className="absolute inset-0 p-5 sm:p-8">
                        <ProcessIllustration index={index} />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
