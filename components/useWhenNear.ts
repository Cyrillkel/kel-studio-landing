"use client";

import { useEffect, type RefObject } from "react";

// Section animations create dozens of tweens and ScrollTriggers, and setting
// them up forces layout. Run at page load, that work blocks the first screen
// for no reason: the section is far below the fold. This runs `setup` once
// the element is within a screen or so of the viewport, in an idle slot so it
// doesn't land in the middle of a scroll frame. Without IntersectionObserver
// it runs right away. Like a `[]` effect, `setup` is read only once.
export function useWhenNear<T extends HTMLElement>(
  ref: RefObject<T | null>,
  setup: (element: T) => void | (() => void),
  margin = "150% 0px"
) {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Safari has no requestIdleCallback.
    const hasIdle = typeof window.requestIdleCallback === "function";
    let cleanup: void | (() => void);
    let idle = 0;
    let started = false;
    const start = () => {
      started = true;
      cleanup = setup(element);
    };

    if (typeof IntersectionObserver === "undefined") {
      start();
      return () => cleanup?.();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        observer.disconnect();
        idle = hasIdle
          ? window.requestIdleCallback(start, { timeout: 600 })
          : window.setTimeout(start, 50);
      },
      { rootMargin: margin }
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
      if (!started && idle) {
        if (hasIdle) window.cancelIdleCallback(idle);
        else window.clearTimeout(idle);
      }
      cleanup?.();
    };
    // `setup` and `margin` are deliberately read once, like a `[]` effect.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
