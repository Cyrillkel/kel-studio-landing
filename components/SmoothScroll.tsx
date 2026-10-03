"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current!,
      content: "#smooth-content",
      smooth: 1.4,
      effects: false,
      // The same settings `true` gives, plus: scrollable blocks inside the page
      // (the portfolio slider, a textarea) keep their own wheel and touch
      // scrolling. Without it a trackpad swipe or a finger on a tablet can't
      // move the slider.
      normalizeScroll: { debounce: true, allowNestedScroll: true },
    });

    return () => {
      smoother.kill();
    };
  }, [isMobile]);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content">{children}</div>
    </div>
  );
}
