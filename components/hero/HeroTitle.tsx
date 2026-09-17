"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";

gsap.registerPlugin(ScrollTrigger);

// Seconds a typed word stays before it is erased. The glare runs after the
// intro and then after every other word.
const HOLD = 2.2;

// White text shaded by an alpha mask, brighter on the left, plus a glare band
// that GSAP sweeps across by tweening --shine. Unlike background-clip: text,
// a mask also shades text that the hook rewrites.
const MASK = [
  "linear-gradient(110deg, transparent calc(var(--shine) - 8%), #000 var(--shine), transparent calc(var(--shine) + 8%))",
  "linear-gradient(100deg, rgb(0 0 0 / 0.95) 20%, rgb(0 0 0 / 0.6) 80%)",
].join(", ");
const TITLE_STYLE = {
  "--shine": "-20%",
  maskImage: MASK,
  WebkitMaskImage: MASK,
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
} as CSSProperties;

export default function HeroTitle() {
  const { t } = useTranslation();
  const words = t("hero.titleWords", { returnObjects: true }) as string[];
  const wordsKey = words.join("|");
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const title = titleRef.current;
    if (!title) return;
    const list = wordsKey.split("|");
    const mm = gsap.matchMedia(title);

    mm.add(
      {
        reduceMotion: "(prefers-reduced-motion: reduce)",
        // matchMedia only runs the callback when some condition matches.
        motionOk: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const { reduceMotion } = context.conditions as { reduceMotion: boolean };
        if (reduceMotion) return;

        const word = title.querySelector<HTMLElement>(".hero-word")!;
        const tail = title.querySelector<HTMLElement>(".hero-tail")!;
        const line = word.parentElement!;

        // The typed text, a zero-width strut that keeps the box one line tall
        // while the word is empty, and the caret.
        const typed = document.createElement("span");
        typed.textContent = list[0];
        const strut = document.createTextNode("\u200b");
        const caret = document.createElement("span");
        caret.className =
          "absolute top-[0.2em] ml-[0.03em] h-[0.85em] w-[0.06em] rounded-full bg-linear-to-b from-cyan-400 via-violet-400 to-fuchsia-500";
        word.replaceChildren(typed, strut, caret);

        const placeCaret = () => {
          caret.style.left = `${typed.offsetWidth}px`;
        };
        const setText = (text: string) => {
          typed.textContent = text;
          placeCaret();
        };

        const widthOf = (texts: string[]) => {
          const probe = document.createElement("span");
          probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap";
          word.append(probe);
          const widths = texts.map((text) => {
            probe.textContent = text;
            return probe.offsetWidth;
          });
          probe.remove();
          return widths;
        };

        // The widest word decides the layout for all of them: either the
        // whole line fits on one row, or the tail always drops below the
        // word. Otherwise the text below would jump whenever a longer word
        // made the line wrap.
        const measure = () => {
          const [rest, ...widths] = widthOf([`\u00a0${tail.textContent}`, ...list]);
          const stacked = Math.max(...widths) + rest > line.clientWidth;
          line.style.whiteSpace = stacked ? "" : "nowrap";
          tail.style.display = stacked ? "block" : "";
        };

        let alive = true;
        let frame = 0;
        const onResize = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(measure);
        };
        measure();
        // Widths measured before the webfont loads are off.
        document.fonts.ready.then(() => alive && measure());
        document.fonts.addEventListener("loadingdone", onResize);
        window.addEventListener("resize", onResize);
        // Keeps the caret on the text end through font swaps and resizes.
        const observer = new ResizeObserver(placeCaret);
        observer.observe(word);

        const blink = gsap.to(caret, {
          opacity: 0,
          duration: 0.55,
          ease: "power1.inOut",
          repeat: -1,
          yoyo: true,
          repeatDelay: 0.15,
        });

        const glare = () =>
          gsap.fromTo(
            title,
            { "--shine": "-20%" },
            { "--shine": "120%", duration: 1.6, ease: "power2.inOut", overwrite: "auto" }
          );

        let active: gsap.core.Timeline | null = null;
        let next: gsap.core.Tween | null = null;
        let glareCall: gsap.core.Tween | null = null;
        let current = 0;
        let count = 0;
        let visible = true;

        const cycle = () => {
          next = null;
          if (!visible) return;
          const from = list[current];
          current = (current + 1) % list.length;
          const to = list[current];
          const [toWidth] = widthOf([to]);

          // The box keeps its width while the old word is erased, eases to
          // the new word's width while empty, and the new word is typed into
          // it: the rest of the line moves once, smoothly, not per letter.
          blink.pause(0);
          gsap.set(word, { width: word.offsetWidth });
          active = gsap.timeline({
            onComplete: () => {
              gsap.set(word, { clearProps: "width" });
              blink.restart();
              if (++count % 2 === 0) glareCall = gsap.delayedCall(0.2, glare);
              next?.kill();
              next = gsap.delayedCall(HOLD, cycle);
            },
          });
          for (let n = from.length - 1; n >= 0; n--) {
            active.call(setText, [from.slice(0, n)], "+=0.04");
          }
          active.to(word, { width: toWidth, duration: 0.45, ease: "power2.inOut" }, "+=0.15");
          for (let n = 1; n <= to.length; n++) {
            // Uneven key rhythm reads as typing rather than a timer.
            active.call(setText, [to.slice(0, n)], `+=${gsap.utils.random(0.06, 0.12)}`);
          }
        };

        // Right after the intro lines land (see Hero.tsx).
        glareCall = gsap.delayedCall(1, glare);
        next = gsap.delayedCall(3, cycle);

        // Nothing is typed while the hero is scrolled out of view.
        ScrollTrigger.create({
          trigger: title,
          start: "top bottom",
          end: "bottom top",
          onToggle: (self) => {
            visible = self.isActive;
            if (!visible) {
              blink.pause();
              next?.kill();
              next = null;
            } else if (!active?.isActive()) {
              blink.resume();
              next ??= gsap.delayedCall(1, cycle);
            }
          },
        });

        return () => {
          alive = false;
          cancelAnimationFrame(frame);
          observer.disconnect();
          document.fonts.removeEventListener("loadingdone", onResize);
          window.removeEventListener("resize", onResize);
          // Created after this callback ran, so the matchMedia context
          // doesn't track them: stop and reset by hand.
          next?.kill();
          active?.kill();
          glareCall?.kill();
          blink.kill();
          gsap.killTweensOf([title, word]);
          gsap.set(title, { "--shine": "-20%" });
          word.style.width = "";
          word.replaceChildren(list[0]);
          line.style.whiteSpace = "";
          tail.style.display = "";
        };
      }
    );

    return () => mm.revert();
  }, [wordsKey]);

  return (
    <h1
      ref={titleRef}
      data-stars-avoid
      style={TITLE_STYLE}
      // Bottom padding keeps the last line's descenders inside the mask. On
      // phones the size shrinks below 390px so the widest word still fits a line.
      className="mb-[calc(1.5rem_-_0.2em)] pb-[0.2em] font-heading text-[length:min(3rem,calc((100vw_-_3rem)/7.1))] leading-tight font-bold text-white md:text-7xl [@media(max-height:500px)]:text-4xl roomy:text-[clamp(3rem,min(4.6vw,8vh),4.5rem)]"
    >
      {/* Extra bottom padding keeps descenders out of each line's overflow clip. */}
      <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
        <span className="hero-line block">{t("hero.titleLine1")}</span>{" "}
      </span>
      <span className="-mb-[0.15em] block overflow-hidden pb-[0.15em]">
        <span className="hero-line block">
          {/* Remounted per language, so the hook's rewritten text never meets React's.
              Left-aligned so a word typed into its reserved width starts at the caret. */}
          <span key={wordsKey} className="hero-word relative inline-block text-left align-top">
            {words[0]}
          </span>{" "}
          <span className="hero-tail">{t("hero.titleTail")}</span>
        </span>
      </span>
    </h1>
  );
}
