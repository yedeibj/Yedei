import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductRail from "./ProductRail";

export default async function RelatedProducts({
  categoryId,
  excludeProductId,
}: {
  categoryId: string | null;
  excludeProductId: string;
}) {
  if (!categoryId) return null;

  const supabase = await createServerSupabaseClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, parent_id")
    .eq("id", categoryId)
    .single();

  if (!category) return null;

  const rootId = category.parent_id ?? category.id;

  const { data: children } = await supabase
    .from("categories")
    .select("id")
    .eq("parent_id", rootId);

  const familyIds = [rootId, ...(children ?? []).map((c) => c.id)];

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url, sort_order)")
    .in("category_id", familyIds)
    .neq("id", excludeProductId)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(10);

  const products = (data ?? []).map((p: any) => ({
    ...p,
    product_images: [...(p.product_images ?? [])].sort(
      (a: any, b: any) => a.sort_order - b.sort_order
    ),
  }));

  if (products.length === 0) return null;

  return <ProductRail title="Complète ta tenue" subtitle="D'autres articles qui pourraient te plaire" products={products} />;
}
