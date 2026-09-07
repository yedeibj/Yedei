import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import FooterClient from "./FooterClient";

export default async function Footer() {
  const supabase = await createServerSupabaseClient();

  const [{ data: categories }, { data: legalPages }] = await Promise.all([
    supabase.from("categories").select("id, name, slug, parent_id").order("sort_order"),
    supabase
      .from("legal_pages")
      .select("id, slug, title")
      .eq("is_active", true)
      .order("sort_order"),
  ]);

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

  const infoLinks = (legalPages ?? []).map((p) => ({
    label: p.title,
    href: `/pages/${p.slug}`,
  }));

  return <FooterClient categories={topLevel} infoLinks={infoLinks} />;
}
