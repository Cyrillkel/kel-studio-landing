"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollVideoFullscreen() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
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
      >
        <source src="/video/scroll-bg.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
