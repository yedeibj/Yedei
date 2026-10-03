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
    .select("id, parent_id, garment_type")
    .eq("id", categoryId)
    .single();

  if (!category) return null;

  const rootId = category.parent_id ?? category.id;

  const { data: siblings } = await supabase
    .from("categories")
    .select("id, garment_type")
    .or(`id.eq.${rootId},parent_id.eq.${rootId}`);

  const allFamilyCategories = siblings ?? [];
  const familyIds = allFamilyCategories.map((c) => c.id);

  let title = "Complète ta tenue";
  let subtitle = "D'autres articles qui pourraient te plaire";
  let targetCategoryIds = familyIds;

  if (category.garment_type === "haut") {
    targetCategoryIds = allFamilyCategories.filter((c) => c.garment_type === "bas").map((c) => c.id);
    title = "Complète avec un bas";
    subtitle = "Pour assortir avec cet article";
  } else if (category.garment_type === "bas") {
    targetCategoryIds = allFamilyCategories.filter((c) => c.garment_type === "haut").map((c) => c.id);
    title = "Complète avec un haut";
    subtitle = "Pour assortir avec cet article";
  }

  // Si aucune catégorie complémentaire configurée, on retombe sur toute la famille
  if (targetCategoryIds.length === 0) {
    targetCategoryIds = familyIds;
  }

  const { data } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url, sort_order)")
    .in("category_id", targetCategoryIds)
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

  return <ProductRail title={title} subtitle={subtitle} products={products} />;
}
