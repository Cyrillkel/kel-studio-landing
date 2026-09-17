"use client";

import { memo, useEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TECH_ICONS } from "./techIcons";
import { ROOMY_QUERY } from "./breakpoints";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

type OrbitLayout = {
  width: number;
  height: number;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  radius: number;
  iconSize: number;
  labelSize: number;
  caption: [x: number, y: number];
  // Depth cue: icons at the back (top of the ellipse) are smaller and dimmer.
  minScale: number;
  maxScale: number;
  minOpacity: number;
};

// 1600x900 artboard around the heading. The ellipse clears the text box
// (x 300-1300, y 236-664) even at the corners; the focus slot is at the
// bottom center, under the buttons.
const WIDE: OrbitLayout = {
  width: 1600,
  height: 900,
  cx: 800,
  cy: 455,
  rx: 690,
  ry: 370,
  radius: 34,
  iconSize: 32,
  labelSize: 17,
  caption: [800, 890],
  minScale: 0.8,
  maxScale: 1.1,
  minOpacity: 0.5,
};

// Flattened carousel ring that sits in the page flow above the heading.
const COMPACT: OrbitLayout = {
  width: 900,
  height: 400,
  cx: 450,
  cy: 170,
  rx: 380,
  ry: 120,
  radius: 36,
  iconSize: 34,
  labelSize: 32,
  caption: [450, 380],
  minScale: 0.62,
  maxScale: 1.05,
  minOpacity: 0.3,
};

const SLOT = (Math.PI * 2) / TECH_ICONS.length;
// Angle of the focus slot (bottom center; SVG y grows downward).
const FOCUS = Math.PI / 2;

function place(layout: OrbitLayout, rotation: number, index: number) {
  const angle = rotation + index * SLOT;
  const depth = (Math.sin(angle) + 1) / 2;
  return {
    x: layout.cx + layout.rx * Math.cos(angle),
    y: layout.cy + layout.ry * Math.sin(angle),
    scale: layout.minScale + (layout.maxScale - layout.minScale) * depth,
    opacity: layout.minOpacity + (1 - layout.minOpacity) * depth,
  };
}

const transformOf = ({ x, y, scale }: ReturnType<typeof place>) =>
  `translate(${x.toFixed(2)} ${y.toFixed(2)}) scale(${scale.toFixed(3)})`;

// Memoized: after mount the hook moves and re-orders these nodes directly,
// so React must never re-render them.
const OrbitSvg = memo(function OrbitSvg({
  layout,
  id,
  className,
}: {
  layout: OrbitLayout;
  id: string;
  className?: string;
}) {
  const iconGradient = `${id}-icon`;
  const ringGradient = `${id}-ring`;
  const { cx, cy, rx, ry, radius: r, iconSize, labelSize, caption } = layout;
  // Initial pose: icon 0 in focus, painted back to front.
  const nodes = TECH_ICONS.map((icon, index) => ({ icon, index, ...place(layout, FOCUS, index) })).sort(
    (a, b) => a.y - b.y
  );

  return (
    <svg viewBox={`0 0 ${layout.width} ${layout.height}`} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={iconGradient} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
        <linearGradient id={ringGradient} x1={cx - rx} y1="0" x2={cx + rx} y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22d3ee" />
          <stop offset="0.5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#e879f9" />
        </linearGradient>
      </defs>

      <ellipse className="orbit-ring" cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={1.2} />
      <ellipse
        className="orbit-dash"
        cx={cx}
        cy={cy}
        rx={rx * 0.9}
        ry={ry * 0.86}
        fill="none"
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
        strokeDasharray="2 12"
      />
      {/* Arc under the focus slot; an ellipse path starts at 3 o'clock, so 25% is the bottom. */}
      <ellipse
        className="orbit-glow"
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke={`url(#${ringGradient})`}
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0}
      />

      <g className="orbit-nodes">
        {nodes.map(({ icon, index, ...pose }) => (
          <g key={icon.id} data-orbit-node={index} transform={transformOf({ ...pose })} opacity={pose.opacity.toFixed(3)}>
            <g className="orbit-inner">
              <circle r={r} fill="#0a0a0a" fillOpacity={0.92} stroke="rgba(255,255,255,0.12)" />
              <circle className="orbit-active" r={r} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={1.5} opacity={0} />
              <circle className="orbit-pulse" r={r} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={1} opacity={0} />
              <g transform={`translate(${-iconSize / 2} ${-iconSize / 2}) scale(${iconSize / 24})`}>
                <path d={icon.path} fill="rgba(255,255,255,0.16)" stroke="rgba(255,255,255,0.5)" strokeWidth={0.35} />
                <path className="orbit-fill" d={icon.path} fill={`url(#${iconGradient})`} opacity={0} />
                <path className="orbit-draw" d={icon.path} fill="none" stroke={`url(#${iconGradient})`} strokeWidth={0.5} opacity={0} />
              </g>
            </g>
          </g>
        ))}
      </g>

      {TECH_ICONS.map((icon, index) => (
        <text
          key={`label-${icon.id}`}
          className="orbit-label"
          data-label={index}
          x={caption[0]}
          y={caption[1]}
          textAnchor="middle"
          fontSize={labelSize}
          fill="#e5e7eb"
          opacity={0}
        >
          {icon.label}
        </text>
      ))}
    </svg>
  );
});

