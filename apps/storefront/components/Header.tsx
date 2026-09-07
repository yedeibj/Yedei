import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import HeaderNav from "./HeaderNav";

export default async function Header() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id")
    .order("sort_order");

  const all = categories ?? [];
  const topLevel = all
    .filter((c) => !c.parent_id)
    .map((parent) => ({
      id: parent.id,
      label: parent.name,
      slug: parent.slug,
      children: all
        .filter((c) => c.parent_id === parent.id)
        .map((child) => ({ id: child.id, label: child.name, slug: child.slug })),
    }));

  return <HeaderNav categories={topLevel} />;
}
