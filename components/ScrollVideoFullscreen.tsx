"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoFullscreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 1. Проверяем размер экрана при загрузке
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // 2. Включаем анимацию скролла ТОЛЬКО для десктопа
  useEffect(() => {
    // Если это мобилка, сразу выходим и ничего не инициализируем
    if (isMobile) return;

    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    video.pause();

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=200%",
      pin: true,
      scrub: 1.5,
      onUpdate: (self) => {
        if (video.duration) {
          video.currentTime = video.duration * self.progress;
        }
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [isMobile]);

  return (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden bg-black"
    >
      {isMobile ? (
        <div className="absolute inset-0 bg-black" />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="auto"
        >
          <source src="/video/scroll-bg.webm" type="video/webm" />
          <source src="/video/scroll-bg.mp4" type="video/mp4" />
        </video>
      )}
    </div>
  );
}
