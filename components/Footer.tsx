"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import ContactLinks from "./ContactLinks";
import { smoothTop } from "./smoothNavigate";

export default function Footer() {
  const { t } = useTranslation();
  const onHome = usePathname() === "/";
  return (
    <footer className="py-12 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#1a1a1a_180px,#1a1a1a_100%)]">
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
      </div>
    </footer>
  );
}
