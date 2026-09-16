"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { ButtonLink } from "./Button";

gsap.registerPlugin(ScrollTrigger);

type FaqEntry = { question: string; answer: string };

function FaqItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: FaqEntry;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);
  const prevOpen = useRef(isOpen);
  // Inline styles stay frozen at their first-render values so React never
  // re-applies height/transform on toggle and GSAP owns them afterwards.
  const [initialOpen] = useState(isOpen);

  useEffect(() => {
    // Compare with the previous value instead of skipping the first run:
    // StrictMode re-runs effects on mount and would otherwise animate.
    if (prevOpen.current === isOpen) return;
    prevOpen.current = isOpen;

    const panel = panelRef.current;
    const bar = barRef.current;
    const accent = accentRef.current;
    if (!panel || !bar || !accent) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduce ? 0 : 0.5;

    const tl = gsap.timeline({
      defaults: { duration, ease: "power3.inOut", overwrite: "auto" },
      // Page height changed - let ScrollSmoother/ScrollTrigger re-measure.
      onComplete: () => ScrollTrigger.refresh(),
    });

    tl.to(panel, { height: isOpen ? "auto" : 0 })
      .to(bar, { rotate: isOpen ? 90 : 0 }, 0)
      .to(accent, { scaleX: isOpen ? 1 : 0 }, 0);

    if (isOpen) {
      tl.fromTo(
        panel.firstElementChild,
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out" },
        duration * 0.3
      );
    }
  }, [isOpen]);

  return (
    <div className="faq-item relative border-b border-white/10">
      <h3>
        <button
          type="button"
          id={`faq-question-${index}`}
          aria-expanded={isOpen}
          aria-controls={`faq-answer-${index}`}
          onClick={onToggle}
          className="group flex w-full cursor-pointer items-center justify-between gap-6 py-6 text-left"
        >
          <span
            className={`text-lg sm:text-xl font-medium transition-colors duration-300 group-hover:text-white ${
              isOpen ? "text-white" : "text-gray-300"
            }`}
          >
            {item.question}
          </span>
          <span
            aria-hidden="true"
            className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 group-hover:border-white/40 ${
              isOpen ? "border-white/30 text-white" : "border-white/15 text-gray-400"
            }`}
          >
            <span className="relative h-3.5 w-3.5">
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
              <span
                ref={barRef}
                className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current"
                style={{ transform: initialOpen ? "rotate(90deg)" : "none" }}
              />
            </span>
          </span>
        </button>
      </h3>
      <div
        ref={panelRef}
        id={`faq-answer-${index}`}
        role="region"
        aria-labelledby={`faq-question-${index}`}
        inert={!isOpen}
        className="overflow-hidden"
        style={{ height: initialOpen ? "auto" : 0 }}
      >
        <p className="pb-6 pr-12 text-gray-400 leading-relaxed">{item.answer}</p>
      </div>
      <span
        ref={accentRef}
        aria-hidden="true"
        className="absolute -bottom-px left-0 h-px w-full origin-left bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
        style={{ transform: initialOpen ? "scaleX(1)" : "scaleX(0)" }}
      />
    </div>
  );
}

export default function Faq() {
  const { t } = useTranslation();
  const items = t("faq.items", { returnObjects: true }) as FaqEntry[];
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia(section);

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const intro = section.querySelector(".faq-intro")!;
      const list = section.querySelector(".faq-list")!;

      const tl = gsap
        .timeline({ paused: true, defaults: { ease: "power3.out" } })
        .from(intro.children, { y: 30, opacity: 0, duration: 0.9, stagger: 0.12 })
        .from(
          list.querySelectorAll(".faq-item"),
          { y: 24, opacity: 0, duration: 0.7, stagger: 0.08 },
          0.2
        );

      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => tl.play(),
      });

      // Safety net like AboutPremium/Process: never leave the block hidden
      // if the ScrollTrigger start gets skipped.
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          if (tl.progress() === 0 && !tl.isActive()) tl.play();
          observer.disconnect();
        },
        { rootMargin: "0px 0px -35% 0px" }
      );
      observer.observe(section);

      return () => observer.disconnect();
    });

    return () => mm.revert();
  }, []);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (smoothNavigate("#contact")) {
      e.preventDefault();
    }
  };

  return (
    <section
      id="faq"
      ref={sectionRef}
      className="relative py-16 md:py-28 bg-[linear-gradient(to_bottom,#000000_0px,#0a0a0a_180px,#0a0a0a_calc(100%-180px),#000000_100%)]"
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-6 grid gap-10 lg:grid-cols-[1fr_1.7fr] lg:gap-20">
        <div className="faq-intro">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {t("faq.heading")}
          </h2>
          <p className="mt-4 text-gray-400 leading-relaxed">
            {t("faq.subheading")}
          </p>
          {/* Wrapper takes the GSAP reveal so the link keeps its own translate press effect. */}
          <div className="mt-8">
            <ButtonLink
              href="#contact"
              variant="outline"
              onClick={handleContactClick}
            >
              {t("faq.cta")}
            </ButtonLink>
          </div>
        </div>

        <div className="faq-list border-t border-white/10">
          {items.map((item, index) => (
            <FaqItem
              key={index}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
