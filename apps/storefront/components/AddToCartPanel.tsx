"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";

type Variant = {
  id: string;
  size: string;
  sku: string | null;
  stock: number;
  price: number | null;
  imageUrl?: string | null;
  color?: string | null;
  colorHex?: string | null;
};

function formatFcfa(value: number) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

export default function AddToCartPanel({
  productId,
  slug,
  name,
  basePrice,
  compareAtPrice,
  imageUrl,
  variants,
  onVariantChange,
}: {
  productId: string;
  slug: string;
  name: string;
  basePrice: number;
  compareAtPrice?: number | null;
  imageUrl?: string;
  variants: Variant[];
  onVariantChange?: (imageUrl: string | null) => void;
}) {
  const { addItem, openCart } = useCart();

  const colors = useMemo(() => {
    const seen = new Map<string, string | null>();
    for (const v of variants) {
      if (v.color && !seen.has(v.color)) seen.set(v.color, v.colorHex ?? null);
    }
    return Array.from(seen.entries()).map(([name, hex]) => ({ name, hex }));
  }, [variants]);

  const hasColors = colors.length > 0;

  const [selectedColor, setSelectedColor] = useState<string | null>(
    hasColors ? colors[0].name : null
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 0 ? "unique" : null
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const visibleVariants = hasColors
    ? variants.filter((v) => v.color === selectedColor)
    : variants;

  function effectivePrice(variant: Variant) {
    return variant.price ?? basePrice;
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  const priceRange = useMemo(() => {
    const pool = hasColors ? visibleVariants : variants;
    if (pool.length === 0) return { min: basePrice, max: basePrice };
    const prices = pool.map(effectivePrice);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [variants, visibleVariants, hasColors, basePrice]);

  const displayedPrice = selectedVariant ? effectivePrice(selectedVariant) : null;

  function handleSelectColor(colorName: string, hex: string | null) {
    setSelectedColor(colorName);
    setSelectedVariantId(null);
    setError(null);
    const preview = variants.find((v) => v.color === colorName && v.imageUrl);
    onVariantChange?.(preview?.imageUrl ?? null);
  }

  function handleAddToCart() {
    if (hasColors && !selectedColor) {
      setError("Choisis une couleur avant d'ajouter au panier.");
      return;
    }
    if (visibleVariants.length > 0 && !selectedVariantId) {
      setError("Choisis une taille avant d'ajouter au panier.");
      return;
    }
    setError(null);

    const finalVariant = selectedVariant;
    const finalPrice = finalVariant ? effectivePrice(finalVariant) : basePrice;
    const sizeLabel = finalVariant?.size ?? "Taille unique";
    const colorLabel = finalVariant?.color ? finalVariant.color + " — " : "";

    addItem({
      productId,
      slug,
      name,
      price: finalPrice,
      variantId: selectedVariantId ?? "unique",
      size: colorLabel + sizeLabel,
      variantLabel: finalVariant?.sku ?? undefined,
      quantity,
      imageUrl,
    });

    openCart();
  }

  return (
    <div>
      <div className="mt-3 flex items-center gap-3">
        {displayedPrice !== null ? (
          <p className="text-xl text-[#181715]">{formatFcfa(displayedPrice)}</p>
        ) : priceRange.min === priceRange.max ? (
          <p className="text-xl text-[#181715]">{formatFcfa(priceRange.min)}</p>
        ) : (
          <p className="text-xl text-[#181715]">
            {formatFcfa(priceRange.min)} – {formatFcfa(priceRange.max)}
          </p>
        )}
        {compareAtPrice && (
          <p className="text-sm text-[#8C8579] line-through">{formatFcfa(compareAtPrice)}</p>
        )}
      </div>

      {hasColors && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-[#181715]">
            Couleur{selectedColor && <span className="normal-case text-[#8C8579]"> — {selectedColor}</span>}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((c) => {
              const isSelected = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleSelectColor(c.name, c.hex)}
                  aria-label={c.name}
                  title={c.name}
                  className={`h-9 w-9 rounded-full border-2 transition-all ${
                    isSelected ? "border-[#006400] scale-110" : "border-[#D8D3C9]"
                  }`}
                  style={{ backgroundColor: c.hex || "#D8D3C9" }}
                />
              );
            })}
          </div>
        </div>
      )}

      {visibleVariants.length > 0 && (
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wide text-[#181715]">Taille</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {visibleVariants.map((v) => {
              const isOutOfStock = v.stock <= 0;
              const isSelected = selectedVariantId === v.id;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    setSelectedVariantId(v.id);
                    setError(null);
                    onVariantChange?.(v.imageUrl ?? null);
                  }}
                  className={`flex flex-col items-center rounded-md border px-4 py-2 text-sm transition-colors ${
                    isOutOfStock
                      ? "cursor-not-allowed border-[#F0EDE5] text-[#D8D3C9]"
                      : isSelected
                      ? "border-[#006400] bg-[#E8F5E9] text-[#006400]"
                      : "border-[#D8D3C9] text-[#181715] hover:border-[#006400]"
                  }`}
                >
                  <span className={isOutOfStock ? "line-through" : ""}>{v.size}</span>
                  {v.sku && <span className="text-[10px] text-[#8C8579]">{v.sku}</span>}
                </button>
              );
            })}
          </div>

          {selectedVariant && (
            <p className="mt-2 text-xs text-[#8C8579]">
              Sélection : <span className="text-[#181715]">{selectedVariant.size}</span>
              {selectedVariant.sku && (
                <>
                  {" — "}
                  <span className="text-[#181715]">{selectedVariant.sku}</span>
                </>
              )}
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <p className="text-xs uppercase tracking-wide text-[#181715]">Quantite</p>
        <div className="flex items-center rounded-md border border-[#D8D3C9]">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 text-[#181715]"
          >
            −
          </button>
          <span className="px-3 text-sm">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 text-[#181715]"
          >
            +
          </button>
        </div>
      </div>

      {error && <p className="mt-3 text-sm text-[#DC143C]">{error}</p>}

      <button
        type="button"
        onClick={handleAddToCart}
        className="mt-6 w-full rounded-md bg-[#006400] py-3 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
      >
        Ajouter au panier
      </button>
    </div>
  );
}
