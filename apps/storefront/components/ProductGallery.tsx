"use client";

import { useEffect, useState } from "react";

type GalleryImage = { url: string };

export default function ProductGallery({
  images,
  productName,
  variantImageUrl,
}: {
  images: GalleryImage[];
  productName: string;
  variantImageUrl?: string | null;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (variantImageUrl) setActiveIndex(-1);
  }, [variantImageUrl]);

  const mainImageUrl = activeIndex === -1 ? variantImageUrl : images[activeIndex]?.url;

  if (images.length === 0 && !mainImageUrl) {
    return <div className="aspect-[3/4] w-full rounded-md bg-white" />;
  }

  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row">
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto sm:flex-col sm:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 bg-white transition-colors ${
                i === activeIndex ? "border-[#006400]" : "border-[#F0EDE5]"
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-contain" />
            </button>
          ))}
        </div>
      )}

      <div className="aspect-[3/4] flex-1 overflow-hidden rounded-md border border-[#F0EDE5] bg-white">
        {mainImageUrl && (
          <img src={mainImageUrl} alt={productName} className="h-full w-full object-contain" />
        )}
      </div>
    </div>
  );
}
