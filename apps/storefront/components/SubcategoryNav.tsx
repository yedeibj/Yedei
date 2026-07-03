import Link from "next/link";
import { categories } from "@/data/categories";

export default function SubcategoryNav() {
  return (
    <section className="border-y border-stone-light/60 bg-sand">
      <div className="mx-auto max-w-container px-6 py-12 md:px-10">
        <h2 className="mb-8 text-xs uppercase tracking-widest2 text-stone">
          Accès rapide
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) => (
            <div key={category.slug}>
              <h3 className="font-display text-lg italic text-ink">
                {category.label}
              </h3>
              <ul className="mt-3 flex flex-col gap-2">
                {category.subcategories.map((sub) => (
                  <li key={sub.href}>
                    <Link
                      href={sub.href}
                      className="text-sm text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      {sub.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
