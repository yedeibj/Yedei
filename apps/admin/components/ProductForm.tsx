"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

type Category = { id: string; name: string };

type ExistingProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string | null;
  is_new: boolean;
  is_best_seller: boolean;
  is_active: boolean;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ExistingProduct;
}) {
  const router = useRouter();
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [isNew, setIsNew] = useState(product?.is_new ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name || !price) {
      setError("Le nom et le prix sont obligatoires.");
      return;
    }

    setIsSaving(true);
    const supabase = createBrowserSupabaseClient();
    const slug = slugify(name);

    let productId = product?.id;

    if (isEditing && productId) {
      const { error: updateError } = await supabase
        .from("products")
        .update({
          name,
          slug,
          description,
          price: Number(price),
          category_id: categoryId || null,
          is_new: isNew,
          is_best_seller: isBestSeller,
          is_active: isActive,
        })
        .eq("id", productId);

      if (updateError) {
        setIsSaving(false);
        setError("Erreur lors de la mise à jour du produit.");
        return;
      }
    } else {
      const { data: created, error: insertError } = await supabase
        .from("products")
        .insert({
          name,
          slug,
          description,
          price: Number(price),
          category_id: categoryId || null,
          is_new: isNew,
          is_best_seller: isBestSeller,
        })
        .select()
        .single();

      if (insertError || !created) {
        setIsSaving(false);
        setError(
          insertError?.message.includes("duplicate")
            ? "Un produit avec ce nom existe déjà."
            : "Erreur lors de la création du produit."
        );
        return;
      }
      productId = created.id;
    }

    if (imageFile && productId) {
      const filePath = `${productId}/${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, imageFile, { upsert: true });

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(filePath);
        await supabase.from("product_images").insert({
          product_id: productId,
          url: publicUrl.publicUrl,
          sort_order: 0,
        });
      }
    }

    setIsSaving(false);
    router.push("/produits");
    router.refresh();
  }

  async function handleDelete() {
    if (!product?.id) return;
    const confirmed = window.confirm(
      `Supprimer définitivement "${product.name}" ? Cette action est irréversible.`
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.from("products").delete().eq("id", product.id);
    setIsDeleting(false);
    router.push("/produits");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-5">
      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
          Nom du produit
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
        />
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
          Description
        </label>
        <textarea
          rows={4}
          value={description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
            Prix (FCFA)
          </label>
          <input
            type="number"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
        </div>

        <div className="flex-1">
          <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
            Catégorie
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#D8D3C9] bg-white px-3 py-2 text-sm outline-none focus:border-[#006400]"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
          {isEditing ? "Remplacer l'image principale" : "Image principale"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full text-sm"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
          Nouveauté
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={isBestSeller}
            onChange={(e) => setIsBestSeller(e.target.checked)}
          />
          Meilleure vente
        </label>
        {isEditing && (
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            />
            Actif (visible sur le site)
          </label>
        )}
      </div>

      {error && <p className="text-sm text-[#DC143C]">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-[#006400] px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {isSaving ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Créer le produit"}
        </button>

        {isEditing && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-sm text-[#DC143C] hover:underline disabled:opacity-50"
          >
            {isDeleting ? "Suppression..." : "Supprimer ce produit"}
          </button>
        )}
      </div>
    </form>
  );
}
