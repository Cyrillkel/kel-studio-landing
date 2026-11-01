"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type PulseRobotProps = {
  className?: string;
  elevated?: boolean;
};

export default function PulseRobot({ className, elevated = false }: PulseRobotProps) {
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    const updateRunning = () => {
      root.dataset.running = String(inView && !document.hidden && !reducedMotion.matches);
    };

    // Observe the stationary wrapper so the float cannot toggle its own visibility.
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= 0.1;
        updateRunning();
      },
      { threshold: 0.1 }
    );
    observer.observe(root);
    document.addEventListener("visibilitychange", updateRunning);
    reducedMotion.addEventListener("change", updateRunning);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", updateRunning);
      reducedMotion.removeEventListener("change", updateRunning);
      root.dataset.running = "false";
    };
  }, []);

  return (
    <span
      ref={rootRef}
      aria-hidden="true"
      data-ready="false"
      data-running="false"
      className={cn("pulse-robot relative block shrink-0", className)}
    >
      <span
        className={cn(
          "pulse-robot__avatar relative block size-full rounded-full",
          elevated
            ? "shadow-[0_0_0_3px_rgba(167,139,250,0.55),0_18px_40px_rgba(0,0,0,0.5),0_0_60px_rgba(124,58,237,0.45)]"
            : "shadow-[0_0_0_2px_rgba(167,139,250,0.5),0_0_40px_rgba(124,58,237,0.4)]"
        )}
      >
        <Image
          src="/pulse/robot.webp"
          width={320}
          height={320}
          alt=""
          // Reuse this same 6 KB file for the eye crops; no extra image requests.
          unoptimized
          className="block size-full rounded-full"
          onLoad={() => {
            if (rootRef.current) rootRef.current.dataset.ready = "true";
          }}
        />
        <span className="pulse-robot__eye-socket pulse-robot__eye-socket--left">
          <span className="pulse-robot__eye" />
        </span>
        <span className="pulse-robot__eye-socket pulse-robot__eye-socket--right">
          <span className="pulse-robot__eye" />
        </span>
        <span className="pulse-robot__antenna" />
      </span>
    </span>
  );
}
