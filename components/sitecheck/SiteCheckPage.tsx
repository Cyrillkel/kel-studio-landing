"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SectionGlow from "@/components/SectionGlow";
import Breadcrumbs from "@/components/Breadcrumbs";
import RichText from "@/components/RichText";
import HeroFacts from "@/components/HeroFacts";
import FaqList from "@/components/services/FaqList";
import PulseButton from "@/components/pulse/PulseButton";
import { useLang, useLocalePath } from "@/components/useLang";
import { PULSE_PATH } from "@/lib/pulse";
import SiteCheckForm from "./SiteCheckForm";

type Item = { title: string; text: string };
type Faq = { q: string; a: string };
type Fact = { label: string; value: string };

// Line icons of what the check looks at, in the order of siteCheck.includes.
const ICONS = [
  <path key="up" d="M3 12h4l3-7 4 14 3-7h4" />,
  <path key="tls" d="M7 11V7a5 5 0 0 1 10 0v4M6 11h12a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" />,
  <path key="domain" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />,
  <path key="search" d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4M8 11h6" />,
  <path key="ai" d="M10 4l1.8 4.7L16.5 10.5l-4.7 1.8L10 17l-1.8-4.7L3.5 10.5l4.7-1.8zM18 14l.9 2.1 2.1.9-2.1.9L18 20l-.9-2.1-2.1-.9 2.1-.9z" />,
  <path key="meta" d="M7 7h.01M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9z" />,
];

// kel.agency/site-check: the free on-page website check, what it looks at and
// what it does not, and the bot that keeps checking afterwards.
export default function SiteCheckPage() {
  const { t } = useTranslation();
  const lang = useLang();
  const lp = useLocalePath();
  const includes = t("siteCheck.includes", { returnObjects: true }) as Item[];
  const faq = t("siteCheck.faq", { returnObjects: true }) as Faq[];
  const facts = t("siteCheck.facts", { returnObjects: true }) as Fact[];
  const crumbs = [
    { name: t("servicePages.common.breadcrumbHome"), href: lp("/") },
    { name: t("siteCheck.crumb") },
  ];

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <main className="bg-page">
          <section className="relative isolate overflow-hidden px-5 pt-32 pb-16 sm:px-6 md:pt-40 md:pb-20 print:p-0">
            <SectionGlow />
            <div className="mx-auto max-w-page">
              <Breadcrumbs items={crumbs} label={t("servicePages.common.breadcrumbLabel")} />
              <h1 className="max-w-3xl font-heading text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-5xl print:hidden">
                {t("siteCheck.title")}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl print:hidden">{t("siteCheck.lead")}</p>
              <HeroFacts items={facts} className="mt-6 print:hidden" />
              <div className="mt-8 print:mt-0">
                <SiteCheckForm />
              </div>
            </div>
          </section>

          <section className="bg-band px-5 py-12 sm:px-6 md:py-16 print:hidden">
            <div className="mx-auto max-w-page">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t("siteCheck.includesTitle")}</h2>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {includes.map((item, index) => (
                  <li key={item.title} className="rounded-2xl border border-white/10 bg-white/3 p-6">
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
                        {ICONS[index]}
                      </svg>
                    </span>
                    <h3 className="mt-5 font-heading text-lg font-bold text-white">{item.title}</h3>
                    <p className="mt-2 leading-relaxed text-gray-300">{item.text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-10 max-w-3xl">
                <h3 className="font-heading text-xl font-bold text-white">{t("siteCheck.limitsTitle")}</h3>
                <p className="mt-3 leading-relaxed text-gray-400">
                  <RichText text={t("siteCheck.limitsText")} />
                </p>
              </div>
            </div>
          </section>

          <section className="bg-page px-5 py-12 sm:px-6 md:py-16 print:hidden">
            <div className="mx-auto max-w-page">
              <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-card-violet p-6 sm:p-10">
                <div
                  aria-hidden="true"
                  className="glow-wash absolute inset-0 -z-10 [--glow-shape:ellipse_at_12%_50%] [--glow-color:var(--glow-visual)] [--glow-end:70%]"
                />
                <div className="grid items-center gap-6 md:grid-cols-[auto_1fr]">
                  <Image
                    src="/pulse/robot.webp"
                    width={320}
                    height={320}
                    alt=""
                    className="h-20 w-20 rounded-full shadow-[0_0_0_2px_rgba(167,139,250,0.5),0_0_40px_rgba(124,58,237,0.4)] sm:h-24 sm:w-24"
                  />
                  <div>
                    <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t("siteCheck.botTitle")}</h2>
                    <p className="mt-3 max-w-3xl leading-relaxed text-gray-300">{t("siteCheck.botText")}</p>
                    <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                      <PulseButton source={lang === "en" ? "site_check_page_en" : "site_check_page"} place="Анализ сайта, блок бота" size="md">
                        {t("siteCheck.botCta")}
                      </PulseButton>
                      <Link
                        href={lp(PULSE_PATH)}
                        className="text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
                      >
                        {t("siteCheck.botMore")}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-band px-5 py-12 sm:px-6 md:py-16 print:hidden">
            {/* The questions keep a reading width but start at the page's left edge, under the logo. */}
            <div className="mx-auto max-w-page *:max-w-3xl">
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("servicePages.common.faqTitle")}
              </h2>
              <FaqList items={faq} />
            </div>
          </section>

          <Footer />
        </main>
      </SmoothScroll>
    </>
  );
}
