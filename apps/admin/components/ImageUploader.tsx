"use client";

import { useState } from "react";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

export type ImageEntry = { path: string; url: string };

export default function ImageUploader({
  productId,
  images,
  onChange,
}: { 
  productId: string;
  images: ImageEntry[];
  onChange: (images: ImageEntry[]) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFiles(files: FileList | File[]) {
    setError(null);
    setIsUploading(true);
    const supabase = createBrowserSupabaseClient();
    const uploaded: ImageEntry[] = [];

    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;

      const path = `${productId}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(path, file);

      if (uploadError) {
        setError(`Échec de l'upload de "${file.name}".`);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from("products").getPublicUrl(path);
      uploaded.push({ path, url: publicUrl.publicUrl });
    }

    onChange([...images, ...uploaded]);
    setIsUploading(false);
  }

  async function removeImage(path: string) {
    const supabase = createBrowserSupabaseClient();
    await supabase.storage.from("products").remove([path]);
    onChange(images.filter((img) => img.path !== path));
  }

  function moveImage(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
        Images du produit
      </label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) uploadFiles(e.dataTransfer.files);
        }}
        className={`mt-2 flex flex-col items-center justify-center rounded-md border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragging ? "border-[#006400] bg-[#E8F5E9]" : "border-[#D8D3C9]"
        }`}
      >
        <p className="text-sm text-[#8C8579]">
          Glisse-dépose tes images ici, ou
        </p>
        <label className="mt-2 cursor-pointer text-sm font-medium text-[#006400] hover:underline">
          parcourir tes fichiers
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && uploadFiles(e.target.files)}
          />
        </label>
        {isUploading && (
          <p className="mt-2 text-xs text-[#8C8579]">Envoi en cours...</p>
        )}
      </div>

      {error && <p className="mt-2 text-sm text-[#DC143C]">{error}</p>}

      {images.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {images.map((img, i) => (
            <div key={img.path} className="group relative aspect-square overflow-hidden rounded-md bg-[#F0EDE5]">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-white/90 px-1.5 py-0.5 text-[10px] text-[#181715]">
                  Principale
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => moveImage(i, -1)}
                  className="rounded bg-white/90 px-1.5 py-1 text-xs"
                  disabled={i === 0}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => removeImage(img.path)}
                  className="rounded bg-white/90 px-1.5 py-1 text-xs text-[#DC143C]"
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => moveImage(i, 1)}
                  className="rounded bg-white/90 px-1.5 py-1 text-xs"
                  disabled={i === images.length - 1}
                >
                  →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
