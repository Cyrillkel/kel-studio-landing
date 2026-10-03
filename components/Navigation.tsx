"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import LanguageSwitcher from "./LanguageSwitcher";
import { ButtonLink } from "./Button";
import { PhoneIcon, TelegramIcon, WhatsAppIcon } from "./ContactIcons";
import { SERVICE_SLUGS, servicePath } from "@/lib/services";
import { PHONE, PHONE_URL, TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site";

export default function Navigation() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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
    // Without a background the page content slides right under the logo and
    // the burger; the bar gets one as soon as anything scrolls past it.
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  // Anchors only scroll when the section is on this page; from a service page
  // they are ordinary links back to the home page.
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    hash: string
  ) => {
    if (onHome && smoothNavigate(hash)) {
      e.preventDefault();
    }
    setIsOpen(false);
    setServicesOpen(false);
  };

  const anchor = (hash: string) => (onHome ? hash : `/${hash}`);

  return (
    <>
      <nav
        className={`fixed top-0 right-0 left-0 z-50 transition-colors duration-300 ${
          scrolled && !isOpen
            ? "border-b border-white/5 bg-[#0a0a0a]/85 backdrop-blur-md"
            : "backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="font-heading text-2xl font-bold whitespace-nowrap text-white">
              KEL Studio
            </div>

            <div className="hidden lg:flex items-center gap-8">
              {/* Opens on hover and on focus, so mouse and keyboard both work. */}
              <div
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
                onFocus={() => setServicesOpen(true)}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) setServicesOpen(false);
                }}
              >
                <a
                  href={anchor("#services")}
                  className="flex items-center gap-1.5 py-2 text-gray-300 transition hover:text-white"
                  aria-expanded={servicesOpen}
                  onClick={(e) => handleNavClick(e, "#services")}
                >
                  {t("nav.services")}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </a>
                <div
                  className={`absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition duration-200 ${
                    servicesOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#120f18] p-2 shadow-2xl shadow-black/60">
                    {SERVICE_SLUGS.map((slug) => (
                      <Link
                        key={slug}
                        href={servicePath(slug)}
                        className="block rounded-xl px-4 py-2.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                        onClick={() => setServicesOpen(false)}
                      >
                        {t(`servicePages.items.${slug}.title`)}
                      </Link>
                    ))}
                    <a
                      href={anchor("#services")}
                      className="mt-1 block rounded-xl border-t border-white/10 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:text-white"
                      onClick={(e) => handleNavClick(e, "#services")}
                    >
                      {t("nav.allServices")}
                    </a>
                  </div>
                </div>
              </div>
              <a
                href={anchor("#pricing")}
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#pricing")}
              >
                {t("nav.pricing")}
              </a>
              <a
                href={anchor("#portfolio")}
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#portfolio")}
              >
                {t("nav.portfolio")}
              </a>
              <a
                href={anchor("#about")}
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#about")}
              >
                {t("nav.about")}
              </a>
              <ButtonLink
                href={anchor("#contact")}
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
                className="relative z-50 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/10"
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
            <div className="flex w-full flex-col items-center">
              <div className="flex items-center gap-2">
                <a
                  href={anchor("#services")}
                  className="text-2xl text-gray-300 transition hover:text-white"
                  onClick={(e) => handleNavClick(e, "#services")}
                >
                  {t("nav.services")}
                </a>
                <button
                  type="button"
                  aria-label={t("nav.openServices")}
                  aria-expanded={servicesOpen}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center text-gray-400"
                  onClick={() => setServicesOpen((open) => !open)}
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className={`h-4 w-4 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </div>
              {servicesOpen && (
                <div className="mt-4 flex w-full flex-col items-center gap-3 border-y border-white/10 py-4">
                  {SERVICE_SLUGS.map((slug) => (
                    <Link
                      key={slug}
                      href={servicePath(slug)}
                      className="text-lg text-gray-400 transition-colors hover:text-white"
                      onClick={() => {
                        setIsOpen(false);
                        setServicesOpen(false);
                      }}
                    >
                      {t(`servicePages.items.${slug}.title`)}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <a
              href={anchor("#pricing")}
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#pricing")}
            >
              {t("nav.pricing")}
            </a>
            <a
              href={anchor("#portfolio")}
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#portfolio")}
            >
              {t("nav.portfolio")}
            </a>
            <a
              href={anchor("#about")}
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#about")}
            >
              {t("nav.about")}
            </a>
            <ButtonLink
              href={anchor("#contact")}
              variant="outline"
              className="mt-2"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              {t("nav.contact")}
            </ButtonLink>

            {/* Direct contacts: the number dials on tap, the messengers open their apps. */}
            <div className="menu-rise w-full max-w-sm px-6">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-500">
                {t("nav.reachDirect")}
              </p>
              <a
                href={PHONE_URL}
                className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-3 pr-5 text-left transition-colors hover:border-white/25 hover:bg-white/10"
              >
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-linear-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/25">
                  <PhoneIcon className="h-5 w-5" />
                </span>
                <span className="flex flex-col">
                  <span className="text-xs text-gray-400">{t("nav.call")}</span>
                  <span className="whitespace-nowrap text-xl font-semibold tabular-nums text-white">
                    {PHONE}
                  </span>
                </span>
              </a>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-gray-200 transition-colors hover:border-[#2AABEE]/50 hover:bg-[#2AABEE]/10 hover:text-white"
                >
                  <TelegramIcon className="h-5 w-5 text-[#2AABEE]" />
                  Telegram
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-2xl border border-white/10 bg-white/5 py-3.5 text-gray-200 transition-colors hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-white"
                >
                  <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
