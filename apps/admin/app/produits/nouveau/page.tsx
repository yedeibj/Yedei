import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import ProductForm from "@/components/ProductForm";
import Link from "next/link";

export default async function NewProductPage() {
  const supabase = await createServerSupabaseClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <main className="min-h-screen bg-[#F6F3EC] px-8 py-10">
      <Link href="/produits" className="text-sm text-[#8C8579] hover:text-[#181715]">
        ← Retour aux produits
      </Link>
      <h1 className="mt-2 font-display text-2xl italic text-[#181715]">
        Nouveau produit
      </h1>

      <ProductForm categories={categories ?? []} />
    </main>
  );
}
