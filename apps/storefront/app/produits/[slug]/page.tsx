import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductDetail from "@/components/ProductDetail";

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
      "id, name, description, price, compare_at_price, categories(name, slug), product_images(url, sort_order), product_variants(id, size, sku, stock, price, image_url, color, color_hex)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const images = [...(product.product_images ?? [])].sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );
  const variants = (product.product_variants ?? []).map((v: any) => ({
    id: v.id,
    size: v.size,
    sku: v.sku,
    stock: v.stock,
    price: v.price !== null && v.price !== undefined ? Number(v.price) : null,
    imageUrl: v.image_url ?? null,
    color: v.color ?? null,
    colorHex: v.color_hex ?? null,
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

      <ProductDetail
        productId={product.id}
        slug={slug}
        name={product.name}
        description={product.description}
        basePrice={Number(product.price)}
        compareAtPrice={product.compare_at_price ? Number(product.compare_at_price) : null}
        images={images}
        variants={variants}
      />

      <Footer />
    </main>
  );
}
