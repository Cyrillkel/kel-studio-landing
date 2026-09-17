"use client";

import { useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TECH_ICONS } from "./techIcons";
import { ROOMY_QUERY } from "./breakpoints";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type Point = [x: number, y: number];

type Layout = {
  width: number;
  height: number;
  radius: number;
  iconSize: number;
  labelSize: number;
  // Node positions keyed by TECH_ICONS index.
  nodes: Record<number, Point>;
  edges: [from: number, to: number][];
  stars: [x: number, y: number, node: number][];
  // One shared caption spot instead of a label under every node.
  caption?: Point;
};

const chain = (from: number, to: number): [number, number][] =>
  Array.from({ length: to - from }, (_, i) => [from + i, from + i + 1]);

// 1600x900 artboard around a centered heading. Nodes and labels stay outside
// the text box (x 300-1300, y 236-664) and below the fixed nav.
const WIDE: Layout = {
  width: 1600,
  height: 900,
  radius: 34,
  iconSize: 32,
  labelSize: 16,
  nodes: {
    0: [180, 210],
    1: [390, 155],
    2: [600, 135],
    3: [800, 125],
    4: [1000, 135],
    5: [1210, 155],
    6: [1420, 210],
    7: [1500, 370],
    8: [1480, 560],
    9: [1400, 720],
    10: [1180, 790],
    11: [940, 820],
    12: [660, 820],
    13: [420, 790],
    14: [200, 720],
    15: [120, 560],
    16: [100, 370],
  },
  edges: TECH_ICONS.map((_, i) => [i, (i + 1) % TECH_ICONS.length]),
  stars: [
    [30, 250, 0],
    [500, 70, 1],
    [900, 70, 3],
    [1560, 250, 6],
    [1570, 470, 7],
    [1060, 880, 11],
    [540, 880, 12],
    [40, 670, 15],
  ],
};

const zigzag = (indices: number[], xs: number[], high: number, low: number) =>
  Object.fromEntries(
    indices.map((index, k) => [index, [xs[k], k % 2 ? high : low] as Point])
  );

// Two zigzag rows in the page flow above and below the text on smaller
// screens, so they can never overlap it.
const STRIP_TOP: Layout = {
  width: 900,
  height: 250,
  radius: 44,
  iconSize: 40,
  labelSize: 32,
  nodes: zigzag(
    [0, 1, 2, 3, 4, 5, 6, 7, 8],
    [60, 157.5, 255, 352.5, 450, 547.5, 645, 742.5, 840],
    58,
    128
  ),
  edges: chain(0, 8),
  stars: [
    [15, 30, 1],
    [885, 30, 7],
  ],
  caption: [450, 225],
};

const STRIP_BOTTOM: Layout = {
  width: 900,
  height: 250,
  radius: 44,
  iconSize: 40,
  labelSize: 32,
  nodes: zigzag(
    [9, 10, 11, 12, 13, 14, 15, 16],
    [791, 693.5, 596, 498.5, 401, 303.5, 206, 108.5],
    128,
    58
  ),
  edges: chain(9, 16),
  stars: [
    [885, 150, 9],
    [15, 150, 16],
  ],
  caption: [450, 225],
};

