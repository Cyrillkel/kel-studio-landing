"use client";

import { useEffect, useState } from "react";

type Orbit = {
  rotate: number;
  color: string;
  duration: string;
};

const orbits: Orbit[] = [
  { rotate: 0, color: "var(--atom-1)", duration: "7s" },
  { rotate: 60, color: "var(--atom-2)", duration: "9s" },
  { rotate: 120, color: "var(--atom-3)", duration: "11s" },
];

export default function AmbientAtom({ className = "" }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    query.addEventListener("change", handler);
    return () => query.removeEventListener("change", handler);
  }, []);

  return (
    <div
      className={`absolute pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full opacity-70">
        <defs>
          <radialGradient id="atom-nucleus-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopOpacity="0.9" style={{ stopColor: "var(--atom-core)" }} />
            <stop offset="100%" stopOpacity="0" style={{ stopColor: "var(--atom-core)" }} />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="14" fill="url(#atom-nucleus-glow)" />
        <circle cx="100" cy="100" r="4" style={{ fill: "var(--atom-core-soft)" }} />

        {orbits.map((orbit, i) => (
          <g key={i} transform={`rotate(${orbit.rotate} 100 100)`}>
            <ellipse
              cx="100"
              cy="100"
              rx="90"
              ry="34"
              fill="none"
              strokeOpacity="0.35"
              style={{ stroke: orbit.color }}
            />
            <g transform="translate(100 100) scale(1 0.378)">
              <circle cx="90" cy="0" r="4" style={{ fill: orbit.color }}>
                {!reducedMotion && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0"
                    to="360"
                    dur={orbit.duration}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            </g>
          </g>
        ))}
      </svg>
    </div>
  );
}
