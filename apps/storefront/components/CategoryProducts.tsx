import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductRail from "./ProductRail";

export default async function CategoryProducts({
  categorySlug,
  title,
}: {
  categorySlug: string;
  title: string;
}) {
  const supabase = await createServerSupabaseClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id")
    .eq("slug", categorySlug)
    .single();

  if (!category) return null;

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url)")
    .eq("category_id", category.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(12);

  return (
    <ProductRail
      title={title}
      seeAllHref={`/collections/${categorySlug}`}
      products={products ?? []}
    />
  );
}
