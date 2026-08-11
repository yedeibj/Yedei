"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";

type Variant = { size: string; stock: number };

export default function AddToCartPanel({
  productId,
  slug,
  name,
  price,
  imageUrl,
  variants,
}: {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
  variants: Variant[];
}) {
  const { addItem } = useCart();
  const [selectedSize, setSelectedSize] = useState<string | null>(
    variants.length === 0 ? "unique" : null
  );
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);

  function handleAddToCart() {
    if (variants.length > 0 && !selectedSize) {
      setError("Choisis une taille avant d'ajouter au panier.");
      return;
    }
    setError(null);

    addItem({
      productId,
      slug,
      name,
      price,
      size: selectedSize ?? "unique",
      quantity,
      imageUrl,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2500);
  }

  return (
    <div>
      {variants.length > 0 && (
        <div className="mt-8">
          <p className="text-xs uppercase tracking-wide text-[#181715]">Taille</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((v) => {
              const isOutOfStock = v.stock <= 0;
              const isSelected = selectedSize === v.size;
              return (
                <button
                  key={v.size}
                  type="button"
                  disabled={isOutOfStock}
                  onClick={() => {
                    setSelectedSize(v.size);
                    setError(null);
                  }}
                  className={`rounded-md border px-4 py-2 text-sm transition-colors ${
                    isOutOfStock
                      ? "cursor-not-allowed border-[#F0EDE5] text-[#D8D3C9] line-through"
                      : isSelected
                      ? "border-[#006400] bg-[#E8F5E9] text-[#006400]"
                      : "border-[#D8D3C9] text-[#181715] hover:border-[#006400]"
                  }`}
                >
                  {v.size}
                </button>
              );
            })}
          </div>
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
