import Link from "next/link";
import ProductCard from "./ProductCard";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  is_new: boolean;
  is_best_seller: boolean;
  product_images: { url: string }[];
};

type ProductRailProps = {
  title: string;
  subtitle?: string;
  seeAllHref?: string;
  products: Product[];
};

export default function ProductRail({ title, subtitle, seeAllHref, products }: ProductRailProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="px-6 py-12 sm:px-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="font-display text-2xl italic text-[#181715]">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-[#8C8579]">{subtitle}</p>}
        </div>
        {seeAllHref && (
          <Link
            href={seeAllHref}
            className="text-sm uppercase tracking-wide text-[#8C8579] hover:text-[#181715]"
          >
            Voir tout →
          </Link>
        )}
      </div>

      <div className="flex gap-4 overflow-x-auto scroll-smooth pb-2 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            name={product.name}
            price={product.price}
            imageUrl={product.product_images?.[0]?.url}
            isNew={product.is_new}
            isBestSeller={product.is_best_seller}
          />
        ))}
      </div>
    </section>
  );
}
