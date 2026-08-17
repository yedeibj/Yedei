"use client";

import { useRef, useState } from "react";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

export default function HeroImageUploader({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    const supabase = createBrowserSupabaseClient();
    const ext = file.name.split(".").pop();
    const path = `slide-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("hero")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Erreur lors de l'upload de l'image.");
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from("hero").getPublicUrl(path);
    onChange(data.publicUrl);
    setIsUploading(false);
  }

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Image</label>
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
        className="mt-1 flex cursor-pointer items-center gap-4 rounded-md border border-dashed border-[#D8D3C9] p-3 hover:border-[#006400]"
      >
        {value ? (
          <img src={value} alt="" className="h-20 w-16 rounded-md object-cover" />
        ) : (
          <div className="flex h-20 w-16 items-center justify-center rounded-md bg-[#F6F3EC] text-[10px] text-[#8C8579]">
            Aucune
          </div>
        )}
        <div className="text-xs text-[#8C8579]">
          {isUploading ? "Envoi en cours..." : "Cliquer ou glisser une image ici"}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
      </div>
      {error && <p className="mt-1 text-xs text-[#DC143C]">{error}</p>}
    </div>
  );
}
