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
