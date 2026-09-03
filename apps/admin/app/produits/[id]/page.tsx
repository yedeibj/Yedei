import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductForm from "@/components/ProductForm";
import AdminShell from "@/components/AdminShell";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();

  const [{ data: product }, { data: categories }, { data: variants }, { data: images }] =
    await Promise.all([
      supabase
        .from("products")
        .select(
          "id, name, description, price, compare_at_price, category_id, is_new, is_best_seller, is_active"
        )
        .eq("id", id)
        .single(),
      supabase.from("categories").select("id, name, parent_id").order("sort_order"),
      supabase
        .from("product_variants")
        .select("size, sku, price, stock, image_url")
        .eq("product_id", id),
      supabase
        .from("product_images")
        .select("url")
        .eq("product_id", id)
        .order("sort_order"),
    ]);

  if (!product) notFound();

  const initialVariants = (variants ?? []).map((v) => ({
    key: crypto.randomUUID(),
    size: v.size ?? "",
    sku: v.sku ?? "",
    price: v.price ? String(v.price) : "",
    stock: v.stock ? String(v.stock) : "0",
    imageUrl: v.image_url ?? undefined,
  }));

  const initialImages = (images ?? []).map((img) => ({
    path: img.url.split("/products/").pop() ?? "",
    url: img.url,
  }));

  return (
    <AdminShell>
      <Link href="/produits" className="text-sm text-[#8C8579] hover:text-[#181715]">
        ← Retour aux produits
      </Link>
      <h1 className="mt-2 font-display text-2xl italic text-[#181715]">
        Modifier {product.name}
      </h1>

      <ProductForm
        categories={categories ?? []}
        product={product}
        initialVariants={initialVariants}
        initialImages={initialImages}
      />
    </AdminShell>
  );
}
