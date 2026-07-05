"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Navigation() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (smoothNavigate(href)) {
      e.preventDefault();
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-heading text-2xl font-bold text-white">
              KEL Studio
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a
                href="#services"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#services")}
              >
                {t("nav.services")}
              </a>
              <a
                href="#pricing"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#pricing")}
              >
                {t("nav.pricing")}
              </a>
              <a
                href="#portfolio"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#portfolio")}
              >
                {t("nav.portfolio")}
              </a>
              <a
                href="#about"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#about")}
              >
                {t("nav.about")}
              </a>
              <a
                href="#contact"
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                {t("nav.contact")}
              </a>
              <LanguageSwitcher />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <LanguageSwitcher />
              <button
                className="text-white z-50 relative"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-center">
            <a
              href="#services"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#services")}
            >
              {t("nav.services")}
            </a>
            <a
              href="#pricing"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#pricing")}
            >
              {t("nav.pricing")}
            </a>
            <a
              href="#portfolio"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#portfolio")}
            >
              {t("nav.portfolio")}
            </a>
            <a
              href="#about"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#about")}
            >
              {t("nav.about")}
            </a>
            <a
              href="#contact"
              className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition text-xl"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              {t("nav.contact")}
            </a>
          </div>
        </div>
      )}
    </>
  );
}
