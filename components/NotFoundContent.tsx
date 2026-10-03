"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { ButtonLink } from "./Button";
import { SERVICE_SLUGS, servicePath } from "@/lib/services";

// The 404 page: a wrong address still leads somewhere (home, the services).
export default function NotFoundContent() {
  const { t } = useTranslation();

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0a0a0a] px-6 py-24 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.18),transparent_60%)]"
      />
      <Link href="/" className="relative font-heading text-xl font-bold text-white">
        KEL Studio
      </Link>
      <p
        aria-hidden="true"
        className="relative mt-10 bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500 bg-clip-text font-heading text-8xl font-bold text-transparent sm:text-9xl"
      >
        404
      </p>
      <h1 className="relative mt-6 font-heading text-2xl font-bold text-white sm:text-4xl">
        {t("notFound.title")}
      </h1>
      <p className="relative mt-4 max-w-md text-gray-400">{t("notFound.text")}</p>
      <ButtonLink href="/" size="lg" className="relative mt-8">
        {t("notFound.home")}
      </ButtonLink>
      <nav
        aria-label={t("notFound.services")}
        className="relative mt-12 flex max-w-xl flex-wrap justify-center gap-x-6 gap-y-3 text-gray-400"
      >
        {SERVICE_SLUGS.map((slug) => (
          <Link
            key={slug}
            href={servicePath(slug)}
            className="transition-colors hover:text-white"
          >
            {t(`servicePages.items.${slug}.name`)}
          </Link>
        ))}
      </nav>
    </main>
  );
}
