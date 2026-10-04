"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SectionGlow from "@/components/SectionGlow";
import ContactModal from "@/components/ContactModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import RichText from "@/components/RichText";
import Assurances from "@/components/services/Assurances";
import ServiceIllustration from "@/components/services/ServiceIllustration";
import { SERVICE_CONFIG, SERVICES_PATH, servicePath, type ServiceCopy, type ServiceSlug } from "@/lib/services";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type PortfolioItem = { title: string; description: string; image: string; url: string };

export default function ServicePage({ slug }: { slug: ServiceSlug }) {
  const { t } = useTranslation();
  const page = t(`servicePages.items.${slug}`, { returnObjects: true }) as ServiceCopy;
  const portfolio = t("portfolio.items", { returnObjects: true }) as PortfolioItem[];
  const rootRef = useRef<HTMLElement>(null);
  const heroActionRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLElement>(null);
  const [showStickyCta, setShowStickyCta] = useState(false);

  // On phones the page is long. Once the hero button has scrolled away, a
  // button stays at the bottom of the screen; it hides again at the closing block.
  useEffect(() => {
    const hero = heroActionRef.current;
    const closing = finalRef.current;
    if (!hero || !closing) return;
    let heroVisible = true;
    let closingVisible = false;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === hero) heroVisible = entry.isIntersecting;
        else closingVisible = entry.isIntersecting;
      }
      setShowStickyCta(!heroVisible && !closingVisible);
    });
    observer.observe(hero);
    observer.observe(closing);
    return () => observer.disconnect();
  }, [slug]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia(root);
    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        // matchMedia only runs the callback when some condition matches.
        motionOk: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        gsap.set(".service-reveal", { visibility: "visible" });
        if (reduceMotion) return;

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(".service-title", { y: 28, opacity: 0, duration: 0.9 })
          .from(".service-lead", { y: 24, opacity: 0, duration: 0.8 }, 0.15)
          .from(".service-action", { y: 20, opacity: 0, duration: 0.7 }, 0.35)
          // The scene draws itself while the text settles.
          .from("[data-draw]", { drawSVG: 0, duration: 1.3, ease: "power2.inOut", stagger: 0.05 }, 0.3)
          .from("[data-pop]", { scale: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(2.5)", stagger: 0.06 }, 1.1);

        // Slow drift that never stops: keeps the scene alive without pulling
        // attention from the text.
        gsap.to("[data-float]", {
          y: -8,
          duration: 3,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.4,
        });

        // Lists and cards come in as they reach the viewport.
        gsap.utils.toArray<HTMLElement>(".service-list li").forEach((item) => {
          gsap.from(item, {
            x: -20,
            opacity: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, index) => {
          gsap.from(card, {
            y: 28,
            opacity: 0,
            duration: 0.7,
            delay: index * 0.06,
            ease: "power3.out",
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          });
        });
      }
    );

    return () => mm.revert();
  }, [slug]);

  const { cases: caseIndexes, related } = SERVICE_CONFIG[slug];
  const cases = caseIndexes.map((index) => portfolio[index]).filter(Boolean);
  const place = `Страница услуги: ${page.name}`;
  const crumbs = [
    { name: t("servicePages.common.breadcrumbHome"), href: "/" },
    { name: t("servicePages.common.breadcrumbServices"), href: SERVICES_PATH },
    { name: page.name },
  ];

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <main ref={rootRef} className="bg-page">
          <section className="relative isolate overflow-hidden px-5 pt-32 pb-16 sm:px-6 md:pt-40 md:pb-24">
            <SectionGlow />
            {/* Hidden until the intro runs, so nothing flashes before animating in. */}
            <div
              className="service-reveal mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 md:gap-16"
              style={{ visibility: "hidden" }}
            >
              <div>
                <Breadcrumbs items={crumbs} label={t("servicePages.common.breadcrumbLabel")} />
                <h1 className="service-title font-heading text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-[2.75rem]">
                  {page.title}
                </h1>
                <p className="service-lead mt-6 text-lg leading-relaxed text-gray-300 sm:text-xl">
                  {page.lead}
                </p>
                <dl className="service-action mt-6 flex flex-wrap gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                    <dt className="text-xs tracking-wider text-gray-500 uppercase">
                      {t("servicePages.common.priceLabel")}
                    </dt>
                    <dd className="mt-1 font-semibold text-white">{page.price}</dd>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/3 px-4 py-3">
                    <dt className="text-xs tracking-wider text-gray-500 uppercase">
                      {t("servicePages.common.termLabel")}
                    </dt>
                    <dd className="mt-1 font-semibold text-white">{page.term}</dd>
                  </div>
                </dl>
                <div ref={heroActionRef} className="service-action mt-8 flex flex-col sm:flex-row">
                  <ContactModal place={place} service={slug} size="lg">
                    {page.cta}
                  </ContactModal>
                </div>
                <Assurances className="service-action mt-5" />
              </div>

              <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-card-violet bg-[linear-gradient(var(--grid-line-soft)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line-soft)_1px,transparent_1px)] bg-size-[24px_24px] p-6 sm:p-10">
                <ServiceIllustration slug={slug} />
              </div>
            </div>
          </section>

          <section className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 bg-[linear-gradient(to_bottom,var(--page)_0px,var(--band)_180px,var(--band)_100%)]">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {page.bodyTitle}
              </h2>
              <div className="mt-6 max-w-4xl space-y-4 text-lg leading-relaxed text-gray-300">
                {page.body.map((paragraph) => (
                  <p key={paragraph}>
                    <RichText text={paragraph} />
                  </p>
                ))}
              </div>
            </div>

            <div className="mx-auto mt-16 grid max-w-7xl gap-12 md:grid-cols-2 md:gap-16">
              <div>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {t("servicePages.common.includesTitle")}
                </h2>
                <ul className="service-list mt-8 space-y-4">
                  {page.includes.map((item) => (
                    <li key={item} className="flex gap-4 text-gray-300">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="mt-1 h-5 w-5 shrink-0 text-violet-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m4 12 5 5L20 6" />
                      </svg>
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {page.fitTitle}
                </h2>
                <div className="mt-8 space-y-4">
                  {page.fit.map((item) => (
                    <div
                      key={item}
                      className="service-card rounded-2xl border border-white/10 bg-white/3 p-6 leading-relaxed text-gray-300"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 bg-[linear-gradient(to_bottom,var(--band)_0px,var(--page)_180px,var(--page)_100%)]">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("servicePages.common.stepsTitle")}
              </h2>
              <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {page.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className="service-card rounded-2xl border border-white/10 bg-white/3 p-6"
                  >
                    <span className="font-heading text-sm font-bold text-violet-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-heading text-lg font-bold text-white">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-gray-300">{step.text}</p>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {cases.length > 0 && (
            <section className="relative isolate overflow-hidden bg-page px-5 py-16 sm:px-6 md:py-24">
              <div className="mx-auto max-w-7xl">
                <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {t("servicePages.common.casesTitle")}
                </h2>
                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {cases.map((item) => {
                    const host = item.url ? new URL(item.url).hostname : "";
                    return (
                      <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="service-card group block"
                      >
                        <div className="relative aspect-video overflow-hidden rounded-2xl border border-white/5 bg-card">
                          <Image
                            src={item.image}
                            alt={`${item.title} - ${host}`}
                            fill
                            sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                          />
                        </div>
                        <h3 className="mt-4 font-heading text-lg font-bold text-white">{item.title}</h3>
                        <p className="mt-1 text-gray-400">
                          {item.description}
                          <span className="text-gray-500"> - {host}</span>
                        </p>
                      </a>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          <section className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 bg-[linear-gradient(to_bottom,var(--page)_0px,var(--band)_180px,var(--band)_100%)]">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("servicePages.common.faqTitle")}
              </h2>
              <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/3">
                {page.faq.map((item) => (
                  <details key={item.q} className="group px-5 py-5 sm:px-6">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading text-base font-bold text-white sm:text-lg [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-5 w-5 shrink-0 text-gray-500 transition-transform duration-300 group-open:rotate-180"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </summary>
                    <p className="mt-3 leading-relaxed text-gray-300">
                      <RichText text={item.a} />
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>

          <section
            ref={finalRef}
            className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 bg-[linear-gradient(to_bottom,var(--band)_0px,var(--page)_180px,var(--page)_100%)]"
          >
            <SectionGlow />
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {t("servicePages.common.ctaTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-300">{t("servicePages.common.ctaText")}</p>
              <div className="mt-8 flex justify-center">
                <ContactModal place={place} service={slug} size="lg">
                  {page.cta}
                </ContactModal>
              </div>
              <Assurances className="mt-5 justify-center" />
            </div>

            <div className="mx-auto mt-16 max-w-7xl">
              <h2 className="font-heading text-xl font-bold text-white sm:text-2xl">
                {t("servicePages.common.otherTitle")}
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((other) => (
                  <Link
                    key={other}
                    href={servicePath(other)}
                    className="service-card group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/3 px-6 py-5 transition-colors hover:border-white/25 hover:bg-white/5"
                  >
                    <span className="font-heading font-bold text-white">
                      {t(`servicePages.items.${other}.name`)}
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-6 w-6 shrink-0 text-gray-500 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </Link>
                ))}
              </div>
              <Link
                href={SERVICES_PATH}
                className="mt-6 inline-block text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                {t("servicePages.common.allServices")}
              </Link>
            </div>
          </section>

          {/* Phones only (no smooth scroller there, so fixed positioning is plain). */}
          <div
            inert={!showStickyCta}
            className={`fixed inset-x-0 bottom-0 z-20 border-t border-white/10 bg-page/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
              showStickyCta ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <ContactModal place={place} service={slug} size="lg" className="w-full">
              {page.cta}
            </ContactModal>
          </div>

          <Footer />
        </main>
    </SmoothScroll>
    </>
  );
}
