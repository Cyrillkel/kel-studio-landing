"use client";

import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import AmbientAtom from "./AmbientAtom";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert(t("contact.successAlert"));
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-16 md:py-24 bg-[linear-gradient(to_bottom,#000000_0px,#0a0a0a_180px,#0a0a0a_100%)]"
    >
      <AmbientAtom className="-left-10 top-4 w-56 h-56 sm:w-72 sm:h-72 md:w-80 md:h-80 -z-10" />
      <div className="max-w-4xl mx-auto px-5 sm:px-6 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-white">
          {t("contact.heading")}
        </h2>
        <p className="text-lg sm:text-xl text-gray-300 mb-8 sm:mb-12">
          {t("contact.subheading")}
        </p>
        <div className="bg-[#141414] p-6 sm:p-8 md:p-12 rounded-2xl border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <input
                type="text"
                placeholder={t("contact.namePlaceholder")}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
                className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-5 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
              />
              <input
                type="email"
                placeholder={t("contact.emailPlaceholder")}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
                className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-5 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition"
              />
            </div>
            <textarea
              placeholder={t("contact.messagePlaceholder")}
              rows={5}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              required
              className="w-full bg-[#1f1f1f] border border-white/10 rounded-lg px-5 sm:px-6 py-3 sm:py-4 text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition resize-none"
            />
            <button
              type="submit"
              className="w-full bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
            >
              {t("contact.submit")}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
