import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import ImageUrlUploader from "@/components/ImageUrlUploader";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function addCategory(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  await supabase.from("categories").insert({
    name,
    slug: slugify(name),
    parent_id: String(formData.get("parent_id") ?? "") || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0),
  });
  revalidatePath("/categories");
}

async function updateCategory(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  await supabase
    .from("categories")
    .update({
      name,
      slug: slugify(name),
      parent_id: String(formData.get("parent_id") ?? "") || null,
      image_url: String(formData.get("image_url") ?? "").trim() || null,
      sort_order: Number(formData.get("sort_order") ?? 0),
    })
    .eq("id", id);
  revalidatePath("/categories");
}

async function deleteCategory(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("categories").delete().eq("id", id);
  revalidatePath("/categories");
}

function CategoryEditForm({
  category,
  parentOptions,
  isChild,
}: {
  category: { id: string; name: string; parent_id: string | null; image_url: string | null; sort_order: number };
  parentOptions: { id: string; name: string }[];
  isChild?: boolean;
}) {
  return (
    <div className={isChild ? "border-t border-[#D8D3C9]/60 p-4" : "p-4"}>
      <form action={updateCategory} className="space-y-3">
        <input type="hidden" name="id" value={category.id} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Nom</label>
            <input
              name="name"
              defaultValue={category.name}
              required
              className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Parent</label>
            <select
              name="parent_id"
              defaultValue={category.parent_id ?? ""}
              className="mt-1 w-full rounded-md border border-[#D8D3C9] bg-white px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            >
              <option value="">Catégorie principale</option>
              {parentOptions
                .filter((p) => p.id !== category.id)
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    Sous-catégorie de {p.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <ImageUrlUploader name="image_url" defaultValue={category.image_url} bucket="hero" />

        <div className="flex items-center justify-between pt-1">
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Ordre</label>
            <input
              name="sort_order"
              type="number"
              defaultValue={category.sort_order}
              className="mt-1 w-20 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
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
          action={deleteCategory}
          hiddenFields={{ id: category.id }}
          confirmMessage={`Supprimer "${category.name}" ? Les produits associés perdront leur catégorie.`}
          label="Supprimer"
          className="text-xs text-[#DC143C] hover:underline"
        />
      </div>
    </div>
  );
}

export default async function CategoriesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, image_url, sort_order")
    .order("sort_order");

  const all = categories ?? [];
  const topLevel = all.filter((c) => !c.parent_id);

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Catégories</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Les 4 images ici sont celles affichées sur la page d'accueil (Homme / Femme / Enfant / Bébé).
        Les sous-catégories (Fille / Garçon) n'apparaissent pas sur l'accueil, seulement sur leur page dédiée.
      </p>

      <div className="mt-8 space-y-6">
        {topLevel.map((parent) => {
          const children = all.filter((c) => c.parent_id === parent.id);
          return (
            <div key={parent.id} className="overflow-hidden rounded-md border border-[#D8D3C9]">
              <CategoryEditForm category={parent} parentOptions={topLevel} />
              {children.map((child) => (
                <CategoryEditForm key={child.id} category={child} parentOptions={topLevel} isChild />
              ))}
            </div>
          );
        })}
        {topLevel.length === 0 && (
          <p className="text-sm text-[#8C8579]">Aucune catégorie pour le moment.</p>
        )}
      </div>

      <div className="mt-10 max-w-lg rounded-md border border-[#D8D3C9] p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">Nouvelle catégorie</h2>
        <form action={addCategory} className="mt-4 space-y-3">
          <input
            name="name"
            placeholder="Nom"
            required
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <select
            name="parent_id"
            className="w-full rounded-md border border-[#D8D3C9] bg-white px-3 py-2 text-sm outline-none focus:border-[#006400]"
          >
            <option value="">Catégorie principale (pas de parent)</option>
            {topLevel.map((c) => (
              <option key={c.id} value={c.id}>
                Sous-catégorie de {c.name}
              </option>
            ))}
          </select>
          <ImageUrlUploader name="image_url" bucket="hero" />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            placeholder="Ordre d'affichage"
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
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
