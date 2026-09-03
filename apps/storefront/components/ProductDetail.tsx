"use client";

import { useState } from "react";
import ProductGallery from "./ProductGallery";
import AddToCartPanel from "./AddToCartPanel";

type Variant = {
  id: string;
  size: string;
  sku: string | null;
  stock: number;
  price: number | null;
  imageUrl?: string | null;
};

export default function ProductDetail({
  productId,
  slug,
  name,
  description,
  basePrice,
  compareAtPrice,
  images,
  variants,
}: {
  productId: string;
  slug: string;
  name: string;
  description: string | null;
  basePrice: number;
  compareAtPrice: number | null;
  images: { url: string }[];
  variants: Variant[];
}) {
  const [variantImageUrl, setVariantImageUrl] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 gap-10 px-6 pb-16 sm:px-12 lg:grid-cols-2">
      <ProductGallery images={images} productName={name} variantImageUrl={variantImageUrl} />

      <div>
        <h1 className="font-display text-3xl italic text-[#181715]">{name}</h1>

        <AddToCartPanel
          productId={productId}
          slug={slug}
          name={name}
          basePrice={basePrice}
          compareAtPrice={compareAtPrice}
          imageUrl={variantImageUrl ?? images[0]?.url}
          variants={variants}
          onVariantChange={setVariantImageUrl}
        />

        {description && (
          <p className="mt-8 border-t border-[#D8D3C9] pt-6 text-sm leading-relaxed text-[#8C8579]">
            {description}
          </p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-4 border-t border-[#D8D3C9] pt-6 text-xs text-[#8C8579] sm:grid-cols-4">
          <p className="font-medium text-[#181715]">Tissus de qualité</p>
          <p className="font-medium text-[#181715]">Livraison rapide</p>
          <p className="font-medium text-[#181715]">Paiement sécurisé</p>
          <p className="font-medium text-[#181715]">Retours simplifiés</p>
        </div>
      </div>
    </div>
  );
}
