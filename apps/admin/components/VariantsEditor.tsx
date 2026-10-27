"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";
import { COLOR_PRESETS, type ColorPreset } from "./colorPresets";

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

const DEFAULT_HEX = "#8C8579";

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['’]/g, " ")
    .trim();
}

function filterColors(query: string): ColorPreset[] {
  const q = normalize(query);
  if (!q) return COLOR_PRESETS;

  const startsWith: ColorPreset[] = [];
  const wordMatch: ColorPreset[] = [];

  for (const preset of COLOR_PRESETS) {
    const name = normalize(preset.name);
    if (name.startsWith(q)) {
      startsWith.push(preset);
    } else if (name.split(" ").some((word) => word.startsWith(q))) {
      wordMatch.push(preset);
    }
  }

  return [...startsWith, ...wordMatch];
}

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
        <img src={value} alt="" onClick={() => inputRef.current?.click()} className="h-9 w-9 cursor-pointer rounded border border-[#D8D3C9] object-cover" />
      ) : (
        <button type="button" onClick={() => inputRef.current?.click()} className="flex h-9 w-9 items-center justify-center rounded border border-dashed border-[#D8D3C9] text-[9px] text-[#8C8579] hover:border-[#006400]">
          {isUploading ? "..." : "+"}
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
      }} />
    </div>
  );
}