export function OrbitWide() {
  return (
    // Hidden until the hook reveals it, so SSR markup doesn't flash before the intro.
    <div
      className="orbit-layer orbit-parallax pointer-events-none absolute inset-0 hidden roomy:block"
      data-orbit="wide"
      style={{ visibility: "hidden" }}
    >
      <OrbitSvg layout={WIDE} id="orbit-wide" className="h-full w-full" />
    </div>
  );
}

export function OrbitCompact() {
  return (
    <div
      className="orbit-layer -mx-6 mb-2 roomy:hidden md:mx-auto md:max-w-xl [@media(max-height:500px)]:mx-auto [@media(max-height:500px)]:max-w-xs"
      data-orbit="compact"
      style={{ visibility: "hidden" }}
    >
      <OrbitSvg layout={COMPACT} id="orbit-compact" className="block w-full" />
    </div>
  );
}

// Each step turns the ring by one slot, bringing the next icon into the
// focus slot, where it lights up. Steps are scheduled one after another
// rather than as a repeating timeline, so every hand-off is timed the same.
const STEP = 2.8;

export function useTechOrbit(scopeRef: RefObject<HTMLElement | null>) {
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
        gsap.set(".orbit-layer", { visibility: "visible" });
        if (reduceMotion) return;

        const layout = roomy ? WIDE : COMPACT;
        const root = scope.querySelector(`[data-orbit="${roomy ? "wide" : "compact"}"]`)!;
        const group = root.querySelector(".orbit-nodes")!;
        const glow = root.querySelector(".orbit-glow")!;
        const nodes = TECH_ICONS.map((_, i) => root.querySelector<SVGGElement>(`[data-orbit-node="${i}"]`)!);
        const parts = nodes.map((node, i) => ({
          inner: node.querySelector(".orbit-inner")!,
          active: node.querySelector(".orbit-active")!,
          pulse: node.querySelector(".orbit-pulse")!,
          draw: node.querySelector(".orbit-draw")!,
          fill: node.querySelector(".orbit-fill")!,
          label: root.querySelector(`.orbit-label[data-label="${i}"]`)!,
        }));
        const animated = [glow, ...parts.flatMap((p) => Object.values(p))];

        const state = { rotation: FOCUS - Math.PI, fade: 0 };
        let paintOrder = "";

        // Positions are written straight to attributes: this runs every frame
        // while the ring turns.
        const render = () => {
          const placed = nodes.map((node, i) => {
            const pose = place(layout, state.rotation, i);
            node.setAttribute("transform", transformOf(pose));
            node.setAttribute("opacity", (pose.opacity * state.fade).toFixed(3));
            return { i, y: pose.y };
          });
          const order = placed.sort((a, b) => a.y - b.y).map((p) => p.i);
          const key = order.join(",");
          if (key !== paintOrder) {
            paintOrder = key;
            order.forEach((i) => group.appendChild(nodes[i]));
          }
        };

        let current = 0;
        let active: gsap.core.Timeline | null = null;
        let next: gsap.core.Tween | null = null;

        const lightUp = (i: number) => {
          const p = parts[i];
          // immediateRender off: this timeline is often queued a second into a
          // step while the icon is still travelling; pre-rendering its "from"
          // states would flash the pulse ring and snap the arc early.
          const at = { immediateRender: false };
          return gsap
            .timeline()
            .fromTo(p.inner, { scale: 1 }, { ...at, scale: 1.12, transformOrigin: "50% 50%", duration: 0.6, ease: "back.out(3)" }, 0)
            .fromTo(p.active, { opacity: 0 }, { ...at, opacity: 1, duration: 0.5 }, 0)
            .fromTo(p.pulse, { scale: 1, opacity: 0.8 }, { ...at, scale: 1.9, opacity: 0, transformOrigin: "50% 50%", duration: 1.2, ease: "power2.out" }, 0.1)
            .fromTo(p.draw, { drawSVG: "0%", opacity: 1 }, { ...at, drawSVG: "100%", duration: 1, ease: "power2.inOut" }, 0)
            .fromTo(p.fill, { opacity: 0 }, { ...at, opacity: 0.9, duration: 0.7 }, 0.45)
            .fromTo(p.label, { opacity: 0, y: 6 }, { ...at, opacity: 1, y: 0, duration: 0.5 }, 0.3)
            .fromTo(glow, { drawSVG: "25% 25%", opacity: 1 }, { ...at, drawSVG: "19% 31%", duration: 0.8, ease: "power2.out" }, 0);
        };

        const dim = (i: number) => {
          const p = parts[i];
          gsap.to(p.inner, { scale: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
          gsap.to([p.active, p.draw, p.fill], { opacity: 0, duration: 0.45, overwrite: "auto" });
          gsap.to(p.label, { opacity: 0, duration: 0.25, overwrite: "auto" });
          gsap.to(glow, { drawSVG: "25% 25%", opacity: 0, duration: 0.45, ease: "power2.in", overwrite: "auto" });
        };

        const step = () => {
          dim(current);
          current = (current + 1) % nodes.length;
          active = gsap
            .timeline()
            .to(state, { rotation: state.rotation - SLOT, duration: 1.2, ease: "power3.inOut", onUpdate: render }, 0)
            .add(lightUp(current), 1);
          next = gsap.delayedCall(STEP, step);
        };

        let started = false;
        let visible = true;

        render();
        gsap
          .timeline({
            delay: 0.3,
            onComplete: () => {
              started = true;
              if (!visible) return;
              active = lightUp(current);
              next = gsap.delayedCall(STEP, step);
            },
          })
          .from(root.querySelectorAll(".orbit-ring"), { drawSVG: 0, duration: 1.4, ease: "power2.inOut" })
          .from(root.querySelectorAll(".orbit-dash"), { opacity: 0, duration: 1 }, 0.3)
          // The ring spins half a turn into place while the icons fade in.
          .to(state, { rotation: FOCUS, fade: 1, duration: 1.8, ease: "power3.out", onUpdate: render }, 0.1);

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
              active = lightUp(current);
              next = gsap.delayedCall(STEP, step);
            }
          },
        });

        let removePointer = () => {};
        if (roomy && window.matchMedia("(pointer: fine)").matches) {
          const layer = scope.querySelector(".orbit-parallax");
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
          // Step tweens are created after this callback ran, so the matchMedia
          // context doesn't track them: stop and reset by hand.
          next?.kill();
          active?.kill();
          gsap.killTweensOf([state, ...animated]);
          gsap.set(animated, { clearProps: "all" });
        };
      }
    );

    return () => mm.revert();
  }, [scopeRef]);
}
