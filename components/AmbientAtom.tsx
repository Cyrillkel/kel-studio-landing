"use client";

import { useEffect, useState } from "react";

type Orbit = {
  rotate: number;
  color: string;
  duration: string;
};

const orbits: Orbit[] = [
  { rotate: 0, color: "#818cf8", duration: "7s" },
  { rotate: 60, color: "#e879f9", duration: "9s" },
  { rotate: 120, color: "#22d3ee", duration: "11s" },
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
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#67e8f9" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="100" cy="100" r="14" fill="url(#atom-nucleus-glow)" />
        <circle cx="100" cy="100" r="4" fill="#a5f3fc" />

        {orbits.map((orbit, i) => (
          <g key={i} transform={`rotate(${orbit.rotate} 100 100)`}>
            <ellipse
              cx="100"
              cy="100"
              rx="90"
              ry="34"
              fill="none"
              stroke={orbit.color}
              strokeOpacity="0.35"
            />
            <g transform="translate(100 100) scale(1 0.378)">
              <circle cx="90" cy="0" r="4" fill={orbit.color}>
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
