import Image from "next/image";
import FilYedei from "./FilYedei";

export default function BrandStory() {
  return (
    <section className="bg-sand">
      <div className="mx-auto grid max-w-container items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
        <div className="relative aspect-[4/5] w-full">
          <div className="absolute -inset-3 hidden border border-yedei-blue/20 md:block" />
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="https://picsum.photos/seed/yedei-story/1000/1250"
              alt="L'atelier YEDEI, savoir-faire familial"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>

        <div>
          <FilYedei />
          <h2 className="mt-6 font-display text-3xl italic leading-tight text-ink sm:text-4xl">
            Une maison familiale, née à Cotonou
          </h2>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70">
            YEDEI est née d&apos;une conviction simple : chaque génération
            d&apos;une même famille mérite des vêtements pensés avec la même
            exigence. Des matières choisies avec soin, des finitions
            irréprochables et une attention portée à chaque silhouette,
            du nouveau-né au grand-parent.
          </p>
          <p className="mt-4 max-w-lg font-display text-xl italic text-ink/80">
            &laquo; La qualité ne se discute pas, elle se porte. &raquo;
          </p>
        </div>
      </div>
    </section>
  );
}
