"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoFullscreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const video = videoRef.current;
    const container = containerRef.current;

    if (!video || !container) return;

    // The <video> ships with preload="none" so hidden mobile layouts never
    // download it; kick off the actual load only here, on desktop.
    video.preload = "auto";
    video.load();
    video.pause();

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=150%",
      pin: true,
      scrub: 1.2,
      anticipatePin: 1,
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
      className="w-full h-screen relative overflow-hidden bg-black hidden md:block"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="none"
      >
        <source src="/video/scroll-bg.webm" type="video/webm" />
        <source src="/video/scroll-bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
