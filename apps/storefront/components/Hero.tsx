import Image from "next/image";
import FilYedei from "./FilYedei";

export default function Hero() {
  return (
    <section className="border-b border-stone-light/60">
      <div className="mx-auto grid max-w-container items-stretch gap-10 px-6 py-12 md:grid-cols-12 md:gap-8 md:px-10 md:py-0">
        {/* Texte */}
        <div className="flex flex-col justify-center md:col-span-5 md:py-24">
          <span className="text-xs uppercase tracking-widest2 text-stone">
            Collection 2026
          </span>
          <h1 className="mt-5 font-display text-4xl italic leading-[1.1] text-ink sm:text-5xl">
            L&apos;élégance pour toute la famille
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-ink/70">
            Découvrez nos collections pensées pour accompagner chaque
            génération avec style et confort — d&apos;Hommes à Bébés, une
            seule exigence : la qualité.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#categories"
              className="bg-ink px-7 py-3.5 text-sm uppercase tracking-widest2 text-paper transition-opacity hover:opacity-85"
            >
              Découvrir la collection
            </a>
            <a
              href="#nouveautes"
              className="border border-ink px-7 py-3.5 text-sm uppercase tracking-widest2 text-ink transition-colors hover:bg-ink hover:text-paper"
            >
              Acheter maintenant
            </a>
          </div>
          <FilYedei className="mt-10" />
        </div>

        {/* Image */}
        <div className="relative md:col-span-7">
          <div className="relative aspect-[4/5] w-full overflow-hidden md:aspect-auto md:h-full">
            <Image
              src="https://picsum.photos/seed/yedei-hero/1600/2000"
              alt="Famille portant des vêtements YEDEI, collection lifestyle"
              fill
              priority
              sizes="(min-width: 768px) 60vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
