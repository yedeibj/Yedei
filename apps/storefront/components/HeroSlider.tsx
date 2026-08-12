"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { heroSlides } from "@/data/heroSlides";

const AUTOPLAY_MS = 6000;
const THREAD_COLORS = ["#006400", "#dc143c", "#00008b"];

export default function HeroSlider() {
  const visibleSlides = heroSlides.filter((slide) => slide.active !== false);

  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = visibleSlides.length;

  const goTo = useCallback(
    (nextIndex: number) => setIndex(((nextIndex % total) + total) % total),
    [total]
  );
  const next = useCallback(() => goTo(index + 1), [goTo, index]);
  const prev = useCallback(() => goTo(index - 1), [goTo, index]);

  useEffect(() => {
    if (isHovered || total === 0) return;
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isHovered, total]);

  if (total === 0) return null;

  const activeSlide = visibleSlides[index];

  return (
    <section
      className="relative w-full overflow-hidden bg-[#F6F3EC]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-roledescription="carousel"
      aria-label="Mise en avant des collections YEDEI"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center">
        {/* Image, à gauche sur desktop */}
        <div className="relative order-1 px-6 pt-10 sm:px-12 lg:px-16 lg:py-16">
          {/* Panneau décoratif en arrière-plan, décalé */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-2 h-[92%] w-[92%] rounded-2xl bg-[#181715]/5 sm:-right-4"
          />

          <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl bg-[#181715] shadow-xl sm:aspect-[3/4] lg:aspect-[4/5]">
            {visibleSlides.map((slide, i) => (
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

          {/* Repère Fil YEDEI, en coin de l'image */}
          <div className="absolute -bottom-3 left-9 flex items-center gap-2 rounded-full bg-white px-3 py-2 shadow-md sm:left-15">
            <span className="flex gap-[3px]" aria-hidden="true">
              <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
              <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
              <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
            </span>
            <span className="font-display text-xs italic text-[#181715]">YEDEI</span>
          </div>
        </div>

        {/* Texte, à droite sur desktop */}
        <div className="order-2 flex flex-col justify-center px-6 py-12 sm:px-12 sm:py-16 lg:px-16">
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

          {total > 1 && (
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
                {visibleSlides.map((slide, i) => (
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
          )}
        </div>
      </div>
    </section>
  );
}
