import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductRail from "./ProductRail";

export default async function NewArrivals() {
  const supabase = await createServerSupabaseClient();

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url)")
    .eq("is_new", true)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return <ProductRail title="Nouveautés" products={products ?? []} />;
}
