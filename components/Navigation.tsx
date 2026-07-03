"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollSmoother } from "gsap/ScrollSmoother";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    const smoother = ScrollSmoother.get();
    if (smoother) {
      e.preventDefault();
      smoother.scrollTo(href, true, "top top");
    }
    setIsOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-white">KEL Studio</div>

            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#services"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#services")}
              >
                Услуги
              </Link>
              <Link
                href="#portfolio"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#portfolio")}
              >
                Портфолио
              </Link>
              <Link
                href="#about"
                className="text-gray-300 hover:text-white transition"
                onClick={(e) => handleNavClick(e, "#about")}
              >
                О нас
              </Link>
              <Link
                href="#contact"
                className="bg-white text-black px-6 py-2 rounded-lg hover:bg-gray-200 transition"
                onClick={(e) => handleNavClick(e, "#contact")}
              >
                Связаться
              </Link>
            </div>

            <button
              className="md:hidden text-white z-50 relative"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8 text-center">
            <Link
              href="#services"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#services")}
            >
              Услуги
            </Link>
            <Link
              href="#portfolio"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#portfolio")}
            >
              Портфолио
            </Link>
            <Link
              href="#about"
              className="text-2xl text-gray-300 hover:text-white transition"
              onClick={(e) => handleNavClick(e, "#about")}
            >
              О нас
            </Link>
            <Link
              href="#contact"
              className="bg-white text-black px-8 py-3 rounded-lg hover:bg-gray-200 transition text-xl"
              onClick={(e) => handleNavClick(e, "#contact")}
            >
              Связаться
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
