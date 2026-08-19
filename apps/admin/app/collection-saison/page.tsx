import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import ImageUrlUploader from "@/components/ImageUrlUploader";

async function addEntry(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await supabase.from("seasonal_collection").insert({
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    image_position: String(formData.get("image_position") ?? "center"),
    link_href: String(formData.get("link_href") ?? "").trim() || null,
    is_active: formData.get("is_active") === "on",
  });
  revalidatePath("/collection-saison");
}

async function updateEntry(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;
  await supabase
    .from("seasonal_collection")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      image_position: String(formData.get("image_position") ?? "center"),
      link_href: String(formData.get("link_href") ?? "").trim() || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);
  revalidatePath("/collection-saison");
}

async function deleteEntry(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("seasonal_collection").delete().eq("id", id);
  revalidatePath("/collection-saison");
}

export default async function SeasonalCollectionPage() {
  const supabase = await createServerSupabaseClient();
  const { data: entries } = await supabase
    .from("seasonal_collection")
    .select("id, title, description, image_url, image_position, link_href, is_active")
    .order("title");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Collection de saison</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Bannière mise en avant sur la page d'accueil (ex : "Nouvelle collection Rentrée").
      </p>

      <div className="mt-8 space-y-4">
        {(entries ?? []).map((entry) => (
          <div key={entry.id} className="rounded-md border border-[#D8D3C9] p-4">
            <form action={updateEntry} className="space-y-3">
              <input type="hidden" name="id" value={entry.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Titre</label>
                  <input
                    name="title"
                    defaultValue={entry.title ?? ""}
                    required
                    className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                  />
                </div>
                <ImageUrlUploader name="image_url" defaultValue={entry.image_url} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Description</label>
                <textarea
                  name="description"
                  defaultValue={entry.description ?? ""}
                  rows={2}
                  className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Lien (bouton)</label>
                  <input
                    name="link_href"
                    defaultValue={entry.link_href ?? ""}
                    placeholder="/collections/..."
                    className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
                    Cadrage de l'image
                  </label>
                  <select
                    name="image_position"
                    defaultValue={entry.image_position ?? "center"}
                    className="mt-1 w-full rounded-md border border-[#D8D3C9] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                  >
                    <option value="top">Haut (visages en haut de la photo)</option>
                    <option value="center">Centre (par défaut)</option>
                    <option value="bottom">Bas</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={entry.is_active} />
                  Active (visible sur le site)
                </label>
                <button
                  type="submit"
                  className="rounded-md bg-[#006400] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90"
                >
                  Enregistrer
                </button>
              </div>
            </form>
            <div className="mt-2 flex justify-end">
              <ConfirmSubmitButton
                action={deleteEntry}
                hiddenFields={{ id: entry.id }}
                confirmMessage={`Supprimer "${entry.title}" ?`}
                label="Supprimer"
                className="text-xs text-[#DC143C] hover:underline"
              />
            </div>
          </div>
        ))}
        {(!entries || entries.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucune entrée pour le moment.</p>
        )}
      </div>

      <div className="mt-10 max-w-lg rounded-md border border-[#D8D3C9] p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">Nouvelle entrée</h2>
        <form action={addEntry} className="mt-4 space-y-3">
          <input
            name="title"
            placeholder="Titre"
            required
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <textarea
            name="description"
            placeholder="Description"
            rows={2}
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <ImageUrlUploader name="image_url" />
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Cadrage de l'image</label>
            <select
              name="image_position"
              defaultValue="center"
              className="mt-1 w-full rounded-md border border-[#D8D3C9] bg-white px-3 py-2 text-sm outline-none focus:border-[#006400]"
            >
              <option value="top">Haut (visages en haut de la photo)</option>
              <option value="center">Centre (par défaut)</option>
              <option value="bottom">Bas</option>
            </select>
          </div>
          <input
            name="link_href"
            placeholder="Lien bouton (ex: /collections/enfant)"
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <button
            type="submit"
            className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
          >
            Créer
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
