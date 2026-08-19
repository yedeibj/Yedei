import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Link from "next/link";

const THREAD_COLORS = ["#006400", "#dc143c", "#00008b", "#006400"];

export default async function CategoryGrid() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, image_url")
    .is("parent_id", null)
    .order("sort_order");

  if (!categories || categories.length === 0) return null;

  return (
    <section className="px-6 py-12 sm:px-12">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {categories.map((cat, i) => (
          <Link
            key={cat.id}
            href={`/collections/${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-md bg-[#F0EDE5]"
          >
            {cat.image_url ? (
              <img
                src={cat.image_url}
                alt={cat.name}
                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            )}
            <span
              className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 font-display text-sm italic shadow-sm sm:text-base"
              style={{ color: THREAD_COLORS[i % THREAD_COLORS.length] }}
            >
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
