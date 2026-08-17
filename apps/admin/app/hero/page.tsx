import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import AdminShell from "@/components/AdminShell";
import HeroSlideEditor from "@/components/HeroSlideEditor";

export default async function HeroPage() {
  const supabase = await createServerSupabaseClient();
  const { data: slides } = await supabase
    .from("hero_slides")
    .select("id, eyebrow, title, description, cta_label, cta_href, image_url, sort_order, is_active")
    .order("sort_order");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Bannière d'accueil (Hero)</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Les slides défilent automatiquement sur la page d'accueil. Seuls les slides actifs sont affichés.
      </p>

      <div className="mt-8 space-y-4">
        {(slides ?? []).map((slide) => (
          <HeroSlideEditor key={slide.id} slide={slide} />
        ))}
        {(!slides || slides.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucun slide pour le moment.</p>
        )}
      </div>

      <div className="mt-10">
        <HeroSlideEditor />
      </div>
    </AdminShell>
  );
}
