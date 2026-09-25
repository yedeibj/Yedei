"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";
import VariantsEditor, { type VariantRow } from "./VariantsEditor";
import ImageUploader, { type ImageEntry } from "./ImageUploader";

type Category = { id: string; name: string; parent_id: string | null };

type ExistingProduct = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  discount_percent: number | null;
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

function buildCategoryGroups(categories: Category[]) {
  const topLevel = categories.filter((c) => !c.parent_id);
  return topLevel.map((parent) => ({
    parent,
    children: categories.filter((c) => c.parent_id === parent.id),
  }));
}

function computeCompareAtPrice(price: number, discountPercent: number): number | null {
  if (!price || !discountPercent || discountPercent <= 0 || discountPercent >= 100) return null;
  return Math.round(price / (1 - discountPercent / 100) / 100) * 100;
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

  const [productId] = useState(() => product?.id ?? crypto.randomUUID());

  const [name, setName] = useState(product?.name ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product ? String(product.price) : "");
  const [discountPercent, setDiscountPercent] = useState(
    product?.discount_percent ? String(product.discount_percent) : ""
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
  const [savedSlug, setSavedSlug] = useState<string | null>(null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const productUrl = savedSlug ? siteUrl + "/produits/" + savedSlug : "";
  const categoryGroups = buildCategoryGroups(categories);

  const previewCompareAtPrice = computeCompareAtPrice(Number(price) || 0, Number(discountPercent) || 0);

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
      discount_percent: discountPercent ? Number(discountPercent) : null,
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
            image_url: v.imageUrl || null,
            color: v.color?.trim() || null,
            color_hex: v.colorHex || null,
          }))
      );
    }

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
    setSavedSlug(slug);
    router.refresh();
    if (isEditing) {
      window.location.reload();
    }
  }

  async function handleDelete() {
    if (!product?.id) return;
    const confirmed = window.confirm(
      "Supprimer definitivement ce produit ? Cette action est irreversible."
    );
    if (!confirmed) return;

    setIsDeleting(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.from("products").delete().eq("id", product.id);
    setIsDeleting(false);
    router.push("/produits");
    router.refresh();
  }

  function copyLink() {
    if (productUrl) {
      navigator.clipboard.writeText(productUrl);
    }
  }

  return (
    <div className="mt-6 max-w-2xl">
      {savedSlug ? (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-md bg-[#E8F5E9] px-4 py-3 text-sm">
          <div>
            <p className="font-medium text-[#006400]">Produit enregistre avec succes.</p>
            <a href={productUrl} target="_blank" rel="noopener noreferrer" className="text-[#00008B] underline">{productUrl}</a>
          </div>
          <button type="button" onClick={copyLink} className="rounded-md border border-[#006400] px-3 py-1.5 text-xs uppercase tracking-wide text-[#006400] hover:bg-white">Copier le lien</button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-8">
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
                Réduction (%, optionnel)
              </label>
              <input
                type="number"
                step="1"
                min="0"
                max="99"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(e.target.value)}
                placeholder="Ex: 10"
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
              {previewCompareAtPrice && (
                <p className="mt-1 text-[10px] text-[#8C8579]">
                  Prix barré affiché : {previewCompareAtPrice.toLocaleString("fr-FR")} FCFA
                </p>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
                Categorie
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#D8D3C9] bg-white px-3 py-2 text-sm outline-none focus:border-[#006400]"
              >
                {categoryGroups.map(({ parent, children }) =>
                  children.length > 0 ? (
                    <optgroup key={parent.id} label={parent.name}>
                      <option value={parent.id}>{parent.name} (général)</option>
                      {children.map((child) => (
                        <option key={child.id} value={child.id}>
                          {child.name}
                        </option>
                      ))}
                    </optgroup>
                  ) : (
                    <option key={parent.id} value={parent.id}>
                      {parent.name}
                    </option>
                  )
                )}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={isNew} onChange={(e) => setIsNew(e.target.checked)} />
              Nouveaute
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
            {isSaving ? "Enregistrement..." : isEditing ? "Enregistrer les modifications" : "Creer le produit"}
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
    </div>
  );
}
