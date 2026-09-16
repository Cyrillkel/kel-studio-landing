"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useTranslation } from "react-i18next";
import { smoothNavigate } from "./smoothNavigate";
import { useSnapSlider } from "./useSnapSlider";
import SliderDots from "./SliderDots";
import { ButtonLink } from "./Button";

gsap.registerPlugin(ScrollTrigger);

type ProjectItem = {
  title: string;
  description: string;
  image?: string;
  url?: string;
};

// Cards are capped by viewport height too, so the pinned row always fits
// under the heading on short desktop screens. The CTA mirrors the image height.
const CARD_WIDTH = "md:w-[min(50vw,760px,calc((100vh_-_300px)*16/9))]";
const CARD_IMAGE_HEIGHT = "md:h-[min(28.125vw,427.5px,calc(100vh_-_300px))]";

export default function Portfolio() {
  const { t } = useTranslation();
  const items = t("portfolio.items", { returnObjects: true }) as ProjectItem[];
  const total = items.length;

  const sectionRef = useRef<HTMLElement>(null);
  const currentRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const {
    sliderRef: trackRef,
    activeSlide,
    scrollToSlide,
  } = useSnapSlider(".portfolio-card");

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const current = currentRef.current;
    const progress = progressRef.current;
    if (!section || !track || !current || !progress) return;

    const mm = gsap.matchMedia(section);

    mm.add(
      {
        isDesktop: "(min-width: 768px)",
        // matchMedia only runs the callback when some condition matches.
        isMobile: "(max-width: 767px)",
        reduceMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { isDesktop, reduceMotion } = context.conditions as {
          isDesktop: boolean;
          reduceMotion: boolean;
        };
        const cards = gsap.utils.toArray<HTMLElement>(".portfolio-card");
        const reveals = new Map<Element, gsap.core.Timeline>();

        if (isDesktop) {
          const projectCards = cards.filter((card) => card.dataset.project);
          const distance = () => track.scrollWidth - section.clientWidth;
          const setProgress = gsap.quickSetter(progress, "scaleX");
          let shown = 1;

          // Vertical scroll drives the row sideways while the section is pinned.
          const scroll = gsap.to(track, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${distance()}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
              // Pin spacing shifts everything below; refresh it before them.
              refreshPriority: 1,
              onUpdate: (self) => {
                setProgress(self.progress);

                const x = gsap.getProperty(track, "x") as number;
                const center = section.clientWidth / 2;
                let closest = 0;
                let closestDistance = Infinity;
                projectCards.forEach((card, index) => {
                  const d = Math.abs(
                    card.offsetLeft + card.offsetWidth / 2 + x - center
                  );
                  if (d < closestDistance) {
                    closestDistance = d;
                    closest = index;
                  }
                });

                if (closest + 1 !== shown) {
                  shown = closest + 1;
                  current.textContent = String(shown).padStart(2, "0");
                }
              },
            },
          });

          if (!reduceMotion) {
            projectCards.forEach((card) => {
              gsap.fromTo(
                card.querySelector(".portfolio-media"),
                { xPercent: -6 },
                {
                  xPercent: 6,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: scroll,
                    start: "left right",
                    end: "right left",
                    scrub: true,
                  },
                }
              );
            });
          }
        }

        if (!reduceMotion) {
          // Animates inner wrappers, not the cards: the desktop parallax
          // triggers measure card positions and the mobile slider scales cards.
          const entrance = gsap.timeline({ paused: true }).from(
            section.querySelectorAll(".portfolio-reveal"),
            {
              x: isDesktop ? 160 : 60,
              opacity: 0,
              duration: 1.1,
              ease: "power3.out",
              stagger: 0.1,
            }
          );
          reveals.set(section, entrance);
          ScrollTrigger.create({
            trigger: section,
            start: "top 75%",
            once: true,
            onEnter: () => entrance.play(),
          });
        }

        // Same safety net as the other sections: never leave content hidden
        // if a ScrollTrigger start is skipped.
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const tl = reveals.get(entry.target);
              if (tl && tl.progress() === 0 && !tl.isActive()) tl.play();
              observer.unobserve(entry.target);
            });
          },
          { rootMargin: "0px 0px -20% 0px" }
        );
        reveals.forEach((_, el) => observer.observe(el));

        return () => observer.disconnect();
      }
    );

    return () => mm.revert();
  }, [total, trackRef]);

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (smoothNavigate("#contact")) {
      e.preventDefault();
    }
  };

  return (
    <section
      id="portfolio"
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-0 bg-[linear-gradient(to_bottom,#0a0a0a_0px,#141414_180px,#141414_calc(100%-200px),#000000_100%)]"
    >
      <div className="md:flex md:h-screen md:flex-col md:justify-center">
        <div className="mx-auto mb-8 flex w-full max-w-7xl items-end justify-between gap-6 px-5 sm:px-6 md:mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white">
            {t("portfolio.heading")}
          </h2>
          <div aria-hidden="true" className="hidden items-center gap-4 pb-2 md:flex">
            <span className="font-heading text-sm tabular-nums text-white">
              <span ref={currentRef}>01</span>
              <span className="text-gray-500">
                {" / "}
                {String(total).padStart(2, "0")}
              </span>
            </span>
            <span className="relative h-px w-32 overflow-hidden bg-white/15 lg:w-48">
              <span
                ref={progressRef}
                className="absolute inset-0 origin-left scale-x-0 bg-linear-to-r from-cyan-400 via-violet-500 to-fuchsia-500"
              />
            </span>
          </div>
        </div>

        <div
          ref={trackRef}
          className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto px-[10vw] py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:w-max md:snap-none md:gap-8 md:overflow-visible md:px-[max(1.5rem,calc((100%_-_80rem)/2_+_1.5rem))] md:py-0"
        >
          {items.map((item, index) => {
            const content = (
              <div className="portfolio-reveal group">
                <div className="portfolio-frame relative aspect-video overflow-hidden rounded-2xl border border-white/5 bg-[#1f1f1f]">
                  {item.image && (
                    <div className="portfolio-media absolute inset-0 md:-inset-x-[8%]">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 767px) 100vw, 58vw"
                        className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    </div>
                  )}
                  {item.url && (
                    <span
                      aria-hidden="true"
                      className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-sm transition duration-300 md:translate-y-2 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                    >
                      <svg
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M7 17 17 7M8 7h9v9" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="portfolio-text mt-5 flex items-start gap-4">
                  <span className="pt-1.5 font-heading text-sm tabular-nums text-gray-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-heading text-xl sm:text-2xl font-bold text-white">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-gray-400">{item.description}</p>
                  </div>
                </div>
              </div>
            );

            return (
              <article
                key={index}
                data-project="true"
                className={`portfolio-card w-[80vw] shrink-0 snap-center ${CARD_WIDTH}`}
              >
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.title}
                    className="block cursor-pointer"
                  >
                    {content}
                  </a>
                ) : (
                  content
                )}
              </article>
            );
          })}

          <article className="portfolio-card w-[80vw] shrink-0 snap-center md:w-[min(30vw,440px)]">
            <div className="portfolio-reveal h-full">
              <div
                className={`portfolio-frame relative flex h-full flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/2 p-7 sm:p-8 ${CARD_IMAGE_HEIGHT}`}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(168,85,247,0.2),transparent_60%)]"
                />
                <div className="portfolio-text relative">
                  <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white">
                    {t("portfolio.ctaTitle")}
                  </h3>
                  <p className="mt-3 text-gray-400 leading-relaxed">
                    {t("portfolio.ctaText")}
                  </p>
                </div>
                <ButtonLink
                  href="#contact"
                  className="relative self-start"
                  onClick={handleContactClick}
                >
                  {t("portfolio.ctaButton")}
                </ButtonLink>
              </div>
            </div>
          </article>
        </div>
        <SliderDots
          count={total + 1}
          active={activeSlide}
          onSelect={scrollToSlide}
          className="mt-6"
        />
      </div>
    </section>
  );
}
