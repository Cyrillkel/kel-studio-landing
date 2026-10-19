"use client";

import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { PULSE_PATH } from "@/lib/pulse";
import { SITE_CHECK_PATH, typedHost } from "@/lib/sitecheck";
import { launchCurtain } from "./LaunchCurtain";
import { useLocalePath } from "./useLang";

// A card on the home page with the free tools: an address field that opens the
// website check with the address filled in (it starts at once), and a link to
// the monitoring bot. On the way the curtain with the scanner opens from the
// button (components/LaunchCurtain.tsx), so the click answers at once.
export default function SiteCheckTeaser() {
  const { t } = useTranslation();
  const lp = useLocalePath();

  return (
    <section aria-labelledby="free-check" className="bg-page px-5 sm:px-6">
      <div className="mx-auto max-w-page">
        <div className="relative isolate overflow-hidden rounded-3xl border border-white/10 bg-card-violet p-6 sm:p-10">
          <div
            aria-hidden="true"
            className="glow-wash absolute inset-0 -z-10 [--glow-shape:ellipse_at_12%_50%] [--glow-color:var(--glow-visual)] [--glow-end:70%]"
          />
          <div className="grid items-center gap-6 md:grid-cols-[auto_1fr] md:gap-10">
            <Image
              src="/pulse/robot.webp"
              width={320}
              height={320}
              alt=""
              className="h-20 w-20 rounded-full shadow-[0_0_0_2px_rgba(167,139,250,0.5),0_0_40px_rgba(124,58,237,0.4)] sm:h-28 sm:w-28"
            />
            <div>
              <p className="text-sm font-semibold tracking-wider text-emerald-400 uppercase">{t("siteCheck.teaser.eyebrow")}</p>
              <h2 id="free-check" className="mt-2 font-heading text-2xl font-bold text-white sm:text-3xl">
                {t("siteCheck.teaser.title")}
              </h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-gray-300">{t("siteCheck.teaser.text")}</p>
              <Form
                action={lp(SITE_CHECK_PATH)}
                onSubmit={(event) => {
                  const address = String(new FormData(event.currentTarget).get("url") ?? "").trim();
                  if (!address) return;
                  const button = (event.nativeEvent as SubmitEvent).submitter ?? event.currentTarget.querySelector("button");
                  const box = button?.getBoundingClientRect();
                  launchCurtain({
                    x: box ? box.left + box.width / 2 : window.innerWidth / 2,
                    y: box ? box.top + box.height / 2 : window.innerHeight / 2,
                    host: typedHost(address),
                    title: t("siteCheck.curtain.title"),
                  });
                }}
                className="mt-5 flex max-w-2xl flex-col gap-3 sm:flex-row"
              >
                <label htmlFor="free-check-url" className="sr-only">
                  {t("siteCheck.inputLabel")}
                </label>
                <input
                  id="free-check-url"
                  name="url"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  maxLength={300}
                  placeholder={t("siteCheck.placeholder")}
                  className="h-12 w-full min-w-0 rounded-xl sm:flex-1 border border-white/15 bg-field px-4 text-white placeholder:text-gray-500 focus:border-violet-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="h-12 cursor-pointer rounded-xl bg-white px-6 font-semibold text-black transition-[opacity,translate] duration-200 hover:opacity-90 active:translate-y-px"
                >
                  {t("siteCheck.teaser.submit")}
                </button>
              </Form>
              <Link
                href={lp(PULSE_PATH)}
                className="mt-4 inline-block text-sm text-gray-400 underline underline-offset-4 transition-colors hover:text-white"
              >
                {t("siteCheck.teaser.bot")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
