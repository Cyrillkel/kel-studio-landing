"use client";

import { useEffect, useRef } from "react";

// Santa's sleigh with two reindeer (the lead one with a glowing red nose, and a KEL cube for a
// present) that now and then flies across the screen (lib/holiday.ts): the first time a few
// seconds after the decorations start, then every two minutes or so while the tab is open.
// It is a picture without clicks (pointer-events: none), so it never covers a button.
// Drawn facing left, it flies from the right edge to the left one along a gentle arc, below
// the header. The reindeer bob out of step and move their legs; that motion is SMIL inside
// the SVG, the flight itself is one Web Animation on the wrapper.

const FIRST_FLIGHT = 6_000; // ms
const NEXT_FLIGHT_MIN = 90_000; // ms
const NEXT_FLIGHT_MAX = 150_000; // ms
const SPEED = 130; // px per second
const MIN_DURATION = 7_000; // ms, so on a phone it does not just flash past
const HEADER = 80; // px, the fixed header (components/Navigation.tsx) is about 73 px tall

// Leg poses for the gallop: stretched out and tucked in. Both have the same commands,
// so SMIL can morph one into the other.
const LEGS_OUT =
  "M19 24.5L14.5 28.5L11 28M21.5 25.5L18 30.5L14.8 31M35.5 23.5L41 26.5L45 25.8M37.5 22L43.5 22.8L47.2 21.4";
const LEGS_IN =
  "M19 24.5L16 29.5L18.5 31.5M21.5 25.5L19.5 30.5L22 32.5M35.5 23.5L38.5 28.5L36 31M37.5 22L41.5 27L39.5 29.5";

