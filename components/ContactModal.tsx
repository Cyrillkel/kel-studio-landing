"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useTranslation } from "react-i18next";
import ContactForm from "./ContactForm";
import { ButtonLink } from "./Button";
import type { ServiceSlug } from "@/lib/services";

// Opens the same form in a dialog, so a visitor on a service page never has to
// leave it. Native <dialog> gives Esc, the top layer and focus handling for free.
export default function ContactModal({
  place,
  service,
  size = "lg",
  className,
  children,
}: {
  place: string;
  // The service page the button sits on: preselected as the topic in the form.
  service?: ServiceSlug;
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel || !open) return;

    dialog.showModal();
    // The page behind must not scroll while the dialog is up. On desktop the
    // page is scrolled by ScrollSmoother, which listens to wheel and touch
    // events itself, so overflow alone would not stop it.
    const root = document.documentElement;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const tween = reduced
      ? null
      : gsap.from(panel, { y: 24, opacity: 0, duration: 0.35, ease: "power3.out" });

    // Esc is handled by the dialog itself; keep React state in sync.
    const onClose = () => setOpen(false);
    dialog.addEventListener("close", onClose);

    return () => {
      tween?.kill();
      dialog.removeEventListener("close", onClose);
      root.style.overflow = "";
      document.body.style.overflow = "";
      smoother?.paused(false);
      if (dialog.open) dialog.close();
    };
  }, [open]);

  return (
    <>
      <ButtonLink
        href="#contact"
        size={size}
        className={className}
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </ButtonLink>

      <dialog
        ref={dialogRef}
        aria-label={t("contact.heading")}
        className="m-auto w-full max-w-2xl bg-transparent p-4 text-white backdrop:bg-black/70 backdrop:backdrop-blur-sm"
        // A click on the backdrop lands on the dialog itself, not the panel.
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        <div
          ref={panelRef}
          className="relative rounded-2xl border border-white/10 bg-[#141018] p-6 text-center shadow-2xl shadow-black/60 sm:p-8"
        >
          <button
            type="button"
            aria-label={t("contact.close")}
            className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <h2 className="px-8 font-heading text-xl font-bold sm:px-0 sm:text-3xl">{t("contact.heading")}</h2>
          <p className="mt-3 mb-6 text-gray-300">{t("contact.subheading")}</p>
          <ContactForm place={place} service={service} />
        </div>
      </dialog>
    </>
  );
}
