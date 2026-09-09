import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductRail from "./ProductRail";

export default async function NewArrivals() {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url, sort_order)")
    .eq("is_new", true)
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
      title="Nouveautés"
      subtitle="Les dernières pièces à découvrir en premier"
      products={products}
    />
  );
}