function Reindeer({ x, y, delay, nose = false }: { x: number; y: number; delay: string; nose?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0 0;0 -1.6;0 0"
        dur="0.8s"
        begin={delay}
        repeatCount="indefinite"
        additive="sum"
      />
      <ellipse cx="27" cy="21" rx="12.5" ry="5.8" />
      <path d="M17 19Q14 13 12.5 9.5L16.5 8Q18.5 13 22.5 17Z" />
      <path d="M16 7.5Q13 5.8 9.5 6.6L5.2 8.6Q4 9.6 5.3 10.4L9.8 11.2Q14 11.6 16.6 10Z" />
      <path d="M15.2 7.2L18.6 5.4L16.6 8.4Z" />
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <path strokeWidth="1.1" d="M13.4 6.6C12.8 3.4 11 1.8 8.6 1.2M11.6 3.2L10.6 0.4M12.3 4.6L9.6 4.4" />
        <path strokeWidth="1.1" d="M15 6.4C15.6 3.2 17.6 1.6 20 1.2M16.6 3L17.2 0.2M16 4.5L18.8 4.6" />
        <path strokeWidth="1.8" d={LEGS_OUT}>
          <animate attributeName="d" values={`${LEGS_OUT};${LEGS_IN};${LEGS_OUT}`} dur="0.8s" begin={delay} repeatCount="indefinite" />
        </path>
        <path strokeWidth="2" d="M39 17.5L42 15.8" />
      </g>
      {nose && (
        <circle cx="4.9" cy="9.4" r="1.7" fill="#f43f5e" style={{ filter: "drop-shadow(0 0 2px #f43f5e)" }}>
          <animate attributeName="opacity" values="1;0.55;1" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  );
}

function Team() {
  return (
    <svg viewBox="-2 -2 236 44" className="block h-auto w-full overflow-visible" fill="currentColor">
      {/* Reins from Santa's hand over the back reindeer, and the trace between the two. */}
      <g fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.7">
        <path d="M143 19.5Q110 11 70 18" />
        <path d="M74 25Q58 27 40 22" />
      </g>
      <Reindeer x={0} y={2} delay="0s" nose />
      <Reindeer x={54} y={4} delay="-0.4s" />
      <g transform="translate(112 2)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="0 0;0 -1;0 0"
          dur="1.2s"
          repeatCount="indefinite"
          additive="sum"
        />
        <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
          <path d="M66 36L12 36C5 36 2 33 3.5 29.5C4.6 27 7.6 27.4 7.6 29.6" />
          <path d="M20 30L20 36M50 30L50 36" />
        </g>
        {/* The present: the KEL cube in the brand colours. */}
        <path d="M57 6L62 9L57 12L52 9Z" fill="#22d3ee" />
        <path d="M52 9L57 12L57 18L52 15Z" fill="#e879f9" />
        <path d="M57 12L62 9L62 15L57 18Z" fill="#8b5cf6" />
        {/* Santa: coat, arm with the reins, face, beard, hat. */}
        <path d="M36 22Q36 11 43 10Q50 11 50 22Z" fill="#ef4444" />
        <path d="M38 15L31 17.5" stroke="#ef4444" strokeWidth="2.6" strokeLinecap="round" />
        <circle cx="40.5" cy="8" r="3.6" fill="#fde4cf" />
        <path d="M37 8.6Q37.6 14.8 41.2 13.6Q44.2 12.4 44.2 8.8Q40.6 10.4 37 8.6Z" fill="#f8fafc" />
        <path d="M36.8 5.6Q39.6 -0.6 45.6 2.2L47 4.8Q44.2 4.2 44 5.6Z" fill="#ef4444" />
        <rect x="36.4" y="4.4" width="8.2" height="2" rx="1" fill="#f8fafc" />
        <circle cx="47.2" cy="4.8" r="1.3" fill="#f8fafc" />
        <path d="M9 21L58 21L61 12Q63.5 9.5 66 11.5L63 30L17 30Q10 30 9 21Z" fill="#e11d48" />
        <path d="M12 25.5L62 25.5" stroke="#fbbf24" strokeWidth="1.2" opacity="0.9" />
      </g>
      {/* Sparkles behind the sleigh. */}
      {[
        [186, 30, 1.2, "#22d3ee", "0s"],
        [196, 25, 0.9, "#a78bfa", "0.3s"],
        [207, 32, 1.1, "#e879f9", "0.6s"],
        [219, 27, 0.8, "#22d3ee", "0.15s"],
        [230, 31, 0.7, "#a78bfa", "0.45s"],
      ].map(([cx, cy, r, fill, begin]) => (
        <circle key={`${cx}`} cx={cx} cy={cy} r={r} fill={fill as string}>
          <animate attributeName="opacity" values="1;0.2;1" dur="0.9s" begin={begin as string} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}

export default function Sleigh() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    let flight: Animation | null = null;

    const schedule = (delay: number) => {
      timer = window.setTimeout(fly, delay);
    };

    // Waits for the tab to be visible: a flight nobody sees is a wasted one.
    const fly = () => {
      if (document.hidden) {
        document.addEventListener("visibilitychange", fly, { once: true });
        return;
      }
      const width = window.innerWidth;
      const height = window.innerHeight;
      const team = el.offsetWidth;
      const from = width + 20;
      const to = -team - 20;
      const base = HEADER + Math.random() * Math.max(40, height * 0.22);
      const arc = 18 + Math.random() * 24;
      // A gentle arc as nine points; linear steps between them look smooth at this size.
      const keyframes = Array.from({ length: 9 }, (_, i) => {
        const t = i / 8;
        const x = from + (to - from) * t;
        const y = base - Math.sin(t * Math.PI) * arc;
        return { transform: `translate(${x}px, ${y}px)` };
      });
      const duration = Math.max(MIN_DURATION, ((from - to) / SPEED) * 1000);
      el.style.visibility = "visible";
      flight = el.animate(keyframes, { duration, easing: "linear" });
      flight.onfinish = () => {
        el.style.visibility = "hidden";
        schedule(NEXT_FLIGHT_MIN + Math.random() * (NEXT_FLIGHT_MAX - NEXT_FLIGHT_MIN));
      };
    };

    schedule(FIRST_FLIGHT);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", fly);
      flight?.cancel();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[60] w-36 text-white/90 sm:w-52 print:hidden"
    >
      <Team />
    </div>
  );
}
