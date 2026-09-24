import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  const supabase = await createServerSupabaseClient();
  let products: any[] = [];

  if (query) {
    const { data } = await supabase
      .from("products")
      .select("id, slug, name, price, is_new, is_best_seller, product_images(url, sort_order)")
      .eq("is_active", true)
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false });

    products = (data ?? []).map((p: any) => ({
      ...p,
      product_images: [...(p.product_images ?? [])].sort(
        (a: any, b: any) => a.sort_order - b.sort_order
      ),
    }));
  }

  return (
    <main>
      <Header />
      <div className="px-6 py-10 sm:px-12">
        <h1 className="font-display text-2xl italic text-[#181715]">
          {query ? `Résultats pour "${query}"` : "Recherche"}
        </h1>
        <p className="mt-1 text-sm text-[#8C8579]">
          {query
            ? `${products.length} produit${products.length > 1 ? "s" : ""} trouvé${products.length > 1 ? "s" : ""}`
            : "Tape un mot-clé pour chercher un produit."}
        </p>

        {query && products.length === 0 && (
          <p className="mt-10 text-sm text-[#8C8579]">
            Aucun résultat pour "{query}". Essaie un autre mot-clé, ou explore nos{" "}
            <a href="/" className="text-[#006400] underline">collections</a>.
          </p>
        )}

        {products.length > 0 && (
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
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
        )}
      </div>
      <Footer />
    </main>
  );
}
