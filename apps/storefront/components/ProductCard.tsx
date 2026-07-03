import Image from "next/image";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-sand">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {product.isNew && (
          <span className="absolute left-3 top-3 bg-ink px-3 py-1 text-[11px] uppercase tracking-widest2 text-paper">
            Nouveau
          </span>
        )}
        <button
          type="button"
          className="absolute inset-x-3 bottom-3 translate-y-2 bg-paper py-3 text-xs uppercase tracking-widest2 text-ink opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Ajouter au panier
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-stone">
            {product.category}
          </p>
          <h3 className="mt-0.5 text-sm text-ink">{product.name}</h3>
        </div>
        <span className="whitespace-nowrap text-sm text-ink">
          {formatPrice(product)}
        </span>
      </div>
    </article>
  );
}
