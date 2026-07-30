"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/heroSlides";

const AUTOPLAY_MS = 6000;
const THREAD_COLORS = ["#2f6b4f", "#ad3b3b", "#233e6c"];

export default function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = heroSlides.length;

  const goTo = useCallback(
    (nextIndex: number) => setIndex(((nextIndex % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isHovered) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, total]);

  return (
    <section
      className="relative h-[88vh] min-h-[560px] w-full overflow-hidden bg-[#181715]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Mise en avant des collections YEDEI"
    >
      {heroSlides.map((slide, i) => {
        const isActive = i === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              isActive ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
            aria-hidden={!isActive}
          >
            <Image
              src={slide.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover ${isActive ? "animate-kenburns" : ""}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            <div className="relative z-10 flex h-full items-end">
              <div className="max-w-xl px-6 pb-24 sm:px-12 sm:pb-28">
                {slide.eyebrow && (
                  <p
                    className={`mb-3 font-sans text-xs uppercase tracking-[0.25em] text-white/80 transition-all duration-700 delay-200 ${
                      isActive ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    }`}
                  >
                    {slide.eyebrow}
                  </p>
                )}
                <h2
                  className={`font-serif text-4xl italic leading-tight text-white transition-all duration-700 delay-300 sm:text-5xl ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.title}
                </h2>
                <p
                  className={`mt-4 max-w-sm font-sans text-sm text-white/85 transition-all duration-700 delay-500 sm:text-base ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  {slide.description}
                </p>
                <Link
                  href={slide.ctaHref}
                  className={`group mt-8 inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.15em] text-white transition-all duration-700 delay-700 ${
                    isActive ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  }`}
                >
                  <span className="border-b border-white/40 pb-1 transition-colors group-hover:border-white">
                    {slide.ctaLabel}
                  </span>
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={prev}
        aria-label="Slide précédent"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 p-3 text-white/70 transition-colors hover:text-white sm:left-6"
      >
        <span aria-hidden="true" className="text-2xl">‹</span>
      </button>
      <button
        type="button"
        onClick={next}
        aria-label="Slide suivant"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 p-3 text-white/70 transition-colors hover:text-white sm:right-6"
      >
        <span aria-hidden="true" className="text-2xl">›</span>
      </button>

      {/* Indicateurs — reprise du motif "Fil YEDEI" */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:left-auto sm:right-12 sm:translate-x-0">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Aller au slide ${i + 1}`}
            aria-current={i === index}
            className="p-1"
          >
            <span
              className="block h-[3px] rounded-full transition-all duration-500"
              style={{
                width: i === index ? "28px" : "12px",
                backgroundColor:
                  i === index ? THREAD_COLORS[i % THREAD_COLORS.length] : "rgba(255,255,255,0.4)",
              }}
            />
          </button>
        ))}
      </div>

      <div className="absolute bottom-8 left-6 z-20 font-sans text-xs tracking-[0.15em] text-white/70 sm:left-12">
        {String(index + 1).padStart(2, "0")} — {String(total).padStart(2, "0")}
      </div>
    </section>
  );
}
