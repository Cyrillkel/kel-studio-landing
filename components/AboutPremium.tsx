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

  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const content = contentRef.current;
    const grid = gridRef.current;

    if (!section || !title || !content || !grid) return;

    const ctx = gsap.context(() => {
      gsap.set([title, content, grid], { opacity: 0, y: 60 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 40%",
          toggleActions: "play none none reverse",
        },
      });

      tl.to(title, { opacity: 1, y: 0, duration: 1, ease: "power3.out" })
        .to(
          content,
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        )
        .to(
          grid,
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        );
    }, section);

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);

    // Safety net: ScrollTrigger's start/end percentages can miss on some
    // viewport/layout combinations, leaving the content stuck at opacity 0.
    // IntersectionObserver is a separate, more reliable visibility signal —
    // if the section becomes visible and the GSAP reveal hasn't run yet,
    // force it so content is never permanently invisible.
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          gsap.getProperty(title, "opacity") === 0
        ) {
          gsap.to([title, content, grid], {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
          });
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(section);

    return () => {
      window.removeEventListener("load", refresh);
      observer.disconnect();
      ctx.revert();
    };
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
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-start">
          {/* Левая колонка - Заголовок */}
          <div>
            <h2
              ref={titleRef}
              className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none bg-gradient-to-br from-white via-gray-200 to-gray-500 bg-clip-text text-transparent"
            >
              {t("about.titleLine1")}
              <br />
              {t("about.titleLine2")}
            </h2>
          </div>

          {/* Правая колонка - Контент */}
          <div ref={contentRef} className="space-y-6 sm:space-y-8">
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-300 leading-relaxed font-light">
              {t("about.lead")}
            </p>
            <p className="text-base sm:text-lg text-gray-400 leading-relaxed">
              {t("about.body")}
            </p>
          </div>
        </div>

        {/* Сетка фокусов */}
        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12 sm:mt-16 md:mt-24"
        >
          {focuses.map((focus, index) => (
            <div
              key={index}
              className="group relative p-6 sm:p-8 border border-white/10 rounded-2xl bg-white/[0.02] backdrop-blur-sm transition-all duration-500 hover:border-white/30 hover:bg-white/[0.05] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]"
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
