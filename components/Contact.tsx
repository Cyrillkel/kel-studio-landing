"use client";

import { useTranslation } from "react-i18next";
import AmbientAtom from "./AmbientAtom";
import ContactForm from "./ContactForm";
import SectionGlow from "./SectionGlow";

export default function Contact() {
  const { t } = useTranslation();

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-16 md:py-24 bg-[linear-gradient(to_bottom,var(--deep)_0px,var(--page)_180px,var(--page)_100%)]"
    >
      <SectionGlow />
      <AmbientAtom className="-left-10 top-4 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 -z-10" />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
          {t("contact.heading")}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12">
          {t("contact.subheading")}
        </p>
        <div className="bg-white/3 p-6 sm:p-8 md:p-12 rounded-2xl border border-white/10">
          <ContactForm place="Форма на главной" />
        </div>
      </div>
    </section>
  );
}
