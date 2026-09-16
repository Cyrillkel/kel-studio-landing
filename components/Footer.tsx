"use client";

import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="py-12 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#1a1a1a_180px,#1a1a1a_100%)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-heading text-2xl font-bold text-white">
            KEL Studio
          </div>
          <a
            href="https://t.me/io112"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition"
          >
            Telegram
          </a>
          <div className="text-gray-400">{t("footer.copyright")}</div>
        </div>
      </div>
    </footer>
  );
}
