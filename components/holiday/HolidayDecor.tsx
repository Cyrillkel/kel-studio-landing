"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { holidayOn } from "@/lib/holiday";

const Snowfall = dynamic(() => import("./Snowfall"), { ssr: false });
const Sleigh = dynamic(() => import("./Sleigh"), { ssr: false });

// The moving part of the New Year decorations (lib/holiday.ts): the snow and the sleigh.
// Their code is a chunk of its own, fetched only after the page has loaded and the browser is
// idle, so they cost nothing to the first paint or the PageSpeed score. Visitors whose system
// asks for less motion get neither; the hat on the logo stays, it does not move.
export default function HolidayDecor() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!holidayOn() || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let idle = 0;
    let timer = 0;
    const start = () => {
      // Safari has no requestIdleCallback.
      if (typeof window.requestIdleCallback === "function") idle = window.requestIdleCallback(() => setOn(true), { timeout: 3000 });
      else timer = window.setTimeout(() => setOn(true), 1500);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, []);

  if (!on) return null;
  return (
    <>
      <Snowfall />
      <Sleigh />
    </>
  );
}
