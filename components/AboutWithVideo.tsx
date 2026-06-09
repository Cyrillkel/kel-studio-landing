"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "50+", label: "Проектов" },
  { value: "5+", label: "Лет опыта" },
  { value: "100%", label: "Качество" },
];

const stack = [
  "React, Next.js",
  "WordPress, Elementor",
  "Node.js, Python, PHP",
  "Tailwind CSS, GSAP, Framer Motion",
  "Figma",
  "PostgreSQL, MongoDB, Redis",
];

export default function AboutWithVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;

    if (!video || !section) return;

    video.pause();

    const scrollTrigger = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "bottom top",
      scrub: 1,
      onUpdate: (self) => {
        if (video.duration) {
          const progress = self.progress;
          video.currentTime = video.duration * progress;
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative py-24 bg-[#141414] overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Текст слева */}
          <div className="order-2 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              О студии
            </h2>
            <p className="text-xl text-gray-300 mb-6 leading-relaxed">
              KEL Studio - команда профессионалов с опытом более 5 лет в
              создании цифровых продуктов.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              Мы специализируемся на разработке веб-сайтов и приложений
              премиум-класса. Наш подход основан на глубоком понимании бизнеса
              клиента и потребностей его аудитории.
            </p>
            <div className="grid grid-cols-3 gap-8 mb-12">
              {stats.map((stat, index) => (
                <div key={index}>
                  <div className="text-4xl font-bold mb-2 text-white">
                    {stat.value}
                  </div>
                  <div className="text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#1f1f1f] p-8 lg:p-12 rounded-2xl border border-white/5">
              <h3 className="text-2xl font-bold mb-6 text-white">Наш стек</h3>
              <div className="space-y-4">
                {stack.map((tech, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="text-gray-300">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Видео справа */}
          <div className="order-1 lg:order-2 relative">
            <div className="relative lg:absolute lg:-right-32 lg:top-1/2 lg:-translate-y-1/2 lg:w-[120%] w-full">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  muted
                  playsInline
                  preload="auto"
                >
                  <source src="/video/scroll-bg.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
