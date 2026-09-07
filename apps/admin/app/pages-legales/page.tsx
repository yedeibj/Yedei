import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function addPage(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const title = String(formData.get("title") ?? "").trim();
  if (!title) return;
  await supabase.from("legal_pages").insert({
    slug: slugify(title),
    title,
    content: String(formData.get("content") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_active: formData.get("is_active") === "on",
  });
  revalidatePath("/pages-legales");
}

async function updatePage(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!id || !title) return;
  await supabase
    .from("legal_pages")
    .update({
      title,
      content: String(formData.get("content") ?? "").trim() || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id);
  revalidatePath("/pages-legales");
}

async function deletePage(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("legal_pages").delete().eq("id", id);
  revalidatePath("/pages-legales");
}

export default async function LegalPagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: pages } = await supabase
    .from("legal_pages")
    .select("id, slug, title, content, is_active, sort_order")
    .order("sort_order");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Pages légales</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        CGV, mentions légales, politique de confidentialité, livraison, paiement, contact — tout
        s'affiche dans le pied de page du site, dans l'ordre choisi ci-dessous.
      </p>

      <div className="mt-8 space-y-4">
        {(pages ?? []).map((page) => (
          <div key={page.id} className="rounded-md border border-[#D8D3C9] p-4">
            <form action={updatePage} className="space-y-3">
              <input type="hidden" name="id" value={page.id} />
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
                  Titre (affiché dans le footer)
                </label>
                <input
                  name="title"
                  defaultValue={page.title}
                  required
                  className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
                  Contenu de la page
                </label>
                <textarea
                  name="content"
                  defaultValue={page.content ?? ""}
                  rows={8}
                  className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
                <p className="mt-1 text-[10px] text-[#8C8579]">
                  Laisse une ligne vide entre deux paragraphes pour les séparer sur le site.
                </p>
              </div>
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="is_active" defaultChecked={page.is_active} />
                  Visible dans le footer
                </label>
                <div className="flex items-center gap-3">
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={page.sort_order}
                    className="w-20 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                  />
                  <button
                    type="submit"
                    className="rounded-md bg-[#006400] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </form>
            <p className="mt-2 text-[10px] text-[#8C8579]">
              URL sur le site : /pages/{page.slug}
            </p>
            <div className="mt-1 flex justify-end">
              <ConfirmSubmitButton
                action={deletePage}
                hiddenFields={{ id: page.id }}
                confirmMessage={`Supprimer la page "${page.title}" ?`}
                label="Supprimer"
                className="text-xs text-[#DC143C] hover:underline"
              />
            </div>
          </div>
        ))}
        {(!pages || pages.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucune page pour le moment.</p>
        )}
      </div>

      <div className="mt-10 max-w-lg rounded-md border border-[#D8D3C9] p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">Nouvelle page</h2>
        <form action={addPage} className="mt-4 space-y-3">
          <input
            name="title"
            placeholder="Titre (ex: Retours et remboursements)"
            required
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <textarea
            name="content"
            placeholder="Contenu de la page"
            rows={6}
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            placeholder="Ordre d'affichage"
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_active" defaultChecked />
            Visible dans le footer
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
