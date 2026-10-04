"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SectionGlow from "@/components/SectionGlow";
import ContactModal from "@/components/ContactModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PRICES_PATH, SERVICE_GROUPS, servicePath, slugsOf, type ServiceCopy } from "@/lib/services";

type GroupCopy = { title: string; text: string };

// The page that lists every service, grouped. It is the one place all the
// service pages link from, so each of them is two clicks from the home page.
export default function ServicesHub() {
  const { t } = useTranslation();
  const groups = t("servicePages.hub.groups", { returnObjects: true }) as Record<string, GroupCopy>;
  const crumbs = [
    { name: t("servicePages.common.breadcrumbHome"), href: "/" },
    { name: t("servicePages.common.breadcrumbServices") },
  ];

  return (
    <>
      <Navigation />
      <SmoothScroll>
        <main className="bg-page">
          <section className="relative isolate overflow-hidden px-5 pt-32 pb-12 sm:px-6 md:pt-40 md:pb-16">
            <SectionGlow />
            <div className="mx-auto max-w-7xl">
              <Breadcrumbs items={crumbs} label={t("servicePages.common.breadcrumbLabel")} />
              <h1 className="max-w-4xl font-heading text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-[2.75rem]">
                {t("servicePages.hub.title")}
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
                {t("servicePages.hub.lead")}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <ContactModal place="Страница: все услуги" size="lg">
                  {t("servicePages.common.ctaButton")}
                </ContactModal>
                <Link
                  href={PRICES_PATH}
                  className="text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
                >
                  {t("servicePages.hub.pricesLink")}
                </Link>
              </div>
            </div>
          </section>

          {SERVICE_GROUPS.map((group, index) => (
            <section
              key={group}
              aria-labelledby={`hub-${group}`}
              className={`px-5 py-12 sm:px-6 md:py-16 ${index % 2 === 0 ? "bg-band" : "bg-page"}`}
            >
              <div className="mx-auto max-w-7xl">
                <h2 id={`hub-${group}`} className="font-heading text-2xl font-bold text-white sm:text-3xl">
                  {groups[group].title}
                </h2>
                <p className="mt-3 max-w-3xl leading-relaxed text-gray-400">{groups[group].text}</p>
                <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {slugsOf(group).map((slug) => {
                    const copy = t(`servicePages.items.${slug}`, { returnObjects: true }) as ServiceCopy;
                    return (
                      <li key={slug}>
                        <Link
                          href={servicePath(slug)}
                          className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/3 p-6 transition-colors hover:border-white/25 hover:bg-white/5"
                        >
                          <span className="flex items-start justify-between gap-4">
                            <span className="font-heading text-lg font-bold text-white">{copy.name}</span>
                            <svg
                              aria-hidden="true"
                              viewBox="0 0 24 24"
                              className="mt-1 h-5 w-5 shrink-0 text-gray-500 transition duration-300 group-hover:translate-x-1 group-hover:text-white"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </span>
                          <span className="mt-3 flex-1 leading-relaxed text-gray-400">{copy.short}</span>
                          <span className="mt-5 text-sm font-semibold text-violet-300">{copy.price}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </section>
          ))}

          <section className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 bg-[linear-gradient(to_bottom,var(--band)_0px,var(--page)_180px,var(--page)_100%)]">
            <SectionGlow />
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
                {t("servicePages.hub.ctaTitle")}
              </h2>
              <p className="mt-4 text-lg text-gray-300">{t("servicePages.hub.ctaText")}</p>
              <div className="mt-8 flex justify-center">
                <ContactModal place="Страница: все услуги" size="lg">
                  {t("servicePages.common.ctaButton")}
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
