import Image from "next/image";
import Link from "next/link";
import { categories } from "@/data/categories";

const spans: Record<string, string> = {
  femmes: "md:col-span-7 md:row-span-2",
  hommes: "md:col-span-5 md:row-span-1",
  enfants: "md:col-span-5 md:row-span-1",
  bebes: "md:col-span-7 md:row-span-1",
};

export default function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-container px-6 py-20 md:px-10">
      <div className="mb-10 flex items-end justify-between">
        <h2 className="font-display text-3xl italic text-ink sm:text-4xl">
          Quatre univers, une même exigence
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-12 md:grid-rows-2 md:gap-6">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/${category.slug}`}
            className={`group relative block overflow-hidden ${spans[category.slug]}`}
          >
            <div className="relative aspect-[4/5] w-full md:h-full md:aspect-auto">
              <Image
                src={category.image}
                alt={`Collection ${category.label} YEDEI`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/0 to-ink/0" />
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6">
              <div>
                <h3 className="font-display text-2xl text-paper">
                  {category.label}
                </h3>
                <p className="mt-1 text-sm text-paper/80">
                  {category.description}
                </p>
              </div>
              <span className="shrink-0 border border-paper/70 px-4 py-2 text-xs uppercase tracking-widest2 text-paper transition-colors group-hover:bg-paper group-hover:text-ink">
                Découvrir
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
