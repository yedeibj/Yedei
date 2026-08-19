import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Link from "next/link";

export default async function SeasonalBanner() {
  const supabase = await createServerSupabaseClient();
  const { data: entries } = await supabase
    .from("seasonal_collection")
    .select("id, title, description, image_url, image_position, link_href")
    .eq("is_active", true);

  if (!entries || entries.length === 0) return null;

  return (
    <section className="px-6 py-4 sm:px-12">
      <div className="space-y-6">
        {entries.map((entry) => {
          const position = entry.image_position || "center";
          return (
            <div
              key={entry.id}
              className="relative flex aspect-[4/5] items-end overflow-hidden rounded-2xl bg-[#181715] sm:aspect-[16/9] sm:items-center lg:aspect-[21/9]"
            >
              {entry.image_url && (
                <>
                  {/* Fond flou, décoratif, remplit tout l'espace sans se soucier du recadrage */}
                  <img
                    src={entry.image_url}
                    alt=""
                    aria-hidden="true"
                    style={{ objectPosition: position }}
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
                  />
                  <div className="absolute inset-0 bg-[#181715]/35" />
                  {/* Image nette, jamais recadrée ni zoomée */}
                  <img
                    src={entry.image_url}
                    alt=""
                    style={{ objectPosition: position }}
                    className="absolute inset-0 h-full w-full object-contain"
                  />
                </>
              )}
              {!entry.image_url && (
                <div className="absolute inset-0 bg-gradient-to-br from-[#006400]/40 via-[#181715] to-[#00008B]/40" />
              )}

              <div className="relative z-10 max-w-md bg-gradient-to-t from-[#181715]/80 to-transparent px-8 py-10 sm:bg-none sm:px-14">
                <span className="flex gap-[3px]" aria-hidden="true">
                  <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
                  <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
                  <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
                </span>
                <h2 className="mt-3 font-display text-3xl italic leading-tight text-white sm:text-4xl">
                  {entry.title}
                </h2>
                {entry.description && (
                  <p className="mt-4 text-sm text-white/90 sm:text-base">{entry.description}</p>
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
          );
        })}
      </div>
    </section>
  );
}
