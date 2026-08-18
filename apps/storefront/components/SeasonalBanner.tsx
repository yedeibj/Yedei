import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Link from "next/link";

export default async function SeasonalBanner() {
  const supabase = await createServerSupabaseClient();
  const { data: entries } = await supabase
    .from("seasonal_collection")
    .select("id, title, description, image_url, link_href")
    .eq("is_active", true);

  if (!entries || entries.length === 0) return null;

  return (
    <section className="px-6 py-4 sm:px-12">
      <div className="space-y-6">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="relative flex min-h-[280px] items-center overflow-hidden rounded-2xl bg-[#181715] sm:min-h-[380px]"
          >
            {entry.image_url ? (
              <img
                src={entry.image_url}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-70"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#006400]/40 via-[#181715] to-[#00008B]/40" />
            )}

            <div className="relative z-10 max-w-md px-8 py-10 sm:px-14">
              <span className="flex gap-[3px]" aria-hidden="true">
                <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
                <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
                <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
              </span>
              <h2 className="mt-3 font-display text-3xl italic leading-tight text-white sm:text-4xl">
                {entry.title}
              </h2>
              {entry.description && (
                <p className="mt-4 text-sm text-white/80 sm:text-base">{entry.description}</p>
              )}
              {entry.link_href && (
                <Link
                  href={entry.link_href}
                  className="group mt-8 inline-flex w-fit items-center gap-2 border-b border-white/40 pb-1 text-sm uppercase tracking-[0.15em] text-white transition-colors hover:border-white"
                >
                  Découvrir
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
