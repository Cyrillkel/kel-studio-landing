"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import LanguageSwitcher from "./LanguageSwitcher";
import { ButtonLink } from "./Button";

export default function Navigation() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const topBarRef = useRef<HTMLSpanElement>(null);
  const midBarRef = useRef<HTMLSpanElement>(null);
  const bottomBarRef = useRef<HTMLSpanElement>(null);
  const burgerTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const top = topBarRef.current!;
    const mid = midBarRef.current!;
    const bottom = bottomBarRef.current!;

    const ctx = gsap.context(() => {
      // Squeeze the bars to the center first, then twist them into an X.
      burgerTl.current = gsap
        .timeline({ paused: true })
        .to(mid, { x: 8, opacity: 0, duration: 0.2, ease: "power2.in" }, 0)
        .to(top, { y: 7, duration: 0.22, ease: "power2.in" }, 0)
        .to(bottom, { y: -7, duration: 0.22, ease: "power2.in" }, 0)
        .to(top, { rotate: 45, duration: 0.5, ease: "back.out(2.2)" }, 0.22)
        .to(bottom, { rotate: -45, duration: 0.5, ease: "back.out(2.2)" }, 0.22)
        .to(
          [top.firstElementChild, bottom.firstElementChild],
          { opacity: 1, duration: 0.35, ease: "power1.out" },
          0.22
        );
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = burgerTl.current;
    if (!tl) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      tl.progress(isOpen ? 1 : 0).pause();
    } else if (isOpen) {
      tl.timeScale(1).play();
    } else {
      tl.timeScale(1.4).reverse();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    // overflow: hidden (not position: fixed) keeps programmatic anchor jumps
    // from the menu links working while user scrolling is blocked.
    const root = document.documentElement;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // The overlay is hidden from lg up; close it (and release the lock) if
    // the viewport grows past that, e.g. rotating a phone to landscape.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

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
            <div className="font-heading text-2xl font-bold whitespace-nowrap text-white">
              KEL Studio
            </div>

            <div className="hidden lg:flex items-center gap-8">
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
              <ButtonLink
                href="#contact"
                size="sm"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                {t("nav.contact")}
              </ButtonLink>
              <LanguageSwitcher />
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <LanguageSwitcher />
              <button
                type="button"
                aria-label={t("nav.menu")}
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                className="relative z-50 -mr-2 flex h-10 w-10 cursor-pointer items-center justify-center"
                onClick={() => setIsOpen(!isOpen)}
              >
                <span aria-hidden="true" className="relative block h-4 w-6">
                  <span
                    ref={topBarRef}
                    className="absolute left-0 top-0 h-0.5 w-full rounded-full bg-white"
                  >
                    <span className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 opacity-0" />
                  </span>
                  <span
                    ref={midBarRef}
                    className="absolute right-0 top-1/2 h-0.5 w-4 -translate-y-1/2 rounded-full bg-white"
                  />
                  <span
                    ref={bottomBarRef}
                    className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-white"
                  >
                    <span className="absolute inset-0 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500 opacity-0" />
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-40 overflow-y-auto overscroll-contain bg-[#0a0a0a]/95 backdrop-blur-md lg:hidden"
        >
          <div className="flex min-h-full flex-col items-center justify-center space-y-8 py-24 text-center">
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
            <ButtonLink
              href="#contact"
              variant="outline"
              className="mt-2"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              {t("nav.contact")}
            </ButtonLink>
          </div>
        </div>
      )}
    </>
  );
}
