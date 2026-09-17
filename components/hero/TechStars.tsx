"use client";

import { memo, useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TECH_ICONS } from "./techIcons";
import { ROOMY_QUERY } from "./breakpoints";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type SkyLayout = {
  radius: number;
  iconSize: number;
  labelSize: number;
  // Free space kept inside the layer edges, px. `top` clears the fixed nav.
  top: number;
  edge: number;
  // Minimum distance between two lit icons, center to center.
  spacing: number;
  maxLit: number;
  // Seconds between spawn attempts and seconds an icon stays fully lit.
  interval: [min: number, max: number];
  hold: [min: number, max: number];
};

// Icons light up anywhere around the heading, avoiding the text itself.
const WIDE: SkyLayout = {
  radius: 30,
  iconSize: 28,
  labelSize: 14,
  top: 100,
  edge: 40,
  spacing: 190,
  maxLit: 5,
  interval: [1.4, 2.2],
  hold: [3, 4.5],
};

// A band above the heading on smaller screens.
const COMPACT: SkyLayout = {
  radius: 22,
  iconSize: 22,
  labelSize: 12,
  top: 6,
  edge: 6,
  spacing: 110,
  maxLit: 3,
  interval: [2, 3],
  hold: [2.8, 4],
};

// Memoized: the hook positions and re-orders these nodes directly,
// so React must never re-render them.
const SkySvg = memo(function SkySvg({ layout, id }: { layout: SkyLayout; id: string }) {
  const iconGradient = `${id}-icon`;
  const { radius: r, iconSize, labelSize } = layout;

  return (
    // No viewBox: user units are CSS pixels, so the hook can place icons
    // against the real layout.
    <svg className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
      <defs>
        <linearGradient id={iconGradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>

      <g className="star-nodes">
        {TECH_ICONS.map((icon, index) => (
          <g key={icon.id} data-star={index} opacity={0}>
            <g className="star-float">
              <g className="star-inner">
                <circle r={r} fill="#0a0a0a" fillOpacity={0.92} stroke="rgba(255,255,255,0.14)" />
                <circle className="star-ring" r={r} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={1.2} opacity={0} />
                <g transform={`translate(${-iconSize / 2} ${-iconSize / 2}) scale(${iconSize / 24})`}>
                  <path d={icon.path} fill="rgba(255,255,255,0.12)" />
                  <path className="star-fill" d={icon.path} fill={`url(#${iconGradient})`} opacity={0} />
                  <path className="star-draw" d={icon.path} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={0.5} opacity={0} />
                </g>
              </g>
              <text className="star-label" y={r + labelSize + 8} textAnchor="middle" fontSize={labelSize} fill="#e5e7eb" opacity={0}>
                {icon.label}
              </text>
            </g>
          </g>
        ))}
      </g>
    </svg>
  );
});

export function StarsWide() {
  return (
    <div className="stars-parallax pointer-events-none absolute inset-0 hidden roomy:block" data-stars="wide">
      <SkySvg layout={WIDE} id="stars-wide" />
    </div>
  );
}

export function StarsCompact() {
  return (
    <div
      className="relative -mx-6 mb-4 h-40 roomy:hidden md:mx-auto md:max-w-xl [@media(max-height:500px)]:mx-auto [@media(max-height:500px)]:h-24 [@media(max-height:500px)]:max-w-sm"
      data-stars="compact"
    >
      <SkySvg layout={COMPACT} id="stars-compact" />
    </div>
  );
}

type Star = {
  index: number;
  x: number;
  y: number;
  leaving: boolean;
  timeline: gsap.core.Timeline | null;
};

// Keep-out padding around the heading, subtitle and buttons.
const TEXT_PADDING = 28;

// Icons fade in at random free spots, a few at a time, and fade out again on
// their own schedule.
export function useTechStars(scopeRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const scope = scopeRef.current;
    if (!scope) return;

    const mm = gsap.matchMedia(scope);

    mm.add(
      {
        roomy: ROOMY_QUERY,
        // matchMedia only runs the callback when some condition matches.
        compact: `not all and ${ROOMY_QUERY}`,
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { roomy, reduceMotion } = context.conditions as {
          roomy: boolean;
          reduceMotion: boolean;
        };

        const layout = roomy ? WIDE : COMPACT;
        const root = scope.querySelector<HTMLElement>(`[data-stars="${roomy ? "wide" : "compact"}"]`)!;
        const front = root.querySelector(".star-nodes")!;
        const nodes = TECH_ICONS.map((_, i) => root.querySelector<SVGGElement>(`[data-star="${i}"]`)!);
        const parts = nodes.map((node) => ({
          float: node.querySelector(".star-float")!,
          inner: node.querySelector(".star-inner")!,
          ring: node.querySelector(".star-ring")!,
          fill: node.querySelector(".star-fill")!,
          draw: node.querySelector(".star-draw")!,
          label: node.querySelector(".star-label")!,
        }));
        // The compact band sits above the text, so only the wide layer has to dodge it.
        const avoid = roomy ? [...scope.querySelectorAll<HTMLElement>("[data-stars-avoid]")] : [];
        const animated = [...nodes, ...parts.flatMap((p) => Object.values(p))];
        // Set up front, while unscaled: when a tween changes the origin of an
        // already scaled SVG element, GSAP offsets it to avoid a jump, and the
        // icon would then sit off center for good.
        gsap.set(parts.map((p) => p.inner), { transformOrigin: "50% 50%" });

        const lit: Star[] = [];
        // Spots vacated a moment ago, so the next icon lights up somewhere new.
        const recent: { x: number; y: number }[] = [];
        let bag: number[] = [];

        const pickIcon = () => {
          const isFree = (i: number) => !lit.some((star) => star.index === i);
          if (!bag.some(isFree)) bag = gsap.utils.shuffle(TECH_ICONS.map((_, i) => i));
          return bag.splice(bag.findIndex(isFree), 1)[0];
        };

        const findSpot = () => {
          const { radius: r, labelSize, top, edge, spacing } = layout;
          const box = root.getBoundingClientRect();
          const blocked = avoid.map((el) => {
            const rect = el.getBoundingClientRect();
            return {
              left: rect.left - box.left - TEXT_PADDING,
              right: rect.right - box.left + TEXT_PADDING,
              top: rect.top - box.top - TEXT_PADDING,
              bottom: rect.bottom - box.top + TEXT_PADDING,
            };
          });
          // The label hangs below the icon and can be wider than it.
          const half = Math.max(r, 48);
          const below = r + labelSize + 12;

          for (let attempt = 0; attempt < 40; attempt++) {
            const x = gsap.utils.random(edge + half, box.width - edge - half);
            const y = gsap.utils.random(top + r, box.height - edge - below);
            const overlapsText = blocked.some(
              (b) => x + half > b.left && x - half < b.right && y + below > b.top && y - r < b.bottom
            );
            if (overlapsText) continue;
            const crowded =
              lit.some((star) => Math.hypot(star.x - x, star.y - y) < spacing) ||
              recent.some((spot) => Math.hypot(spot.x - x, spot.y - y) < spacing * 0.7);
            if (!crowded) return { x, y };
          }
          return null;
        };

        const place = (star: Star) => {
          const scale = gsap.utils.random(0.85, 1.1);
          nodes[star.index].setAttribute(
            "transform",
            `translate(${star.x.toFixed(1)} ${star.y.toFixed(1)}) scale(${scale.toFixed(3)})`
          );
          // Newest on top.
          front.appendChild(nodes[star.index]);
        };

        if (reduceMotion) {
          // A still sky: a few icons, fully lit, no motion.
          for (let k = 0; k < layout.maxLit; k++) {
            const spot = findSpot();
            if (!spot) break;
            const star: Star = { index: pickIcon(), ...spot, leaving: false, timeline: null };
            lit.push(star);
            place(star);
            const p = parts[star.index];
            gsap.set(nodes[star.index], { opacity: 1 });
            gsap.set([p.fill, p.label], { opacity: 1 });
            gsap.set(p.ring, { opacity: 0.5 });
          }
          return () => gsap.set(animated, { clearProps: "all" });
        }

        const spawn = () => {
          const spot = findSpot();
          if (!spot) return;
          const star: Star = { index: pickIcon(), ...spot, leaving: false, timeline: null };
          const node = nodes[star.index];
          const p = parts[star.index];
          place(star);

          const hold = gsap.utils.random(...layout.hold);
          const out = 2.2 + hold;
          lit.push(star);
          // Everything eases in and out on long, overlapping fades: no bounce,
          // no flash, so the sky changes without drawing the eye from the text.
          star.timeline = gsap
            .timeline({
              onComplete: () => {
                lit.splice(lit.indexOf(star), 1);
                recent.push({ x: star.x, y: star.y });
                if (recent.length > 2) recent.shift();
              },
            })
            .set(node, { opacity: 1 }, 0)
            .fromTo(p.inner, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power2.out" }, 0)
            .fromTo(p.ring, { opacity: 0 }, { opacity: 0.5, duration: 1.4, ease: "sine.inOut" }, 0.3)
            .fromTo(p.draw, { drawSVG: "0%", opacity: 1 }, { drawSVG: "100%", duration: 1.8, ease: "power1.inOut" }, 0.3)
            .fromTo(p.fill, { opacity: 0 }, { opacity: 0.9, duration: 1.4, ease: "sine.inOut" }, 1.2)
            .to(p.draw, { opacity: 0, duration: 1, ease: "sine.inOut" }, 1.9)
            .fromTo(p.label, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }, 1)
            .fromTo(p.float, { y: 3 }, { y: -5, duration: out + 1.6, ease: "sine.inOut" }, 0)
            .call(
              () => {
                star.leaving = true;
              },
              undefined,
              out
            )
            .to(p.label, { opacity: 0, y: -3, duration: 0.9, ease: "sine.inOut" }, out)
            .to([p.fill, p.ring], { opacity: 0, duration: 1.2, ease: "sine.inOut" }, out)
            .to(p.inner, { scale: 0.9, opacity: 0, duration: 1.4, ease: "power2.inOut" }, out + 0.2)
            .set(node, { opacity: 0 });
        };

        // Nothing new lights up while the hero is scrolled out of view; icons
        // already lit finish their few seconds on their own.
        let next: gsap.core.Tween | null = null;
        let visible = true;
        let seeded = 0;
        const tick = () => {
          next = null;
          if (!visible) return;
          if (lit.filter((star) => !star.leaving).length < layout.maxLit) spawn();
          // The first few come sooner so the sky isn't empty on arrival.
          const wait = seeded++ < 2 ? 0.7 : gsap.utils.random(...layout.interval);
          next = gsap.delayedCall(wait, tick);
        };

        ScrollTrigger.create({
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (!visible) {
              next?.kill();
              next = null;
            } else {
              next ??= gsap.delayedCall(0.3, tick);
            }
          },
        });
        next ??= gsap.delayedCall(0.6, tick);

        let removePointer = () => {};
        if (roomy && window.matchMedia("(pointer: fine)").matches) {
          const layer = scope.querySelector(".stars-parallax");
          const xTo = gsap.quickTo(layer, "x", { duration: 1.2, ease: "power3.out" });
          const yTo = gsap.quickTo(layer, "y", { duration: 1.2, ease: "power3.out" });
          const onMove = (e: PointerEvent) => {
            xTo((e.clientX / window.innerWidth - 0.5) * -24);
            yTo((e.clientY / window.innerHeight - 0.5) * -16);
          };
          window.addEventListener("pointermove", onMove);
          removePointer = () => window.removeEventListener("pointermove", onMove);
        }

        return () => {
          removePointer();
          // Star timelines are created after this callback ran, so the
          // matchMedia context doesn't track them: stop and reset by hand.
          next?.kill();
          lit.forEach((star) => star.timeline?.kill());
          gsap.killTweensOf(animated);
          gsap.set(animated, { clearProps: "all" });
        };
      }
    );

    return () => mm.revert();
  }, [scopeRef]);
}
