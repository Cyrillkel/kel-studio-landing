"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useTranslation } from "react-i18next";
import type { PortfolioItem } from "@/lib/portfolio";

// A portfolio card that opens the project's story instead of a link: what the
// product is, what we built and the stack. Used for projects without a public
// address (see lib/portfolio.ts). The card itself is the button; the dialog is a
// native <dialog>, like ContactModal, so Esc, the top layer and focus come for free.
export default function CaseDialog({
  item,
  className,
  children,
}: {
  item: PortfolioItem;
  className?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const [open, setOpen] = useState(false);
  const details = item.case;

  useEffect(() => {
    const dialog = dialogRef.current;
    const panel = panelRef.current;
    if (!dialog || !panel || !open) return;

    // The page behind must not scroll while the dialog is up. On desktop the page
    // is moved by ScrollSmoother, which remembers the overflow it finds when it
    // pauses and puts it back when it resumes: so pause it before locking the page
    // and resume it after unlocking (KEL-STUDIO-CONTEXT.md, pitfall 14).
    const smoother = ScrollSmoother.get();
    smoother?.paused(true);
    const root = document.documentElement;
    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    dialog.showModal();
    // The panel scrolls, and Chrome makes a scroller focusable, so the dialog would
    // focus the whole panel (a ring around the card from the keyboard): start on the
    // close button instead, as before the panel scrolled.
    closeRef.current?.focus();
    panel.scrollTop = 0;

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
      if (dialog.open) dialog.close();
      root.style.overflow = "";
      document.body.style.overflow = "";
      smoother?.paused(false);
    };
  }, [open]);

  if (!details) return <>{children}</>;

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-label={t("portfolio.case.open", { title: item.title })}
        onClick={() => setOpen(true)}
        className={`block w-full cursor-pointer text-left ${className ?? ""}`}
      >
        {children}
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={titleId}
        className="m-auto max-h-[calc(100dvh-2rem)] w-full max-w-4xl overflow-visible bg-transparent p-4 text-white backdrop:bg-scrim backdrop:backdrop-blur-sm"
        // A click on the backdrop lands on the dialog itself, not the panel.
        onClick={(e) => {
          if (e.target === dialogRef.current) setOpen(false);
        }}
      >
        {/* The panel scrolls, not the dialog, so the scrollbar stays inside its rounded
            frame (.dialog-scroll in globals.css). 4rem leaves 1rem of screen above and
            below the dialog plus its own 1rem padding. */}
        <div
          ref={panelRef}
          className="dialog-scroll relative max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain rounded-2xl border border-white/10 bg-dialog p-6 shadow-2xl shadow-shade/60 sm:p-8"
        >
          <button
            ref={closeRef}
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

          <p className="pr-10 text-sm text-gray-400">{details.role}</p>
          <h2 id={titleId} className="mt-2 pr-10 font-heading text-2xl font-bold sm:text-3xl">
            {item.title}
          </h2>
          <p className="mt-4 leading-relaxed text-gray-300">{details.about}</p>
          {details.note && <p className="mt-3 text-sm text-gray-500">{details.note}</p>}

          <div className="mt-6 space-y-4">
            {details.gallery.map((src, index) => (
              <div
                key={src}
                className="relative aspect-video overflow-hidden rounded-xl border border-white/10 bg-card"
              >
                <Image
                  src={src}
                  alt={`${item.title} - ${index + 1}`}
                  fill
                  sizes="(max-width: 895px) 100vw, 830px"
                  className="object-cover object-top"
                />
              </div>
            ))}
          </div>

          <h3 className="mt-8 font-heading text-lg font-bold">{t("portfolio.case.work")}</h3>
          <ul className="mt-3 space-y-2.5 text-gray-300">
            {details.work.map((line) => (
              <li key={line} className="flex gap-3 leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-linear-to-r from-cyan-400 to-fuchsia-500"
                />
                <span>{line}</span>
              </li>
            ))}
          </ul>

          <h3 className="mt-8 font-heading text-lg font-bold">{t("portfolio.case.stack")}</h3>
          <div className="mt-3 space-y-4">
            {details.stack.map((group) => (
              <div key={group.name}>
                <p className="text-sm text-gray-400">{group.name}</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {group.items.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-gray-200"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </dialog>
    </>
  );
}
