"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";
import SectionGlow from "@/components/SectionGlow";
import ContactModal from "@/components/ContactModal";
import Breadcrumbs from "@/components/Breadcrumbs";
import { PER_TASK_SLUGS, PRICE_TABLE_SLUGS, SERVICES_PATH, servicePath, type ServiceCopy } from "@/lib/services";

type Pair = { title: string; text: string };
type Faq = { q: string; a: string };

// "How much does a site cost": the price list with a link to each service, what
// moves the price, and how a price is agreed. The numbers are the ones from the
// price list on the home page.
export default function PricesPage() {
  const { t } = useTranslation();
  const copy = (slug: string) => t(`servicePages.items.${slug}`, { returnObjects: true }) as ServiceCopy;
  const factors = t("servicePages.pricesPage.factors", { returnObjects: true }) as Pair[];
  const how = t("servicePages.pricesPage.how", { returnObjects: true }) as Pair[];
  const faq = t("servicePages.pricesPage.faq", { returnObjects: true }) as Faq[];
  const crumbs = [
    { name: t("servicePages.common.breadcrumbHome"), href: "/" },
    { name: t("servicePages.pricesPage.crumb") },
  ];

  return (
    <SmoothScroll>
      <main className="bg-[#0a0a0a]">
        <Navigation />

        <section className="relative isolate overflow-hidden px-5 pt-32 pb-12 sm:px-6 md:pt-40 md:pb-16">
          <SectionGlow />
          <div className="mx-auto max-w-7xl">
            <Breadcrumbs items={crumbs} label={t("servicePages.common.breadcrumbLabel")} />
            <h1 className="max-w-4xl font-heading text-3xl leading-tight font-bold text-white sm:text-4xl lg:text-[2.75rem]">
              {t("servicePages.pricesPage.title")}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-relaxed text-gray-300 sm:text-xl">
              {t("servicePages.pricesPage.lead")}
            </p>
            <div className="mt-8">
              <ContactModal place="Страница: цены" size="lg">
                {t("servicePages.pricesPage.cta")}
              </ContactModal>
            </div>
          </div>
        </section>

        <section className="bg-[#111111] px-5 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {t("servicePages.pricesPage.tableTitle")}
            </h2>
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full border-collapse text-left">
                <thead className="bg-white/5 text-xs tracking-wider text-gray-400 uppercase">
                  <tr>
                    <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                      {t("servicePages.pricesPage.colService")}
                    </th>
                    <th scope="col" className="px-4 py-3 font-semibold sm:px-6">
                      {t("servicePages.pricesPage.colPrice")}
                    </th>
                    <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell sm:px-6">
                      {t("servicePages.pricesPage.colTerm")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {PRICE_TABLE_SLUGS.map((slug) => {
                    const row = copy(slug);
                    return (
                      <tr key={slug} className="transition-colors hover:bg-white/3">
                        <th scope="row" className="px-4 py-4 font-normal sm:px-6">
                          <Link
                            href={servicePath(slug)}
                            className="font-heading font-bold text-white underline-offset-4 hover:underline"
                          >
                            {row.name}
                          </Link>
                          <span className="mt-1 block text-sm text-gray-500 sm:hidden">{row.term}</span>
                        </th>
                        <td className="px-4 py-4 font-semibold whitespace-nowrap text-violet-300 sm:px-6">
                          {row.price}
                        </td>
                        <td className="hidden px-4 py-4 text-gray-300 sm:table-cell sm:px-6">{row.term}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-gray-500">
              {t("servicePages.pricesPage.note")}
            </p>

            <h3 className="mt-12 font-heading text-xl font-bold text-white">
              {t("servicePages.pricesPage.otherTitle")}
            </h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-gray-400">{t("servicePages.pricesPage.otherText")}</p>
            <ul className="mt-5 flex flex-wrap gap-3">
              {PER_TASK_SLUGS.map((slug) => (
                <li key={slug}>
                  <Link
                    href={servicePath(slug)}
                    className="inline-block rounded-full border border-white/10 bg-white/3 px-4 py-2 text-gray-300 transition-colors hover:border-white/25 hover:text-white"
                  >
                    {copy(slug).name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#0a0a0a] px-5 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {t("servicePages.pricesPage.factorsTitle")}
            </h2>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {factors.map((factor) => (
                <li key={factor.title} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                  <h3 className="font-heading text-lg font-bold text-white">{factor.title}</h3>
                  <p className="mt-2 leading-relaxed text-gray-300">{factor.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-[#111111] px-5 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {t("servicePages.pricesPage.howTitle")}
            </h2>
            <ol className="mt-8 grid gap-4 md:grid-cols-3">
              {how.map((step, index) => (
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

        <section className="bg-[#0a0a0a] px-5 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">
              {t("servicePages.common.faqTitle")}
            </h2>
            <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-white/3">
              {faq.map((item) => (
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
                  <p className="mt-3 leading-relaxed text-gray-300">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="relative isolate overflow-hidden px-5 py-16 sm:px-6 md:py-24 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#0a0a0a_100%)]">
          <SectionGlow />
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-bold text-white sm:text-4xl">
              {t("servicePages.pricesPage.ctaTitle")}
            </h2>
            <p className="mt-4 text-lg text-gray-300">{t("servicePages.pricesPage.ctaText")}</p>
            <div className="mt-8 flex justify-center">
              <ContactModal place="Страница: цены" size="lg">
                {t("servicePages.pricesPage.cta")}
              </ContactModal>
            </div>
            <Link
              href={SERVICES_PATH}
              className="mt-6 inline-block text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
            >
              {t("servicePages.common.allServices")}
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </SmoothScroll>
  );
}
