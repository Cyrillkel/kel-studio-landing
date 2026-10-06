"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useTranslation } from "react-i18next";
import { smoothNavigate, smoothTop } from "./smoothNavigate";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import { ButtonLink } from "./Button";
import { PhoneIcon, TelegramIcon } from "./ContactIcons";
import ContactLinks from "./ContactLinks";
import { BLOG_PATH } from "@/lib/blog-path";
import { MENU_SLUGS, PRICES_PATH, SERVICES_PATH, servicePath } from "@/lib/services";
import { PHONE, PHONE_URL, TELEGRAM_URL } from "@/lib/site";

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

    // From 768px the page is moved by ScrollSmoother, which handles the wheel and
    // touch itself, so overflow: hidden alone would let the page scroll under the
    // menu. Pausing it first, because it stores the overflow it finds and puts it
    // back on resume.
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    // overflow: hidden (not position: fixed) keeps programmatic anchor jumps
    // from the menu links working while user scrolling is blocked.
    const root = document.documentElement;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    // The panel is hidden from lg up; close it (and release the lock) if
    // the viewport grows past that, e.g. rotating a phone to landscape.
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);

    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      root.style.overflow = "";
      document.body.style.overflow = "";
      smoother?.paused(false);
      desktop.removeEventListener("change", closeOnDesktop);
      window.removeEventListener("keydown", closeOnEscape);
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

  const closeMenu = () => {
    setIsOpen(false);
    setServicesOpen(false);
  };

  return (
    <>
      <nav
        // The border is always there, transparent at the top: a border that only appears
        // with the class starts from `currentcolor` (Tailwind 4's default) and flashes as a
        // white (dark theme) or black (light theme) line under the bar while it fades in.
        className={`fixed top-0 right-0 left-0 z-50 border-b transition-colors duration-300 ${
          isOpen
            ? "border-white/5 bg-page"
            : scrolled
              ? "border-white/5 bg-page/85 backdrop-blur-md"
              : "border-transparent backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* On the home page it scrolls to the top; from any other page it goes home. */}
            <Link
              href="/"
              aria-label={t("nav.home")}
              className="font-heading text-xl font-bold whitespace-nowrap text-white sm:text-2xl"
              onClick={(e) => {
                setIsOpen(false);
                setServicesOpen(false);
                if (!onHome) return;
                e.preventDefault();
                if (!smoothTop()) window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              KEL Studio
            </Link>

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
                <Link
                  href={SERVICES_PATH}
                  className="flex items-center gap-1.5 py-2 text-gray-300 transition hover:text-white"
                  aria-expanded={servicesOpen}
                  onClick={() => setServicesOpen(false)}
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
                </Link>
                <div
                  className={`absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition duration-200 ${
                    servicesOpen
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <div className="overflow-hidden rounded-2xl border border-white/10 bg-popover p-2 shadow-2xl shadow-shade/60">
                    {MENU_SLUGS.map((slug) => (
                      <Link
                        key={slug}
                        href={servicePath(slug)}
                        className="block rounded-xl px-4 py-2.5 text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
                        onClick={() => setServicesOpen(false)}
                      >
                        {t(`servicePages.items.${slug}.name`)}
                      </Link>
                    ))}
                    <Link
                      href={SERVICES_PATH}
                      className="mt-1 block rounded-xl border-t border-white/10 px-4 py-2.5 text-sm text-gray-500 transition-colors hover:text-white"
                      onClick={() => setServicesOpen(false)}
                    >
                      {t("nav.allServices")}
                    </Link>
                  </div>
                </div>
              </div>
              <Link
                href={PRICES_PATH}
                className="text-gray-300 hover:text-white transition"
                onClick={() => setServicesOpen(false)}
              >
                {t("nav.pricing")}
              </Link>
              <Link
                href={BLOG_PATH}
                className="text-gray-300 hover:text-white transition"
                onClick={() => setServicesOpen(false)}
              >
                {t("nav.blog")}
              </Link>
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
              {/* The quickest ways to reach us: round glass buttons like the burger on a phone. */}
              <div className="flex items-center gap-3">
                <a
                  href={PHONE_URL}
                  aria-label={`${t("nav.call")} ${PHONE}`}
                  title={PHONE}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors duration-200 hover:border-violet-400/50 hover:bg-violet-400/10 hover:text-violet-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  <PhoneIcon className="h-5 w-5" />
                </a>
                <a
                  href={TELEGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Telegram"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-300 transition-colors duration-200 hover:border-[#2AABEE]/50 hover:bg-[#2AABEE]/10 hover:text-[#2AABEE] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60"
                >
                  <TelegramIcon className="h-5 w-5" />
                </a>
              </div>
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <LanguageSwitcher />
              </div>
            </div>

            {/* On a phone the logo, the theme button, the language and the burger share one
                row: the logo, the button and the gaps get smaller below 640px (and the language
                arrow goes below 380px, see LanguageSwitcher). */}
            <div className="flex items-center gap-2 sm:gap-3 lg:hidden">
              <ThemeToggle className="h-9 w-9 sm:h-10 sm:w-10" />
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

      {/* A panel hangs from the left edge under the bar; the page next to it is veiled, and a
          tap there closes the menu. Both stay mounted so they can slide and fade out as well as
          in; `inert` keeps the closed panel out of the tab order. */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-40 touch-none bg-page/70 backdrop-blur-sm transition-opacity duration-300 motion-reduce:transition-none lg:hidden ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeMenu}
      />
      {/* top-[73px] is the bar: 16px padding twice, the 40px burger and the 1px border. */}
      <div
        id="mobile-menu"
        inert={!isOpen}
        className={`fixed bottom-0 left-0 top-[73px] z-40 flex w-[min(21rem,calc(100vw-3rem))] flex-col overflow-y-auto overscroll-contain border-r border-white/10 bg-page shadow-2xl shadow-shade/60 transition-[transform,visibility] duration-300 ease-out motion-reduce:transition-none lg:hidden ${
          isOpen ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
          <div>
            {/* Only opens the list below; the section itself is the last item in it. */}
            <button
              type="button"
              aria-expanded={servicesOpen}
              aria-controls="mobile-services"
              className="flex w-full cursor-pointer items-center justify-between py-3 text-left text-xl text-gray-300 transition hover:text-white"
              onClick={() => setServicesOpen((open) => !open)}
            >
              {t("nav.services")}
              <span
                aria-hidden="true"
                className={`grid h-7 w-7 place-items-center rounded-full border transition-all duration-300 ${
                  servicesOpen
                    ? "rotate-180 border-transparent bg-origin-border bg-linear-to-br from-cyan-400 via-violet-500 to-fuchsia-500 text-snow shadow-lg shadow-violet-500/30"
                    : "border-white/15 bg-white/5 text-gray-300"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </button>
            <div
              id="mobile-services"
              inert={!servicesOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                servicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="mb-2 ml-1 flex flex-col border-l border-white/10 py-1 pl-4">
                  {MENU_SLUGS.map((slug) => (
                    <Link
                      key={slug}
                      href={servicePath(slug)}
                      className="py-2 text-base text-gray-400 transition-colors hover:text-white"
                      onClick={closeMenu}
                    >
                      {t(`servicePages.items.${slug}.name`)}
                    </Link>
                  ))}
                  <Link
                    href={SERVICES_PATH}
                    className="py-2 text-sm text-gray-500 transition-colors hover:text-white"
                    onClick={closeMenu}
                  >
                    {t("nav.allServices")}
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={PRICES_PATH}
            className="py-3 text-xl text-gray-300 transition hover:text-white"
            onClick={closeMenu}
          >
            {t("nav.pricing")}
          </Link>
          <Link
            href={BLOG_PATH}
            className="py-3 text-xl text-gray-300 transition hover:text-white"
            onClick={closeMenu}
          >
            {t("nav.blog")}
          </Link>
          <a
            href={anchor("#portfolio")}
            className="py-3 text-xl text-gray-300 transition hover:text-white"
            onClick={(e) => handleNavClick(e, "#portfolio")}
          >
            {t("nav.portfolio")}
          </a>
          <a
            href={anchor("#about")}
            className="py-3 text-xl text-gray-300 transition hover:text-white"
            onClick={(e) => handleNavClick(e, "#about")}
          >
            {t("nav.about")}
          </a>
          <ButtonLink
            href={anchor("#contact")}
            variant="outline"
            className="mt-4 self-start"
            onClick={(e) => handleNavClick(e, "#contact")}
          >
            {t("nav.contact")}
          </ButtonLink>
        </div>

        {/* Direct contacts, pinned to the bottom of the panel: the number dials on
            tap, the messengers and email (the same round buttons as in the footer)
            open their apps. Links scroll under it (it fades in from the panel background). */}
        <div className="sticky bottom-0 shrink-0 bg-linear-to-t from-page from-65% to-transparent px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-8">
          <div
            className={`flex flex-col items-start gap-4 transition duration-500 motion-reduce:transition-none ${
              isOpen ? "translate-y-0 opacity-100 delay-150" : "translate-y-3.5 opacity-0"
            }`}
          >
            <a
              href={PHONE_URL}
              aria-label={`${t("nav.call")} ${PHONE}`}
              className="inline-flex items-center gap-3 text-xl font-semibold text-white"
            >
              <PhoneIcon className="h-6 w-6" />
              <span className="whitespace-nowrap tabular-nums">{PHONE}</span>
            </a>
            <ContactLinks />
          </div>
        </div>
      </div>
    </>
  );
}
