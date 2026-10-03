"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// How long the slider stays put after the visitor used it, and after the
// pointer left it, before it may turn by itself again.
const AFTER_MANUAL_MS = 8000;
const AFTER_LEAVE_MS = 2000;

// Slides snap either to the center of the slider (phones, tablets) or to its
// left edge (the portfolio on desktop). Read from the CSS (`snap-center` or
// `snap-start` on the slide), so the layout alone decides, at every width.
const alignsToStart = (slide: HTMLElement) =>
  getComputedStyle(slide).scrollSnapAlign.includes("start");

// Where the slider has to scroll to so that `slide` sits in its snap position.
const positionOf = (slider: HTMLElement, slide: HTMLElement) => {
  const left = alignsToStart(slide)
    ? slide.offsetLeft
    : slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2;
  return Math.max(0, Math.min(left, slider.scrollWidth - slider.clientWidth));
};

// Horizontal slider (mobile by default) on native scroll-snap. Centered slides:
// the middle one is full size and bright, neighbours shrink and dim as they move
// away. Start-aligned slides: all the same, the first one sits at the left edge.
//
// Buttons, dots and autoplay move it with a slow eased animation (the browser's
// own smooth scroll is short and fights the snapping); swipes and trackpad
// gestures stay native.
//
// With `autoplayMs` the slides also advance by themselves, looping back to the
// first. It holds still while the pointer is over the slider or focus is inside
// it, after any gesture or click on the controls, while the slider is off
// screen, in a hidden tab, and for visitors who asked for reduced motion.
export function useSnapSlider(
  slideSelector: string,
  query = "(max-width: 767px)",
  { autoplayMs = 0 }: { autoplayMs?: number } = {}
) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  // The same value for code that must not re-run on every change (autoplay).
  const activeRef = useRef(0);
  const pausedUntil = useRef(0);
  const tween = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: query,
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isMobile, reduceMotion } = context.conditions as {
          isMobile: boolean;
          reduceMotion: boolean;
        };
        if (!isMobile) return;

        const slides = gsap.utils.toArray<HTMLElement>(slideSelector, slider);
        let frame = 0;

        // Styles are written directly (no tweens) because this runs on every
        // scroll frame.
        const update = () => {
          frame = 0;
          const atStart = alignsToStart(slides[0]);
          const reference = atStart
            ? slider.scrollLeft
            : slider.scrollLeft + slider.clientWidth / 2;
          let closest = 0;
          let closestDistance = Infinity;

          slides.forEach((slide, index) => {
            const offset = atStart
              ? slide.offsetLeft - reference
              : slide.offsetLeft + slide.offsetWidth / 2 - reference;
            const a = Math.min(1, Math.abs(offset) / slide.offsetWidth);

            if (atStart) {
              // Equal slides; clears what the centered layout left behind
              // after a resize.
              slide.style.transform = "";
              slide.style.opacity = "";
            } else if (!reduceMotion) {
              slide.style.transform = `scale(${1 - a * 0.08})`;
              slide.style.opacity = String(1 - a * 0.35);
            }
            if (Math.abs(offset) < closestDistance) {
              closestDistance = Math.abs(offset);
              closest = index;
            }
          });

          activeRef.current = closest;
          setActiveSlide(closest);
        };

        const schedule = () => {
          if (!frame) frame = requestAnimationFrame(update);
        };

        update();
        slider.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);

        return () => {
          cancelAnimationFrame(frame);
          slider.removeEventListener("scroll", schedule);
          window.removeEventListener("resize", schedule);
          // Written outside GSAP, so matchMedia can't revert them on its own.
          gsap.set(slides, { clearProps: "transform,opacity" });
        };
      }
    );

    return () => mm.revert();
  }, [slideSelector, query]);

  // Ends a running move and gives the snapping back to the browser.
  const stopMove = useCallback(() => {
    if (!tween.current) return;
    tween.current.kill();
    tween.current = null;
    sliderRef.current?.style.removeProperty("scroll-snap-type");
  }, []);

  const scrollTo = useCallback(
    (index: number) => {
      const slider = sliderRef.current;
      const slide = slider?.querySelectorAll<HTMLElement>(slideSelector)[index];
      if (!slider || !slide) return;

      stopMove();
      const target = positionOf(slider, slide);
      const distance = Math.abs(target - slider.scrollLeft);
      if (distance < 1) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        slider.scrollTo({ left: target, behavior: "auto" });
        return;
      }

      // Snapping is off while the move runs (it would pull the slider back to
      // the nearest slide on every frame) and on again when it ends. Longer
      // trips, like looping back to the first slide, take a little longer.
      slider.style.setProperty("scroll-snap-type", "none");
      const position = { x: slider.scrollLeft };
      tween.current = gsap.to(position, {
        x: target,
        duration: Math.min(1.5, 0.9 + (distance / slider.clientWidth) * 0.25),
        ease: "power2.inOut",
        onUpdate: () => {
          slider.scrollLeft = position.x;
        },
        onComplete: () => {
          tween.current = null;
          slider.style.removeProperty("scroll-snap-type");
        },
      });
    },
    [slideSelector, stopMove]
  );

  // For the controls (dots, arrows): the visitor is in charge, so autoplay waits.
  const scrollToSlide = useCallback(
    (index: number) => {
      pausedUntil.current = Date.now() + AFTER_MANUAL_MS;
      scrollTo(index);
    },
    [scrollTo]
  );

  // A swipe, a wheel turn, a press or a key during a move hands control back.
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    slider.addEventListener("pointerdown", stopMove);
    slider.addEventListener("touchstart", stopMove, { passive: true });
    slider.addEventListener("wheel", stopMove, { passive: true });
    slider.addEventListener("keydown", stopMove);
    return () => {
      slider.removeEventListener("pointerdown", stopMove);
      slider.removeEventListener("touchstart", stopMove);
      slider.removeEventListener("wheel", stopMove);
      slider.removeEventListener("keydown", stopMove);
      stopMove();
    };
  }, [stopMove]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!autoplayMs || !slider) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let onScreen = false;
    let held = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { threshold: 0.5 }
    );
    observer.observe(slider);

    const timer = window.setInterval(() => {
      if (!onScreen || held || document.hidden) return;
      if (Date.now() < pausedUntil.current) return;
      const count = slider.querySelectorAll(slideSelector).length;
      if (count > 1) scrollTo((activeRef.current + 1) % count);
    }, autoplayMs);

    const hold = () => {
      held = true;
    };
    const release = () => {
      held = false;
      pausedUntil.current = Math.max(pausedUntil.current, Date.now() + AFTER_LEAVE_MS);
    };
    // Any gesture on the slider means the visitor is using it.
    const gesture = () => {
      pausedUntil.current = Date.now() + AFTER_MANUAL_MS;
    };

    slider.addEventListener("pointerenter", hold);
    slider.addEventListener("pointerleave", release);
    slider.addEventListener("focusin", hold);
    slider.addEventListener("focusout", release);
    slider.addEventListener("touchstart", gesture, { passive: true });
    slider.addEventListener("wheel", gesture, { passive: true });
    slider.addEventListener("keydown", gesture);

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
      slider.removeEventListener("pointerenter", hold);
      slider.removeEventListener("pointerleave", release);
      slider.removeEventListener("focusin", hold);
      slider.removeEventListener("focusout", release);
      slider.removeEventListener("touchstart", gesture);
      slider.removeEventListener("wheel", gesture);
      slider.removeEventListener("keydown", gesture);
    };
  }, [autoplayMs, slideSelector, scrollTo]);

  return { sliderRef, activeSlide, scrollToSlide };
}
