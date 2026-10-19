"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SectionGlow from "@/components/SectionGlow";
import ContactModal from "@/components/ContactModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import FaqList from "@/components/services/FaqList";
import { useLang, useLocalePath } from "@/components/useLang";
import PulseButton from "./PulseButton";

type Item = { title: string; text: string };
type Faq = { q: string; a: string };
type FreePlan = { name: string; note: string; items: string[] };
type MorePlan = { name: string; note: string; text: string; cta: string };

// Line icons of the checks, in the order of pulse.checks.
const CHECK_ICONS = [
  <path key="up" d="M3 12h4l3-7 4 14 3-7h4" />,
  <path key="tls" d="M7 11V7a5 5 0 0 1 10 0v4M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" />,
  <path key="domain" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />,
  <path key="search" d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4M8 11h6" />,
  <path key="basics" d="M9 12h6M9 16h6M8 3h6l5 5v12a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" />,
  <path key="links" d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />,
];

function Tick() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="mt-0.5 h-5 w-5 shrink-0" fill="none">
      <circle cx="10" cy="10" r="9" className="fill-violet-400/15 stroke-violet-400" strokeWidth="1.5" />
      <path d="M6.5 10.3l2.4 2.4 4.6-5.2" className="stroke-violet-300" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// kel.agency/pulse: the free monitoring bot, what it checks, how to connect it,
// what it costs (free now, paid plans later) and the questions people ask.
export default function PulsePage() {
  const { t } = useTranslation();
  const lang = useLang();
  const lp = useLocalePath();
  const checks = t("pulse.checks", { returnObjects: true }) as Item[];
  const steps = t("pulse.steps", { returnObjects: true }) as Item[];
  const free = t("pulse.freePlan", { returnObjects: true }) as FreePlan;
  const more = t("pulse.morePlan", { returnObjects: true }) as MorePlan;
  const faq = t("pulse.faq", { returnObjects: true }) as Faq[];
  const place = "Страница: мониторинг сайта";
  const source = lang === "en" ? "site_page_en" : "site_page";
  const crumbs = [
    { name: t("servicePages.common.breadcrumbHome"), href: lp("/") },
    { name: t("pulse.crumb") },
  ];

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <main className="bg-page">
          <section className="relative isolate overflow-hidden px-5 pt-32 pb-16 sm:px-6 md:pt-40 md:pb-24">
            <SectionGlow />
            <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
              <div>
                <Breadcrumbs items={crumbs} label={t("servicePages.common.breadcrumbLabel")} />
                <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-300">
                  <span aria-hidden="true" className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  {t("pulse.eyebrow")}
                </p>
                <h1 className="mt-5 max-w-3xl font-heading text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-[2.75rem]">
                  {t("pulse.title")}
                </h1>
                <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-300 sm:text-xl">{t("pulse.lead")}</p>
                <div className="mt-8 flex flex-col items-start gap-3">
                  <PulseButton source={source} place={place}>
                    {t("pulse.cta")}
                  </PulseButton>
                  <p className="text-sm text-gray-500">{t("pulse.ctaNote")}</p>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[300px] lg:max-w-[320px]">
                <div
                  aria-hidden="true"
                  className="glow-wash absolute -inset-16 [--glow-shape:ellipse_at_50%_50%] [--glow-color:var(--glow-visual)] [--glow-end:70%]"
                />
                <Image
                  src={`/pulse/phone-${lang}.webp`}
                  width={640}
                  height={1320}
                  alt={t("pulse.phoneAlt")}
                  priority
                  sizes="(min-width: 1024px) 320px, 300px"
                  className="relative h-auto w-full drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                />
                <Image
                  src="/pulse/robot.webp"
                  width={320}
                  height={320}
                  alt=""
                  className="absolute bottom-16 -left-20 hidden h-28 w-28 rounded-full shadow-[0_0_0_3px_rgba(167,139,250,0.55),0_18px_40px_rgba(0,0,0,0.5),0_0_60px_rgba(124,58,237,0.45)] sm:block lg:-left-24"
                />
              </div>
            </div>
          </section>

          <section className="bg-band px-5 py-12 sm:px-6 md:py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t("pulse.checksTitle")}</h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {checks.map((check, index) => (
                  <li key={check.title} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-white">
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {CHECK_ICONS[index]}
                      </svg>
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-bold text-white">{check.title}</h3>
                    <p className="mt-2 leading-relaxed text-gray-300">{check.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="bg-page px-5 py-12 sm:px-6 md:py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t("pulse.stepsTitle")}</h2>
              <ol className="mt-8 grid gap-4 md:grid-cols-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="rounded-2xl border border-white/10 bg-white/3 p-6">
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

          <section className="bg-band px-5 py-12 sm:px-6 md:py-16">
            <div className="mx-auto max-w-7xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t("pulse.plansTitle")}</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-linear-to-br from-cyan-400 via-violet-500 to-fuchsia-500 p-px">
                  <div className="flex h-full flex-col rounded-[15px] bg-card p-6 sm:p-8">
                    <p className="font-heading text-2xl font-bold text-white">{free.name}</p>
                    <p className="mt-1 text-gray-400">{free.note}</p>
                    <ul className="mt-6 space-y-3">
                      {free.items.map((item) => (
                        <li key={item} className="flex gap-3 text-gray-200">
                          <Tick />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8">
                      <PulseButton source={source} place={`${place}, тариф`} size="md">
                        {t("pulse.cta")}
                      </PulseButton>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col rounded-2xl border border-white/10 bg-white/3 p-6 sm:p-8">
                  <p className="font-heading text-2xl font-bold text-white">{more.name}</p>
                  <p className="mt-1 text-gray-400">{more.note}</p>
                  <p className="mt-6 leading-relaxed text-gray-300">{more.text}</p>
                  <div className="mt-auto pt-8">
                    <ContactModal place={`${place}, несколько сайтов`} variant="outline">
                      {more.cta}
                    </ContactModal>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-page px-5 py-12 sm:px-6 md:py-16">
            <div className="mx-auto max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("servicePages.common.faqTitle")}
              </h2>
              <FaqList items={faq} />
            </div>
          </section>

          <section className="relative isolate overflow-hidden bg-page px-5 py-16 sm:px-6 md:py-24">
            <SectionGlow />
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">{t("pulse.finalTitle")}</h2>
              <p className="mt-4 text-lg text-gray-300">{t("pulse.finalText")}</p>
              <div className="mt-8 flex justify-center">
                <PulseButton source={source} place={`${place}, низ`}>
                  {t("pulse.cta")}
                </PulseButton>
              </div>
              <p className="mt-10 text-gray-400">{t("pulse.helpText")}</p>
              <div className="mt-4 flex justify-center">
                <ContactModal place={`${place}, помощь`} variant="outline">
                  {t("pulse.helpCta")}
                </ContactModal>
              </div>
            </div>
          </section>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
