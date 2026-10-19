"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PULSE_PATH } from "@/lib/pulse";
import PulseButton from "./pulse/PulseButton";
import { useLang, useLocalePath } from "./useLang";

// A card on the home page for the free monitoring bot: what it does, a button
// that opens it in Telegram and a link to its page.
export default function PulseTeaser() {
  const { t } = useTranslation();
  const lang = useLang();
  const lp = useLocalePath();

  return (
    <section aria-labelledby="pulse-teaser" className="bg-page px-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-card-violet p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="glow-wash absolute inset-0 -z-10 [--glow-shape:ellipse_at_12%_50%] [--glow-color:var(--glow-visual)] [--glow-end:70%]"
          />
          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-8 lg:grid-cols-[auto_1fr_auto]">
            <Image
              src="/pulse/robot.webp"
              width={320}
              height={320}
              alt=""
              className="h-20 w-20 rounded-full shadow-[0_0_0_2px_rgba(167,139,250,0.5),0_0_40px_rgba(124,58,237,0.4)] sm:h-24 sm:w-24"
            />
            <div>
              <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">{t("pulse.teaser.eyebrow")}</p>
              <h2 id="pulse-teaser" className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("pulse.teaser.title")}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">{t("pulse.teaser.text")}</p>
            </div>
            <div className="flex flex-col items-start gap-3 md:col-span-2 lg:col-span-1 lg:items-end">
              <PulseButton source={lang === "en" ? "site_home_en" : "site_home"} place="Главная, блок бота" size="md">
                {t("pulse.teaser.cta")}
              </PulseButton>
              <Link
                href={lp(PULSE_PATH)}
                className="text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                {t("pulse.teaser.more")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
