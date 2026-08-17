"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";
import HeroImageUploader from "./HeroImageUploader";

type HeroSlide = {
  id: string;
  eyebrow: string | null;
  title: string;
  description: string | null;
  cta_label: string | null;
  cta_href: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: boolean;
};

export default function HeroSlideEditor({ slide }: { slide?: HeroSlide }) {
  const router = useRouter();
  const isEditing = Boolean(slide);

  const [eyebrow, setEyebrow] = useState(slide?.eyebrow ?? "");
  const [title, setTitle] = useState(slide?.title ?? "");
  const [description, setDescription] = useState(slide?.description ?? "");
  const [ctaLabel, setCtaLabel] = useState(slide?.cta_label ?? "");
  const [ctaHref, setCtaHref] = useState(slide?.cta_href ?? "");
  const [imageUrl, setImageUrl] = useState<string | null>(slide?.image_url ?? null);
  const [sortOrder, setSortOrder] = useState(slide ? String(slide.sort_order) : "0");
  const [isActive, setIsActive] = useState(slide?.is_active ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleSave() {
    if (!title.trim()) {
      setError("Le titre est obligatoire.");
      return;
    }
    setError(null);
    setIsSaving(true);

    const supabase = createBrowserSupabaseClient();
    const payload = {
      ...(slide ? { id: slide.id } : {}),
      eyebrow: eyebrow.trim() || null,
      title: title.trim(),
      description: description.trim() || null,
      cta_label: ctaLabel.trim() || null,
      cta_href: ctaHref.trim() || null,
      image_url: imageUrl,
      sort_order: Number(sortOrder) || 0,
      is_active: isActive,
    };

    const { error: upsertError } = await supabase.from("hero_slides").upsert(payload);
    setIsSaving(false);

    if (upsertError) {
      setError("Erreur lors de l'enregistrement.");
      return;
    }

    if (!isEditing) {
      setEyebrow("");
      setTitle("");
      setDescription("");
      setCtaLabel("");
      setCtaHref("");
      setImageUrl(null);
      setSortOrder("0");
      setIsActive(true);
    }
    router.refresh();
  }

  async function handleDelete() {
    if (!slide?.id) return;
    const confirmed = window.confirm(`Supprimer le slide "${slide.title}" ?`);
    if (!confirmed) return;

    setIsDeleting(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.from("hero_slides").delete().eq("id", slide.id);
    setIsDeleting(false);
    router.refresh();
  }

  return (
    <div className={isEditing ? "rounded-md border border-[#D8D3C9] p-4" : "max-w-lg rounded-md border border-[#D8D3C9] p-5"}>
      {!isEditing && (
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wide text-[#181715]">
          Nouveau slide
        </h2>
      )}
      <div className="space-y-3">
        <HeroImageUploader value={imageUrl} onChange={setImageUrl} />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
              Eyebrow (petit texte au-dessus du titre)
            </label>
            <input
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="Collection Bébé"
              className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Titre</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Texte bouton</label>
            <input
              value={ctaLabel}
              onChange={(e) => setCtaLabel(e.target.value)}
              placeholder="Découvrir la collection"
              className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Lien bouton</label>
            <input
              value={ctaHref}
              onChange={(e) => setCtaHref(e.target.value)}
              placeholder="/collections/bebe"
              className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Actif (visible sur le site)
          </label>
          <div className="flex items-center gap-3">
            <div>
              <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Ordre</label>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-20 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
              />
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="rounded-md bg-[#006400] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90 disabled:opacity-50"
            >
              {isSaving ? "Enregistrement..." : isEditing ? "Enregistrer" : "Créer"}
            </button>
          </div>
        </div>

        {error && <p className="text-xs text-[#DC143C]">{error}</p>}

        {isEditing && (
          <div className="flex justify-end border-t border-[#D8D3C9] pt-3">
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-xs text-[#DC143C] hover:underline disabled:opacity-50"
            >
              {isDeleting ? "Suppression..." : "Supprimer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
