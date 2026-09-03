"use client";

import { useRef, useState } from "react";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

export type VariantRow = {
  key: string;
  size: string;
  sku: string;
  price: string;
  stock: string;
  imageUrl?: string;
  color?: string;
  colorHex?: string;
};

function VariantImageCell({
  value,
  onChange,
}: {
  value: string | undefined;
  onChange: (url: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setIsUploading(true);
    const supabase = createBrowserSupabaseClient();
    const path = `variants/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    const { error } = await supabase.storage.from("products").upload(path, file);
    if (!error) {
      const { data } = supabase.storage.from("products").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setIsUploading(false);
  }

  return (
    <div className="flex items-center gap-1">
      {value ? (
        <img
          src={value}
          alt=""
          onClick={() => inputRef.current?.click()}
          className="h-9 w-9 cursor-pointer rounded border border-[#D8D3C9] object-cover"
        />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-9 w-9 items-center justify-center rounded border border-dashed border-[#D8D3C9] text-[9px] text-[#8C8579] hover:border-[#006400]"
        >
          {isUploading ? "..." : "+"}
        </button>
      )}
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
  );
}

export default function VariantsEditor({
  variants,
  onChange,
}: {
  variants: VariantRow[];
  onChange: (variants: VariantRow[]) => void;
}) {
  const [bulkSizes, setBulkSizes] = useState("");

  function addRow() {
    onChange([
      ...variants,
      { key: crypto.randomUUID(), size: "", sku: "", price: "", stock: "0", imageUrl: undefined, color: "", colorHex: "#8C8579" },
    ]);
  }

  function generateFromBulk() {
    const sizes = bulkSizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (sizes.length === 0) return;

    const newRows: VariantRow[] = sizes.map((size) => ({
      key: crypto.randomUUID(),
      size,
      sku: "",
      price: "",
      stock: "0",
      imageUrl: undefined,
      color: "",
      colorHex: "#8C8579",
    }));
    onChange([...variants, ...newRows]);
    setBulkSizes("");
  }

  function updateRow(key: string, field: keyof VariantRow, value: string) {
    onChange(variants.map((v) => (v.key === key ? { ...v, [field]: value } : v)));
  }

  function removeRow(key: string) {
    onChange(variants.filter((v) => v.key !== key));
  }

  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-wide text-[#181715]">
        Tailles / Variantes
      </label>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={bulkSizes}
          onChange={(e) => setBulkSizes(e.target.value)}
          placeholder="Ex: 36,37,38,39,40,41,42,43,44,45,46,47,48,49"
          className="flex-1 rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
        />
        <button
          type="button"
          onClick={generateFromBulk}
          className="rounded-md border border-[#006400] px-3 py-2 text-xs uppercase tracking-wide text-[#006400] hover:bg-[#E8F5E9]"
        >
          Générer les lignes
        </button>
      </div>
      <p className="mt-1 text-xs text-[#8C8579]">
        Pour un produit avec plusieurs couleurs, crée une ligne par couleur (et par taille si besoin),
        renseigne le champ Couleur avec le même nom sur les lignes de la même couleur (ex: "Rouge"),
        et ajoute une photo par couleur. Laisse Couleur vide si le produit n'a qu'une seule couleur.
      </p>

      {variants.length > 0 && (
        <div className="mt-3 overflow-x-auto rounded-md border border-[#D8D3C9]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#D8D3C9] bg-[#F6F3EC] uppercase tracking-wide text-[#8C8579]">
              <tr>
                <th className="px-3 py-2">Photo</th>
                <th className="px-3 py-2">Couleur</th>
                <th className="px-3 py-2">Pastille</th>
                <th className="px-3 py-2">Taille</th>
                <th className="px-3 py-2">Âge / Code</th>
                <th className="px-3 py-2">Prix (si différent)</th>
                <th className="px-3 py-2">Stock</th>
                <th className="px-3 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.key} className="border-b border-[#F0EDE5] last:border-0">
                  <td className="px-3 py-2">
                    <VariantImageCell
                      value={v.imageUrl}
                      onChange={(url) => updateRow(v.key, "imageUrl", url)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.color ?? ""}
                      onChange={(e) => updateRow(v.key, "color", e.target.value)}
                      placeholder="Ex: Rouge"
                      className="w-24 rounded border border-[#D8D3C9] px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="color"
                      value={v.colorHex || "#8C8579"}
                      onChange={(e) => updateRow(v.key, "colorHex", e.target.value)}
                      className="h-7 w-9 cursor-pointer rounded border border-[#D8D3C9]"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.size}
                      onChange={(e) => updateRow(v.key, "size", e.target.value)}
                      className="w-16 rounded border border-[#D8D3C9] px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={v.sku}
                      onChange={(e) => updateRow(v.key, "sku", e.target.value)}
                      placeholder="Ex: 6-7 ans"
                      className="w-28 rounded border border-[#D8D3C9] px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      step="0.01"
                      value={v.price}
                      onChange={(e) => updateRow(v.key, "price", e.target.value)}
                      placeholder="Prix de base"
                      className="w-24 rounded border border-[#D8D3C9] px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={v.stock}
                      onChange={(e) => updateRow(v.key, "stock", e.target.value)}
                      className="w-16 rounded border border-[#D8D3C9] px-2 py-1"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button
                      type="button"
                      onClick={() => removeRow(v.key)}
                      className="text-[#DC143C] hover:underline"
                    >
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        type="button"
        onClick={addRow}
        className="mt-2 text-xs uppercase tracking-wide text-[#8C8579] hover:text-[#181715]"
      >
        + Ajouter une ligne manuellement
      </button>
    </div>
  );
}
