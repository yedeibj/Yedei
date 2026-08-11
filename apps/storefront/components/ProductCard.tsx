import Link from "next/link";

type ProductCardProps = {
  slug: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  isNew?: boolean;
  isBestSeller?: boolean;
};

export default function ProductCard({
  slug,
  name,
  price,
  imageUrl,
  isNew,
  isBestSeller,
}: ProductCardProps) {
  return (
    <Link href={`/produits/${slug}`} className="group w-[220px] flex-shrink-0 snap-start sm:w-[260px]">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md bg-[#F0EDE5]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-[#8C8579]">
            Pas d'image
          </div>
        )}

        {(isNew || isBestSeller) && (
          <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] uppercase tracking-wide text-[#181715]">
            {isNew ? "Nouveau" : "Meilleure vente"}
          </span>
        )}
      </div>

      <p className="mt-3 font-sans text-sm text-[#181715]">{name}</p>
      <p className="text-sm text-[#8C8579]">{price.toLocaleString("fr-FR")} FCFA</p>
    </Link>
  );
}
