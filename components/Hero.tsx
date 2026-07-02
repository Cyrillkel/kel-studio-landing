"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          {/* Сначала загружаем пережатый WebM (минус 9 мегабайт трафика!) */}
          <source src="/video/hero-video.webm" type="video/webm" />

          {/* Запасной вариант */}
          <source src="/video/hero-video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0a]/20 to-[#0a0a0a]/60" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text leading-tight">
          Создаём цифровые
          <br />
          продукты будущего
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
          Веб-студия полного цикла. Дизайн, разработка и продвижение сайтов
          премиум-класса
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="#contact"
            className="bg-white text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
          >
            Начать проект
          </Link>
          <Link
            href="#portfolio"
            className="border border-white/30 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition"
          >
            Смотреть работы
          </Link>
        </div>
      </div>
    </section>
  );
}
