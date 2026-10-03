"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { TelegramIcon, WhatsAppIcon } from "./ContactIcons";
import { TELEGRAM_URL, WHATSAPP_URL } from "@/lib/site";

// Round glass buttons, 44px so they are comfortable to tap. Gray until hovered,
// then the brand color of the messenger.
const iconLink =
  "flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-12 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#1a1a1a_180px,#1a1a1a_100%)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center gap-1 md:items-start">
            <span className="font-heading text-2xl font-bold text-white">
              KEL Studio
            </span>
            {/* The brand is the name, the domain is the address: shown together so both stick. */}
            <a
              href="https://kel.agency"
              className="text-sm text-gray-500 transition-colors hover:text-gray-300"
            >
              kel.agency
            </a>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              className={`${iconLink} hover:border-[#2AABEE]/50 hover:bg-[#2AABEE]/10 hover:text-[#2AABEE]`}
            >
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className={`${iconLink} hover:border-[#25D366]/50 hover:bg-[#25D366]/10 hover:text-[#25D366]`}
            >
              <WhatsAppIcon className="h-5 w-5" />
            </a>
          </div>
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
