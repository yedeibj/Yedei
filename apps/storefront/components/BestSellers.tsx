import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductRail from "./ProductRail";

export default async function BestSellers() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url, sort_order)")
    .eq("is_best_seller", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  const products = (data ?? []).map((p: any) => ({
    ...p,
    product_images: [...(p.product_images ?? [])].sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    ),
  }));

  return (
    <ProductRail
      title="Meilleures ventes"
      subtitle="Les favoris de nos clientes et clients"
      products={products}
    />
  );
}
