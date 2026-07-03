import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function NewArrivals() {
  return (
    <section id="nouveautes" className="mx-auto max-w-container px-6 py-20 md:px-10">
      <div className="mb-10 flex items-end justify-between gap-4">
        <h2 className="font-display text-3xl italic text-ink sm:text-4xl">
          Nouveautés
        </h2>
        <a
          href="/nouveautes"
          className="hidden text-sm uppercase tracking-widest2 text-ink/70 underline-offset-4 hover:text-ink hover:underline sm:block"
        >
          Voir tout
        </a>
      </div>
      <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