function ConstellationSvg({
  layout,
  id,
  className,
}: {
  layout: Layout;
  id: string;
  className?: string;
}) {
  const iconGradient = `${id}-icon`;
  const lineGradient = `${id}-line`;
  const { radius: r, iconSize, labelSize, caption } = layout;
  const nodes = Object.entries(layout.nodes).map(
    ([key, point]) => [Number(key), point] as const
  );

  return (
    <svg
      viewBox={`0 0 ${layout.width} ${layout.height}`}
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={iconGradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
        {/* userSpaceOnUse: bounding-box units collapse on straight lines. */}
        <linearGradient
          id={lineGradient}
          x1="0"
          y1="0"
          x2={layout.width}
          y2={layout.height}
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>

      {layout.stars.map(([x, y, node], i) => {
        const [nx, ny] = layout.nodes[node];
        return (
          <g key={`star-${i}`}>
            <line className="cn-edge" x1={nx} y1={ny} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
            <circle className="cn-star" cx={x} cy={y} r={2.5} fill="#ffffff" fillOpacity={0.35} />
          </g>
        );
      })}

      {layout.edges.map(([from, to]) => {
        const [x1, y1] = layout.nodes[from];
        const [x2, y2] = layout.nodes[to];
        return (
          <g key={`edge-${from}-${to}`}>
            <line className="cn-edge" x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
            <line
              className="cn-signal"
              data-from={from}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={`url(#${lineGradient})`}
              strokeWidth={2}
              strokeLinecap="round"
              opacity={0}
            />
          </g>
        );
      })}

      {nodes.map(([index, [x, y]]) => {
        const icon = TECH_ICONS[index];
        return (
          <g key={icon.id} transform={`translate(${x} ${y})`}>
            <g data-node={index}>
              <circle r={r} fill="#0a0a0a" fillOpacity={0.9} stroke="rgba(255,255,255,0.1)" />
              <circle className="cn-ring" r={r} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={1.5} opacity={0} />
              <circle className="cn-pulse" r={r} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={1} opacity={0} />
              <g transform={`translate(${-iconSize / 2} ${-iconSize / 2}) scale(${iconSize / 24})`}>
                <path d={icon.path} fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.5)" strokeWidth={0.35} />
                <path className="cn-fill" d={icon.path} fill={`url(#${iconGradient})`} opacity={0} />
                <path className="cn-draw" d={icon.path} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={0.5} opacity={0} />
              </g>
            </g>
          </g>
        );
      })}

      {nodes.map(([index, [x, y]]) => (
        <text
          key={`label-${index}`}
          className="cn-label"
          data-label={index}
          x={caption ? caption[0] : x}
          y={caption ? caption[1] : y + r + labelSize * 1.6}
          textAnchor="middle"
          fontSize={labelSize}
          fill="#e5e7eb"
          opacity={0}
        >
          {TECH_ICONS[index].label}
        </text>
      ))}
    </svg>
  );
}

export function ConstellationWide() {
  return (
    // Hidden until the hook reveals it, so SSR markup doesn't flash before the intro.
    <div
      className="cn-layer cn-parallax pointer-events-none absolute inset-0 hidden roomy:block"
      data-layout="wide"
      style={{ visibility: "hidden" }}
    >
      <ConstellationSvg layout={WIDE} id="cn-wide" className="h-full w-full" />
    </div>
  );
}

export function ConstellationStrip({ position }: { position: "top" | "bottom" }) {
  return (
    <div
      data-layout="strip"
      className={`-mx-6 roomy:hidden md:mx-auto md:max-w-lg [@media(max-height:500px)]:mx-auto [@media(max-height:500px)]:max-w-xs ${position === "top" ? "mb-2" : "mt-8"}`}
    >
      <ConstellationSvg
        layout={position === "top" ? STRIP_TOP : STRIP_BOTTOM}
        id={`cn-strip-${position}`}
        className="block w-full"
      />
    </div>
  );
}

// Every step lights one icon and sends a signal toward the next one, which
// lights up STEP seconds later. Steps are scheduled one by one (not a
// repeating timeline), so the wrap from the last icon back to the first is
// timed exactly like every other hand-off.
const STEP = 2.6;

