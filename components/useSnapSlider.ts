"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Horizontal slider (mobile by default) on native scroll-snap: the centered slide is
// full size and bright, neighbours shrink and dim as they move away.
export function useSnapSlider(
  slideSelector: string,
  query = "(max-width: 767px)"
) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

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

  const scrollToSlide = (index: number) => {
    const slider = sliderRef.current;
    const slide = slider?.querySelectorAll<HTMLElement>(slideSelector)[index];
    if (!slider || !slide) return;

    slider.scrollTo({
      left: slide.offsetLeft - (slider.clientWidth - slide.offsetWidth) / 2,
      behavior: "smooth",
    });
  };

  return { sliderRef, activeSlide, scrollToSlide };
}
