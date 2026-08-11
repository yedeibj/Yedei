"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";
import VariantsEditor, { type VariantRow } from "./VariantsEditor";
import ImageUploader, { type ImageEntry } from "./ImageUploader";

type Category = { id: string; name: string };

type ExistingProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  compare_at_price: number | null;
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
  initialVariants = [],
  initialImages = [],
}: {
  categories: Category[];
  product?: ExistingProduct;
  initialVariants?: VariantRow[];
  initialImages?: ImageEntry[];
}) {
  const router = useRouter();
  const isEditing = Boolean(product);

  // Génère l'ID tout de suite pour permettre l'upload d'images avant même
  // que le produit soit enregistré (nécessaire pour le chemin de stockage).
  const [productId] = useState(() => product?.id ?? crypto.randomUUID());

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    product?.compare_at_price ? String(product.compare_at_price) : ""
  );
  const [categoryId, setCategoryId] = useState(product?.category_id ?? categories[0]?.id ?? "");
  const [isNew, setIsNew] = useState(product?.is_new ?? true);
  const [isBestSeller, setIsBestSeller] = useState(product?.is_best_seller ?? false);
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [variants, setVariants] = useState<VariantRow[]>(initialVariants);
  const [images, setImages] = useState<ImageEntry[]>(initialImages);
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

    const payload = {
      id: productId,
      name,
      slug,
      description,
      price: Number(price),
      compare_at_price: compareAtPrice ? Number(compareAtPrice) : null,
      category_id: categoryId || null,
      is_new: isNew,
      is_best_seller: isBestSeller,
      is_active: isActive,
    };

    const { error: upsertError } = await supabase.from("products").upsert(payload);

    if (upsertError) {
      setIsSaving(false);
      setError(
        upsertError.message.includes("duplicate")
          ? "Un produit avec ce nom existe déjà."
          : "Erreur lors de l'enregistrement du produit."
      );
      return;
    }

    // Variantes : on remplace tout (plus simple et fiable qu'un diff ligne à ligne)
    await supabase.from("product_variants").delete().eq("product_id", productId);
    if (variants.length > 0) {
      await supabase.from("product_variants").insert(
        variants
          .filter((v) => v.size.trim())
          .map((v) => ({
            product_id: productId,
            size: v.size.trim(),
            sku: v.sku.trim() || null,
            price: v.price ? Number(v.price) : null,
            stock: v.stock ? Number(v.stock) : 0,
          }))
      );
    }

    // Images : idem, on réécrit la liste dans l'ordre actuel
    await supabase.from("product_images").delete().eq("product_id", productId);
    if (images.length > 0) {
      await supabase.from("product_images").insert(
        images.map((img, i) => ({
          product_id: productId,
          url: img.url,
          sort_order: i,
        }))
      );
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
    <form onSubmit={handleSubmit} className="mt-6 max-w-2xl space-y-8">
      <div className="space-y-5">
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
              Prix de base (FCFA)
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
              Prix barré (promo, optionnel)
            </label>
            <input
              type="number"
              step="0.01"
              value={compareAtPrice}
              onChange={(e) => setCompareAtPrice(e.target.value)}
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
      </div>

      <VariantsEditor variants={variants} onChange={setVariants} />

      <ImageUploader productId={productId} images={images} onChange={setImages} />

      {error && <p className="text-sm text-[#DC143C]">{error}</p>}

      <div className="flex items-center gap-4 border-t border-[#D8D3C9] pt-6">
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
