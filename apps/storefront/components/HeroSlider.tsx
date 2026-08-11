"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/heroSlides";

const AUTOPLAY_MS = 6000;
const THREAD_COLORS = ["#006400", "#dc143c", "#00008b"];

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

  const activeSlide = heroSlides[index];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#F6F3EC]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Mise en avant des collections YEDEI"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Texte */}
        <div className="order-2 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:order-1 lg:px-16">
          {activeSlide.eyebrow && (
            <p className="mb-3 font-sans text-xs uppercase tracking-[0.25em] text-[#8C8579]">
              {activeSlide.eyebrow}
            </p>
          )}
          <h2 className="font-display text-3xl italic leading-tight text-[#181715] sm:text-4xl lg:text-5xl">
            {activeSlide.title}
          </h2>
          <p className="mt-4 max-w-sm font-sans text-sm text-[#8C8579] sm:text-base">
            {activeSlide.description}
          </p>
          <Link
            href={activeSlide.ctaHref}
            className="group mt-8 inline-flex w-fit items-center gap-2 font-sans text-sm uppercase tracking-[0.15em] text-[#181715]"
          >
            <span className="border-b border-[#181715]/40 pb-1 transition-colors group-hover:border-[#181715]">
              {activeSlide.ctaLabel}
            </span>
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>

          <div className="mt-10 flex items-center gap-4">
            <button
              type="button"
              onClick={prev}
              aria-label="Slide précédent"
              className="text-2xl text-[#8C8579] transition-colors hover:text-[#181715]"
            >
              ‹
            </button>
            <div className="flex items-center gap-2">
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
                      width: i === index ? "24px" : "10px",
                      backgroundColor:
                        i === index ? THREAD_COLORS[i % THREAD_COLORS.length] : "#D8D3C9",
                    }}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={next}
              aria-label="Slide suivant"
              className="text-2xl text-[#8C8579] transition-colors hover:text-[#181715]"
            >
              ›
            </button>
          </div>
        </div>

         {/* Image */}
<div className="relative order-1 aspect-[9/16] w-full overflow-hidden bg-[#181715] sm:aspect-[3/4] lg:order-2 lg:aspect-auto lg:h-[85vh]">
  {heroSlides.map((slide, i) => (
    <img
      key={slide.id}
      src={slide.image}
      alt=""
      style={{ objectPosition: "center 20%" }}
      className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
        i === index ? "opacity-100" : "opacity-0"
      }`}
      aria-hidden={i !== index}
    />
  ))}
</div>
      </div>
    </section>
  );
}
