"use client";

import { useState } from "react";

type GalleryImage = { url: string };

export default function ProductGallery({
  images,
  productName,
}: {
  images: GalleryImage[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return <div className="aspect-[3/4] w-full rounded-md bg-[#F0EDE5]" />;
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
              className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                i === activeIndex ? "border-[#006400]" : "border-transparent"
              }`}
            >
              <img src={img.url} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="aspect-[3/4] flex-1 overflow-hidden rounded-md bg-[#F0EDE5]">
        <img src={images[activeIndex].url} alt={productName} className="h-full w-full object-cover" />
      </div>
    </div>
  );
}
