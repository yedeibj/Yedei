import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductGallery from "@/components/ProductGallery";
import AddToCartPanel from "@/components/AddToCartPanel";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, description, price, compare_at_price, categories(name, slug), product_images(url, sort_order), product_variants(size, stock)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const images = [...(product.product_images ?? [])].sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );
  const variants = (product.product_variants ?? []).map((v: any) => ({
    size: v.size,
    stock: v.stock,
  }));
  const category = Array.isArray(product.categories) ? product.categories[0] : product.categories;

  return (
    <main>
      <Header />

      <div className="px-6 py-6 text-xs text-[#8C8579] sm:px-12">
        <Link href="/" className="hover:text-[#181715]">Accueil</Link>
        {" / "}
        {category && (
          <>
            <Link href={`/collections/${category.slug}`} className="hover:text-[#181715]">
              {category.name}
            </Link>
            {" / "}
          </>
        )}
        <span className="text-[#181715]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 gap-10 px-6 pb-16 sm:px-12 lg:grid-cols-2">
        <ProductGallery images={images} productName={product.name} />

        <div>
          <h1 className="font-display text-3xl italic text-[#181715]">{product.name}</h1>

          <div className="mt-3 flex items-center gap-3">
            <p className="text-xl text-[#181715]">
              {Number(product.price).toLocaleString("fr-FR")} FCFA
            </p>
            {product.compare_at_price && (
              <p className="text-sm text-[#8C8579] line-through">
                {Number(product.compare_at_price).toLocaleString("fr-FR")} FCFA
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-[#8C8579]">{product.description}</p>
          )}

          <AddToCartPanel
            productId={product.id}
            slug={slug}
            name={product.name}
            price={Number(product.price)}
            imageUrl={images[0]?.url}
            variants={variants}
          />

          <div className="mt-10 grid grid-cols-2 gap-4 border-t border-[#D8D3C9] pt-6 text-xs text-[#8C8579] sm:grid-cols-4">
            <p className="font-medium text-[#181715]">Tissus de qualité</p>
            <p className="font-medium text-[#181715]">Livraison rapide</p>
            <p className="font-medium text-[#181715]">Paiement sécurisé</p>
            <p className="font-medium text-[#181715]">Retours simplifiés</p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
