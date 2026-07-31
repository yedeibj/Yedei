"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

type Category = { id: string; name: string };

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ProductForm({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [isNew, setIsNew] = useState(true);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

    const { data: product, error: insertError } = await supabase
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

    if (insertError || !product) {
      setIsSaving(false);
      setError(
        insertError?.message.includes("duplicate")
          ? "Un produit avec ce nom existe déjà."
          : "Erreur lors de la création du produit."
      );
      return;
    }

    if (imageFile) {
      const filePath = `${product.id}/${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(filePath, imageFile);

      if (!uploadError) {
        const { data: publicUrl } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);

        await supabase.from("product_images").insert({
          product_id: product.id,
          url: publicUrl.publicUrl,
          sort_order: 0,
        });
      }
    }

    setIsSaving(false);
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
          value={description}
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
          Image principale
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full text-sm"
        />
      </div>

      <div className="flex gap-6">
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
      </div>

      {error && <p className="text-sm text-[#DC143C]">{error}</p>}

      <button
        type="submit"
        disabled={isSaving}
        className="rounded-md bg-[#006400] px-5 py-2 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? "Enregistrement..." : "Créer le produit"}
      </button>
    </form>
  );
}
