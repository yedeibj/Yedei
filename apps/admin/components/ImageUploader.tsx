"use client";

import { useRef, useState } from "react";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

export default function ImageUrlUploader({
  name,
  defaultValue,
  bucket = "hero",
}: {
  name: string;
  defaultValue?: string | null;
  bucket?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setIsUploading(true);
    const supabase = createBrowserSupabaseClient();
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true });

    if (uploadError) {
      setError("Erreur lors de l'upload.");
      setIsUploading(false);
      return;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    setValue(data.publicUrl);
    setIsUploading(false);
  }

  return (
    <div>
      <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Image</label>
      <div className="mt-1 flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-14 w-20 rounded-md border border-[#D8D3C9] object-cover" />
        ) : (
          <div className="flex h-14 w-20 items-center justify-center rounded-md bg-[#F6F3EC] text-[9px] text-[#8C8579]">
            Aucune
          </div>
        )}
        <div className="flex-1">
          <input type="hidden" name={name} value={value} />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-md border border-[#D8D3C9] px-3 py-1.5 text-xs uppercase tracking-wide text-[#181715] hover:border-[#006400]"
          >
            {isUploading ? "Envoi..." : value ? "Changer l'image" : "Choisir une image"}
          </button>
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
          {error && <p className="mt-1 text-xs text-[#DC143C]">{error}</p>}
        </div>
      </div>
    </div>
  );
}
