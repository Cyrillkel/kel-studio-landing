"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoFullscreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    video.pause();

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: isMobile ? "+=150%" : "+=200%",
      pin: true,
      scrub: isMobile ? 1 : 1.5,
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

  return isMobile ? null : (
    <div
      ref={containerRef}
      className="w-full h-screen relative overflow-hidden bg-black"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
        key={isMobile ? "mobile" : "desktop"}
      >
        {/* Первым делом предлагаем браузеру супер-легкий WebM */}
        <source
          src={
            isMobile ? "/video/scroll-bg-mobile.webm" : "/video/scroll-bg.webm"
          }
          type="video/webm"
        />

        {/* Если браузер совсем старый и не знает про WebM, сработает этот MP4 */}
        <source
          src={
            isMobile ? "/video/scroll-bg-mobile.mp4" : "/video/scroll-bg.mp4"
          }
          type="video/mp4"
        />
      </video>
    </div>
  );
}
