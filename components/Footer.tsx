"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import ContactLinks from "./ContactLinks";
import { smoothTop } from "./smoothNavigate";
import { BLOG_PATH } from "@/lib/blog-path";
import { MENU_SLUGS, PRICES_PATH, SERVICES_PATH, servicePath } from "@/lib/services";

export default function Footer() {
  const { t } = useTranslation();
  const onHome = usePathname() === "/";
  return (
    <footer className="py-12 bg-[linear-gradient(to_bottom,var(--page)_0px,var(--footer)_180px,var(--footer)_100%)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center gap-1 md:items-start">
            {/* Same as the logo in the header: to the top on the home page, home from any other. */}
            <Link
              href="/"
              aria-label={t("nav.home")}
              className="font-heading text-2xl font-bold text-white"
              onClick={(e) => {
                if (!onHome) return;
                e.preventDefault();
                if (!smoothTop()) window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              KEL Studio
            </Link>
            {/* The brand is the name, the domain is the address: shown together so both stick. */}
            <a
              href="https://kel.agency"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              kel.agency
            </a>
          </div>
          <ContactLinks />
          <div className="flex flex-col items-center gap-2 md:items-end">
            <Link
              href="/privacy"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              {t("footer.privacy")}
            </Link>
            <div className="text-gray-400">{t("footer.copyright")}</div>
          </div>
        </div>
        {/* Every page links to the main sections: a second way in for visitors and crawlers. */}
        <nav aria-label={t("footer.navLabel")} className="mt-10 border-t border-white/5 pt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm text-gray-500">
            <li>
              <Link href={SERVICES_PATH} className="transition-colors hover:text-gray-300">
                {t("nav.allServices")}
              </Link>
            </li>
            <li>
              <Link href={PRICES_PATH} className="transition-colors hover:text-gray-300">
                {t("nav.pricing")}
              </Link>
            </li>
            <li>
              <Link href={BLOG_PATH} className="transition-colors hover:text-gray-300">
                {t("nav.blog")}
              </Link>
            </li>
            {MENU_SLUGS.map((slug) => (
              <li key={slug}>
                <Link href={servicePath(slug)} className="transition-colors hover:text-gray-300">
                  {t(`servicePages.items.${slug}.name`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
