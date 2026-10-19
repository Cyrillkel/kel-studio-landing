"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import ScanVisual, { SCAN_TAG_COUNT } from "@/components/sitecheck/ScanVisual";

// The cover between the home page and the website check: the form on the home
// page (components/SiteCheckTeaser.tsx) calls launchCurtain() as it sends the
// visitor to /site-check, a circle opens from the Check button and holds the
// scanner, and it fades once the check page is there. It lives in the root
// layout (components/RootShell.tsx), so it stays up while the pages change.

type Launch = { x: number; y: number; host: string; title: string };

const EVENT = "kel:launch";
// The circle and a pass of the scanner, even when the page is ready at once.
const MIN_MS = 1100;
// Taken down anyway if the page never comes (no network).
const MAX_MS = 15_000;
const FADE_MS = 450;

export function launchCurtain(launch: Launch): void {
  window.dispatchEvent(new CustomEvent<Launch>(EVENT, { detail: launch }));
}

export default function LaunchCurtain() {
  const pathname = usePathname();
  const [launch, setLaunch] = useState<(Launch & { at: number; from: string }) | null>(null);
  const [leaving, setLeaving] = useState(false);
  const [lit, setLit] = useState(0);

  useEffect(() => {
    const start = (event: Event) => {
      const detail = (event as CustomEvent<Launch>).detail;
      setLeaving(false);
      setLit(0);
      setLaunch({ ...detail, at: performance.now(), from: window.location.pathname });
    };
    window.addEventListener(EVENT, start);
    return () => window.removeEventListener(EVENT, start);
  }, []);

  // The tags of the scanner come up one by one while the curtain is open.
  useEffect(() => {
    if (!launch) return;
    const timer = setInterval(() => setLit((n) => Math.min(n + 1, SCAN_TAG_COUNT)), 160);
    return () => clearInterval(timer);
  }, [launch]);

  useEffect(() => {
    if (!launch || leaving) return;
    const arrived = pathname !== launch.from;
    const wait = arrived ? Math.max(0, MIN_MS - (performance.now() - launch.at)) : MAX_MS;
    const timer = setTimeout(() => setLeaving(true), wait);
    return () => clearTimeout(timer);
  }, [launch, leaving, pathname]);

  useEffect(() => {
    if (!leaving) return;
    const timer = setTimeout(() => {
      setLaunch(null);
      setLeaving(false);
    }, FADE_MS);
    return () => clearTimeout(timer);
  }, [leaving]);

  if (!launch) return null;
  return (
    <div
      role="status"
      data-leaving={leaving}
      className="launch-curtain fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-page px-5"
      style={{ "--x": `${launch.x}px`, "--y": `${launch.y}px` } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="glow-wash absolute inset-0 [--glow-shape:ellipse_at_50%_45%] [--glow-color:var(--glow-visual)] [--glow-end:60%]"
      />
      <div className="launch-content relative w-full max-w-md">
        <ScanVisual host={launch.host} lit={lit} />
        <p className="mt-8 text-center font-heading text-xl font-bold text-white sm:text-2xl">{launch.title}</p>
        <p className="mt-2 text-center wrap-anywhere text-gray-400">{launch.host}</p>
      </div>
    </div>
  );
}
