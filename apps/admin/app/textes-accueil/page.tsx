import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";

const KEY_LABELS: Record<string, string> = {
  nouveautes: "Avant Nouveautés / Meilleures ventes",
  saison: "Avant la Collection de saison",
  collections: "Avant les collections Homme/Femme/Enfant/Bébé",
};

async function updateSection(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;
  await supabase
    .from("section_intros")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);
  revalidatePath("/textes-accueil");
}

export default async function HomepageTextsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: sections } = await supabase
    .from("section_intros")
    .select("id, key, title, description, is_active")
    .order("key");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Textes de la page d'accueil</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Ces petits textes apparaissent entre les blocs de la page d'accueil, pour introduire chaque section.
      </p>

      <div className="mt-8 space-y-4">
        {(sections ?? []).map((section) => (
          <div key={section.id} className="rounded-md border border-[#D8D3C9] p-4">
            <p className="text-xs uppercase tracking-wide text-[#8C8579]">
              {KEY_LABELS[section.key] ?? section.key}
            </p>
            <form action={updateSection} className="mt-3 space-y-3">
              <input type="hidden" name="id" value={section.id} />
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Titre</label>
                <input
                  name="title"
                  defaultValue={section.title}
                  required
                  className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Description</label>
                <textarea
                  name="description"
                  defaultValue={section.description ?? ""}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={section.is_active} />
                  Afficher ce texte
                </label>
                <button
                  type="submit"
                  className="rounded-md bg-[#006400] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        ))}
        {(!sections || sections.length === 0) && (
          <p className="text-sm text-[#8C8579]">
            Aucun texte configuré — exécute d'abord le script SQL fourni.
          </p>
        )}
      </div>
    </AdminShell>
  );
}