export function useTechConstellation(scopeRef: RefObject<HTMLElement | null>) {
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
        gsap.set(".cn-layer", { visibility: "visible" });
        if (reduceMotion) return;

        const layout = roomy ? "wide" : "strip";
        const find = (selector: string) =>
          scope.querySelector<SVGElement>(`[data-layout="${layout}"] ${selector}`);
        const findAll = (selector: string) =>
          gsap.utils.toArray<SVGElement>(`[data-layout="${layout}"] ${selector}`, scope);

        const parts = TECH_ICONS.map((_, i) => {
          const node = find(`[data-node="${i}"]`)!;
          return {
            node,
            ring: node.querySelector(".cn-ring")!,
            pulse: node.querySelector(".cn-pulse")!,
            draw: node.querySelector(".cn-draw")!,
            fill: node.querySelector(".cn-fill")!,
            label: find(`.cn-label[data-label="${i}"]`)!,
            signal: find(`.cn-signal[data-from="${i}"]`),
          };
        });
        const animated = parts.flatMap((p) =>
          [p.node, p.ring, p.pulse, p.draw, p.fill, p.label, p.signal].filter(
            (el): el is SVGElement => el !== null
          )
        );

        let current = -1;
        let active: gsap.core.Timeline | null = null;
        let next: gsap.core.Tween | null = null;

        const deactivate = (i: number) => {
          const p = parts[i];
          gsap.to(p.node, { scale: 1, duration: 0.6, ease: "power2.out", overwrite: "auto" });
          gsap.to([p.ring, p.draw, p.fill], { opacity: 0, duration: 0.6, overwrite: "auto" });
          gsap.to(p.label, { opacity: 0, duration: 0.3, overwrite: "auto" });
          if (p.signal) {
            gsap.to(p.signal, { opacity: 0, duration: 0.5, delay: 0.3, overwrite: "auto" });
          }
        };

        const step = () => {
          if (current >= 0) deactivate(current);
          current = (current + 1) % parts.length;
          const p = parts[current];

          active = gsap
            .timeline()
            .fromTo(p.node, { scale: 1 }, { scale: 1.12, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 0)
            .fromTo(p.ring, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0)
            .fromTo(p.pulse, { scale: 1, opacity: 0.8 }, { scale: 1.9, opacity: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.out" }, 0.1)
            .fromTo(p.draw, { drawSVG: "0%", opacity: 1 }, { drawSVG: "100%", duration: 1, ease: "power2.inOut" }, 0)
            .fromTo(p.fill, { opacity: 0 }, { opacity: 0.9, duration: 0.7 }, 0.5)
            .fromTo(p.label, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5 }, 0.35);
          if (p.signal) {
            // Arrives at 2.3s, just before the next icon lights at STEP.
            active.fromTo(p.signal, { drawSVG: "0% 0%", opacity: 1 }, { drawSVG: "0% 100%", duration: 1, ease: "power2.inOut" }, 1.3);
          }

          next = gsap.delayedCall(STEP, step);
        };

        let started = false;
        let visible = true;

        gsap
          .timeline({
            delay: 0.3,
            onComplete: () => {
              started = true;
              if (visible) step();
            },
          })
          .from(findAll(".cn-edge"), { drawSVG: 0, duration: 1.4, ease: "power2.inOut", stagger: 0.03 })
          .from(parts.map((p) => p.node), { scale: 0, transformOrigin: "50% 50%", duration: 0.7, ease: "back.out(2)", stagger: 0.04 }, 0.2)
          .from(findAll(".cn-star"), { opacity: 0, duration: 0.8, stagger: 0.04 }, 0.6);

        // Nothing animates while the hero is scrolled out of view.
        ScrollTrigger.create({
          trigger: scope,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (!started) return;
            if (!visible) {
              active?.pause();
              next?.pause();
            } else if (next) {
              active?.resume();
              next.resume();
            } else {
              step();
            }
          },
        });

        let removePointer = () => {};
        if (roomy && window.matchMedia("(pointer: fine)").matches) {
          const layer = scope.querySelector(".cn-parallax");
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
          // The step tweens are created after this callback ran, so the
          // matchMedia context doesn't track them: stop and reset by hand.
          next?.kill();
          active?.kill();
          gsap.killTweensOf(animated);
          gsap.set(animated, { clearProps: "all" });
        };
      }
    );

    return () => mm.revert();
  }, [scopeRef]);
}