function ColorSelectCell({
  color,
  colorHex,
  onSelectPreset,
  onChangeCustomName,
  onChangeCustomHex,
}: {
  color: string;
  colorHex: string;
  onSelectPreset: (name: string, hex: string) => void;
  onChangeCustomName: (name: string) => void;
  onChangeCustomHex: (hex: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  const matchedPreset = COLOR_PRESETS.find((p) => normalize(p.name) === normalize(color));
  const isCustom = color !== "" && !matchedPreset;
  const results = useMemo(() => filterColors(query), [query]);

  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => searchRef.current?.focus(), 50);
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function openPicker() {
    setQuery("");
    setIsOpen(true);
  }

  function choosePreset(preset: ColorPreset) {
    onSelectPreset(preset.name, preset.hex);
    setIsOpen(false);
  }

  function chooseNone() {
    onSelectPreset("", DEFAULT_HEX);
    setIsOpen(false);
  }

  function chooseCustom() {
    onSelectPreset(isCustom ? color : "Personnalisée", colorHex || DEFAULT_HEX);
    setIsOpen(false);
  }

  return (
    <div className="flex items-center gap-2">
      <button type="button" onClick={openPicker} className="flex w-36 items-center gap-2 rounded border border-[#D8D3C9] px-2 py-1 text-left text-xs hover:border-[#006400]">
        {color ? (
          <span className="h-4 w-4 flex-shrink-0 rounded-full border border-[#D8D3C9]" style={{ backgroundColor: colorHex || DEFAULT_HEX }} />
        ) : null}
        <span className="truncate">{color || "Aucune"}</span>
        <span className="ml-auto text-[#8C8579]">▾</span>
      </button>

      {isCustom && (
        <>
          <input type="text" value={color} onChange={(e) => onChangeCustomName(e.target.value)} placeholder="Nom" className="w-20 rounded border border-[#D8D3C9] px-2 py-1 text-xs" />
          <input type="color" value={colorHex || DEFAULT_HEX} onChange={(e) => onChangeCustomHex(e.target.value)} className="h-7 w-8 cursor-pointer rounded border border-[#D8D3C9]" title="Choisir la teinte exacte" />
        </>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-black/40 p-4 pt-[8vh]" onClick={() => setIsOpen(false)}>
          <div role="dialog" aria-modal="true" aria-label="Choisir une couleur" onClick={(e) => e.stopPropagation()} className="flex max-h-[80vh] w-full max-w-md flex-col rounded-xl bg-white p-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-[#181715]">Choisir une couleur</p>
              <button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer" className="text-xl leading-none text-[#8C8579] hover:text-[#181715]">
                ×
              </button>
            </div>

            <input ref={searchRef} type="text" value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                if (results[0]) choosePreset(results[0]);
              }
            }} placeholder="Rechercher (ex : rouge, bleu, beige...)" className="mt-3 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />

            <p className="mt-2 text-[10px] text-[#8C8579]">{results.length} couleur(s)</p>

            <div className="mt-2 grid flex-1 grid-cols-2 gap-1 overflow-y-auto">
              {results.map((preset) => (
                <button key={preset.name} type="button" onClick={() => choosePreset(preset)} className="flex items-center gap-2 rounded px-2 py-1.5 text-left text-xs hover:bg-[#F6F3EC]">
                  <span className="h-5 w-5 flex-shrink-0 rounded-full border border-[#D8D3C9]" style={{ backgroundColor: preset.hex }} />
                  <span className="truncate">{preset.name}</span>
                </button>
              ))}
              {results.length === 0 && (
                <p className="col-span-2 px-2 py-4 text-center text-xs text-[#8C8579]">
                  Aucune couleur trouvée. Utilise "Autre couleur" ci-dessous.
                </p>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-[#F0EDE5] pt-3 text-xs">
              <button type="button" onClick={chooseNone} className="text-[#8C8579] hover:text-[#181715]">
                Aucune couleur
              </button>
              <button type="button" onClick={chooseCustom} className="text-[#006400] hover:underline">
                Autre couleur...
              </button>
            </div>
          </div>
        </div>
      )}
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
      { key: crypto.randomUUID(), size: "", sku: "", price: "", stock: "0", imageUrl: undefined, color: "", colorHex: DEFAULT_HEX },
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
      colorHex: DEFAULT_HEX,
    }));
    onChange([...variants, ...newRows]);
    setBulkSizes("");
  }

  function updateRow(key: string, field: keyof VariantRow, value: string) {
    onChange(variants.map((v) => (v.key === key ? { ...v, [field]: value } : v)));
  }

  function updateColor(key: string, color: string, colorHex: string) {
    onChange(variants.map((v) => (v.key === key ? { ...v, color, colorHex } : v)));
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
        <input type="text" value={bulkSizes} onChange={(e) => setBulkSizes(e.target.value)} placeholder="Ex: 36,37,38,39,40,41,42,43,44,45,46,47,48,49" className="flex-1 rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]" />
        <button type="button" onClick={generateFromBulk} className="rounded-md border border-[#006400] px-3 py-2 text-xs uppercase tracking-wide text-[#006400] hover:bg-[#E8F5E9]">
          Générer les lignes
        </button>
      </div>
      <p className="mt-1 text-xs text-[#8C8579]">
        Pour un produit à plusieurs couleurs, choisis la même couleur sur toutes les lignes
        concernées, et ajoute une photo par couleur. La réduction en pourcentage se règle plus
        haut, au niveau du produit — elle s'applique automatiquement à toutes les variantes.
      </p>

      {variants.length > 0 && (
        <div className="mt-3 overflow-x-auto rounded-md border border-[#D8D3C9]">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#D8D3C9] bg-[#F6F3EC] uppercase tracking-wide text-[#8C8579]">
              <tr>
                <th className="px-3 py-2">Photo</th>
                <th className="px-3 py-2">Couleur</th>
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
                    <VariantImageCell value={v.imageUrl} onChange={(url) => updateRow(v.key, "imageUrl", url)} />
                  </td>
                  <td className="px-3 py-2">
                    <ColorSelectCell
                      color={v.color ?? ""}
                      colorHex={v.colorHex ?? DEFAULT_HEX}
                      onSelectPreset={(name, hex) => updateColor(v.key, name, hex)}
                      onChangeCustomName={(name) => updateRow(v.key, "color", name)}
                      onChangeCustomHex={(hex) => updateRow(v.key, "colorHex", hex)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" value={v.size} onChange={(e) => updateRow(v.key, "size", e.target.value)} className="w-16 rounded border border-[#D8D3C9] px-2 py-1" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="text" value={v.sku} onChange={(e) => updateRow(v.key, "sku", e.target.value)} placeholder="Ex: 6-7 ans" className="w-28 rounded border border-[#D8D3C9] px-2 py-1" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" step="0.01" value={v.price} onChange={(e) => updateRow(v.key, "price", e.target.value)} placeholder="Prix de base" className="w-24 rounded border border-[#D8D3C9] px-2 py-1" />
                  </td>
                  <td className="px-3 py-2">
                    <input type="number" value={v.stock} onChange={(e) => updateRow(v.key, "stock", e.target.value)} className="w-16 rounded border border-[#D8D3C9] px-2 py-1" />
                  </td>
                  <td className="px-3 py-2">
                    <button type="button" onClick={() => removeRow(v.key)} className="text-[#DC143C] hover:underline">
                      Retirer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" onClick={addRow} className="mt-2 text-xs uppercase tracking-wide text-[#8C8579] hover:text-[#181715]">
        + Ajouter une ligne manuellement
      </button>
    </div>
  );
}
