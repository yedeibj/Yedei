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
      <div className="mb-6 text-center">
        <span className="mx-auto flex w-fit justify-center gap-[3px]" aria-hidden="true">
          <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
          <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
          <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
        </span>
        <h2 className="mt-3 font-display text-3xl italic text-[#181715]">Nos collections</h2>
        <p className="mt-1 text-sm text-[#8C8579]">L'élégance pour toute la famille</p>
      </div>

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
