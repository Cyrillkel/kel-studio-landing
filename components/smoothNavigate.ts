"use client";

import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Back to the top of the page with the same eased move as the anchors.
export function smoothTop(): boolean {
  const smoother = ScrollSmoother.get();
  if (!smoother) return false;

  gsap.to(smoother, {
    scrollTop: 0,
    duration: 1.4,
    ease: "power2.inOut",
    overwrite: "auto",
  });

  return true;
}

export function smoothNavigate(target: string): boolean {
  const smoother = ScrollSmoother.get();
  if (!smoother) return false;

  const maxScroll = ScrollTrigger.maxScroll(window);
  const y = gsap.utils.clamp(0, maxScroll, smoother.offset(target, "top top"));

  gsap.to(smoother, {
    scrollTop: y,
    duration: 1.6,
    ease: "power2.inOut",
    overwrite: "auto",
  });

  return true;
}

// Brings an element up to just under the fixed header, unless its top is
// already in the upper part of the screen. With the smooth scroller (desktop)
// it eases like the anchors; on phones the browser scrolls smoothly.
export function revealBelowHeader(target: string, gap = 96): void {
  const element = document.querySelector(target);
  if (!element) return;
  const top = element.getBoundingClientRect().top;
  if (top >= gap - 8 && top <= window.innerHeight * 0.35) return;

  const smoother = ScrollSmoother.get();
  if (smoother) {
    const y = gsap.utils.clamp(0, ScrollTrigger.maxScroll(window), smoother.offset(element, `top ${gap}px`));
    gsap.to(smoother, { scrollTop: y, duration: 1.2, ease: "power2.inOut", overwrite: "auto" });
    return;
  }
  window.scrollTo({ top: window.scrollY + top - gap, behavior: "smooth" });
}
