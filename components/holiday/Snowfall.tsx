"use client";

import { useEffect, useRef } from "react";

// Slow falling snow over the whole page (lib/holiday.ts). One canvas fixed over the page
// with pointer-events: none, so it never takes a click. Flakes are a few pixels across, fall
// at about 20-45 px a second and sway from side to side: a quiet snowfall, not a blizzard.
// Bigger flakes fall faster, which reads as depth. The number of flakes follows the screen
// area, so a phone gets fewer than a monitor. A flake is a soft dot drawn once into a small
// sprite and stamped with drawImage, far cheaper than a gradient per flake per frame.
// The colour is --snowflake (app/globals.css): white on the dark theme, grey-blue on the
// light one, where white snow would not show.

type Flake = {
  x: number;
  y: number;
  r: number; // radius, px
  speed: number; // px per second, down
  sway: number; // px to each side
  freq: number; // sways per second
  phase: number;
  alpha: number;
};

const AREA_PER_FLAKE = 18_000; // px² of screen per flake
const MIN_FLAKES = 24;
const MAX_FLAKES = 80;
const WIND = 4; // px per second to the right, so the snow drifts a little

function makeFlake(width: number, height: number, anywhere: boolean): Flake {
  const r = 1 + Math.random() ** 2 * 2; // 1-3 px, most of them small
  return {
    x: Math.random() * width,
    // The first flakes are spread over the screen; later ones start above it.
    y: anywhere ? Math.random() * height : -10 - Math.random() * 40,
    r,
    speed: 12 + r * 8 + Math.random() * 8,
    sway: 6 + Math.random() * 18,
    freq: 0.12 + Math.random() * 0.22,
    phase: Math.random() * Math.PI * 2,
    alpha: 0.45 + Math.random() * 0.5,
  };
}

// A soft round flake in the theme colour. The dot is drawn in white and then recoloured
// with "source-in", which keeps its alpha: a gradient to "transparent" would fade through
// transparent black and leave a grey rim.
function makeSprite(): HTMLCanvasElement {
  const color = getComputedStyle(document.documentElement).getPropertyValue("--snowflake").trim() || "#ffffff";
  const size = 32;
  const half = size / 2;
  const sprite = document.createElement("canvas");
  sprite.width = size;
  sprite.height = size;
  const ctx = sprite.getContext("2d");
  if (!ctx) return sprite;
  const glow = ctx.createRadialGradient(half, half, 0, half, half, half);
  glow.addColorStop(0, "rgb(255 255 255 / 1)");
  glow.addColorStop(0.4, "rgb(255 255 255 / 0.9)");
  glow.addColorStop(0.7, "rgb(255 255 255 / 0.35)");
  glow.addColorStop(1, "rgb(255 255 255 / 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, size, size);
  return sprite;
}

export default function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let width = 0;
    let height = 0;
    const flakes: Flake[] = [];
    let sprite = makeSprite();
    let frame = 0;
    let last = performance.now();
    let time = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(MAX_FLAKES, Math.max(MIN_FLAKES, (width * height) / AREA_PER_FLAKE)));
      while (flakes.length < count) flakes.push(makeFlake(width, height, true));
      flakes.length = count;
    };

    const tick = (now: number) => {
      // A tab in the background gets no frames; after it comes back, one long gap
      // must not throw every flake down the screen at once.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      ctx.clearRect(0, 0, width, height);
      for (const flake of flakes) {
        flake.y += flake.speed * dt;
        flake.x += WIND * dt;
        if (flake.y - flake.r * 2 > height) Object.assign(flake, makeFlake(width, height, false));
        if (flake.x > width + 20) flake.x -= width + 40;
        const x = flake.x + Math.sin(time * flake.freq * Math.PI * 2 + flake.phase) * flake.sway;
        const size = flake.r * 4;
        ctx.globalAlpha = flake.alpha;
        ctx.drawImage(sprite, x - size / 2, flake.y - size / 2, size, size);
      }
      frame = requestAnimationFrame(tick);
    };

    resize();
    frame = requestAnimationFrame(tick);
    // Fade in, so the snow starts softly instead of popping up.
    canvas.style.opacity = "1";
    window.addEventListener("resize", resize);
    // The theme toggle changes data-theme on <html>: recolour the flakes.
    const themeWatch = new MutationObserver(() => {
      sprite = makeSprite();
    });
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      themeWatch.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] h-full w-full opacity-0 transition-opacity duration-[2000ms] print:hidden"
    />
  );
}
