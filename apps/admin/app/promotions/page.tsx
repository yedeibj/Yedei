import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

async function addPromotion(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await supabase.from("promotions").insert({
    title,
    description: String(formData.get("description") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    cta_label: String(formData.get("cta_label") ?? "").trim() || null,
    cta_href: String(formData.get("cta_href") ?? "").trim() || null,
    starts_at: String(formData.get("starts_at") ?? "") || null,
    ends_at: String(formData.get("ends_at") ?? "") || null,
    is_active: formData.get("is_active") === "on",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/promotions");
}

async function updatePromotion(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;
  await supabase
    .from("promotions")
    .update({
      title,
      description: String(formData.get("description") ?? "").trim() || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      cta_label: String(formData.get("cta_label") ?? "").trim() || null,
      cta_href: String(formData.get("cta_href") ?? "").trim() || null,
      starts_at: String(formData.get("starts_at") ?? "") || null,
      ends_at: String(formData.get("ends_at") ?? "") || null,
      is_active: formData.get("is_active") === "on",
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  revalidatePath("/promotions");
}

async function deletePromotion(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("promotions").delete().eq("id", id);
  revalidatePath("/promotions");
}

export default async function PromotionsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: promotions } = await supabase
    .from("promotions")
    .select("id, title, description, image_url, cta_label, cta_href, starts_at, ends_at, is_active, sort_order")
    .order("sort_order");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Promotions</h1>
      <p className="mt-1 text-sm text-[#8C8579]">Bandeaux et cartes promotionnelles affichés sur le site.</p>

      <div className="mt-8 space-y-4">
        {(promotions ?? []).map((promo) => (
          <div key={promo.id} className="rounded-md border border-[#D8D3C9] p-4">
            <form action={updatePromotion} className="space-y-3">
              <input type="hidden" name="id" value={promo.id} />
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Titre</label>
                  <input name="title" defaultValue={promo.title ?? ""} required className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">URL image</label>
                  <input name="image_url" defaultValue={promo.image_url ?? ""} placeholder="https://..." className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Description</label>
                <textarea name="description" defaultValue={promo.description ?? ""} rows={2} className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Texte bouton</label>
                  <input name="cta_label" defaultValue={promo.cta_label ?? ""} className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Lien bouton</label>
                  <input name="cta_href" defaultValue={promo.cta_href ?? ""} placeholder="/collections/..." className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Début</label>
                  <input name="starts_at" type="date" defaultValue={promo.starts_at ?? ""} className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Fin</label>
                  <input name="ends_at" type="date" defaultValue={promo.ends_at ?? ""} className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={promo.is_active} />
                  Active
                </label>
                <div className="flex items-center gap-3">
                  <input name="sort_order" type="number" defaultValue={promo.sort_order} className="w-20 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]" />
                  <button type="submit" className="rounded-md bg-[#006400] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90">
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
            <div className="mt-2 flex justify-end">
              <ConfirmSubmitButton
                action={deletePromotion}
                hiddenFields={{ id: promo.id }}
                confirmMessage={`Supprimer la promotion "${promo.title}" ?`}
                label="Supprimer"
                className="text-xs text-[#DC143C] hover:underline"
              />
            </div>
          </div>
        ))}
        {(!promotions || promotions.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucune promotion pour le moment.</p>
        )}
      </div>

      <div className="mt-10 max-w-lg rounded-md border border-[#D8D3C9] p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">Nouvelle promotion</h2>
        <form action={addPromotion} className="mt-4 space-y-3">
          <input name="title" placeholder="Titre" required className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
          <textarea name="description" placeholder="Description" rows={2} className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
          <input name="image_url" placeholder="URL image (optionnel)" className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
          <div className="grid grid-cols-2 gap-3">
            <input name="cta_label" placeholder="Texte bouton" className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
            <input name="cta_href" placeholder="Lien bouton" className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input name="starts_at" type="date" className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
            <input name="ends_at" type="date" className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <input name="sort_order" type="number" defaultValue={0} placeholder="Ordre d'affichage" className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
          <button type="submit" className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90">
            Créer
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
