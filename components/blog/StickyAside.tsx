"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Distance from the top of the window where the pinned block stops: the fixed
// header is about 72px tall.
const TOP = 96;

// A block that stays in view beside a long article (the table of contents and
// the contact card). CSS `position: sticky` does not work here: on desktop the
// page is scrolled by ScrollSmoother, which moves its content with a transform
// (see SmoothScroll.tsx), so the block is pinned with ScrollTrigger instead.
// The parent must be as tall as the article: it is the grid cell the block
// sits in, and the block is released when the bottom of that cell reaches it.
// Below 1024px, or when the window is too short to hold the block, nothing is
// pinned and it simply scrolls with the page.
export default function StickyAside({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const block = ref.current;
    const cell = block?.parentElement;
    if (!block || !cell) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (min-height: 720px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: block,
        start: `top ${TOP}px`,
        endTrigger: cell,
        end: () => `bottom ${TOP + block.offsetHeight}px`,
        pin: true,
        pinSpacing: false,
        invalidateOnRefresh: true,
      });
      return () => trigger.kill();
    });
    return () => mm.revert();
  }, []);

  return <div ref={ref}>{children}</div>;
}
