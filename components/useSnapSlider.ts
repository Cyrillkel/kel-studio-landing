"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// How long the slider stays put after the visitor used it, and after the
// pointer left it, before it may turn by itself again.
const AFTER_MANUAL_MS = 8000;
const AFTER_LEAVE_MS = 2000;

// Horizontal slider (mobile by default) on native scroll-snap: the centered slide is
// full size and bright, neighbours shrink and dim as they move away.
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
          const center = slider.scrollLeft + slider.clientWidth / 2;
          let closest = 0;
          let closestDistance = Infinity;

          slides.forEach((slide, index) => {
            const offset = slide.offsetLeft + slide.offsetWidth / 2 - center;
            const a = Math.min(1, Math.abs(offset) / slide.offsetWidth);

            if (!reduceMotion) {
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

  const scrollTo = useCallback(
    (index: number) => {
      const slider = sliderRef.current;
      const slide = slider?.querySelectorAll<HTMLElement>(slideSelector)[index];
      if (!slider || !slide) return;

      slider.scrollTo({
        left: slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2,
        behavior: "smooth",
      });
    },
    [slideSelector]
  );

  // For the controls (dots, arrows): the visitor is in charge, so autoplay waits.
  const scrollToSlide = useCallback(
    (index: number) => {
      pausedUntil.current = Date.now() + AFTER_MANUAL_MS;
      scrollTo(index);
    },
    [scrollTo]
  );

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
