"use client";

import { useMemo, useState } from "react";
import { useCart } from "@/lib/cart-context";

type Variant = { id: string; size: string; sku: string | null; stock: number; price: number | null };

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
}: {
  productId: string;
  slug: string;
  name: string;
  basePrice: number;
  compareAtPrice?: number | null;
  imageUrl?: string;
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    variants.length === 0 ? "unique" : null
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  function effectivePrice(variant: Variant) {
    return variant.price ?? basePrice;
  }

  const selectedVariant = variants.find((v) => v.id === selectedVariantId);

  const priceRange = useMemo(() => {
    if (variants.length === 0) return { min: basePrice, max: basePrice };
    const prices = variants.map(effectivePrice);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [variants, basePrice]);

  const displayedPrice = selectedVariant ? effectivePrice(selectedVariant) : null;

  function handleAddToCart() {
    if (variants.length > 0 && !selectedVariantId) {
      setError("Choisis une taille avant d'ajouter au panier.");
      return;
    }
    setError(null);

    const finalVariant = selectedVariant;
    const finalPrice = finalVariant ? effectivePrice(finalVariant) : basePrice;

    addItem({
      productId,
      slug,
      name,
      price: finalPrice,
      variantId: selectedVariantId ?? "unique",
      size: finalVariant?.size ?? "Taille unique",
      variantLabel: finalVariant?.sku ?? undefined,
      quantity,
      imageUrl,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
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

      {variants.length > 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-[#181715]">Taille</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((v) => {
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
        {justAdded ? "Ajoute ✓" : "Ajouter au panier"}
      </button>
    </div>
  );
}
