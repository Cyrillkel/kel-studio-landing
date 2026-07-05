"use client";

import { useTranslation } from "react-i18next";

type ProjectItem = { title: string; description: string };

export default function Portfolio() {
  const { t } = useTranslation();
  const items = t("portfolio.items", { returnObjects: true }) as ProjectItem[];

  return (
    <section
      id="portfolio"
      className="py-16 md:py-24 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#141414_180px,#141414_calc(100%-200px),#000000_100%)]"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-10 md:mb-16 text-center text-white">
          {t("portfolio.heading")}
        </h2>
        <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl aspect-video bg-[#1f1f1f] md:hover:-translate-y-2 md:hover:shadow-2xl md:hover:shadow-black/40 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-heading text-xl sm:text-2xl font-bold mb-2 text-white">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-300">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
