import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Link from "next/link";
import Image from "next/image";
import AdminShell from "@/components/AdminShell";
import ProductsFilterBar from "@/components/ProductsFilterBar";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("products")
    .select(
      "id, name, price, is_active, categories(name), product_images(url), product_variants(stock)"
    )
    .order("created_at", { ascending: false });

  if (q) query = query.ilike("name", `%${q}%`);
  if (category) query = query.eq("category_id", category);

  const [{ data: products }, { data: categories }] = await Promise.all([
    query,
    supabase.from("categories").select("id, name").order("sort_order"),
  ]);

  return (
    <AdminShell>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl italic text-[#181715]">Produits</h1>
        <Link
          href="/produits/nouveau"
          className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
        >
          + Ajouter un produit
        </Link>
      </div>

      <ProductsFilterBar categories={categories ?? []} />

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#D8D3C9] text-xs uppercase tracking-wide text-[#8C8579]">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Stock total</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[#8C8579]">
                  Aucun produit trouvé.
                </td>
              </tr>
            )}
            {products?.map((product: any) => {
              const totalStock = (product.product_variants ?? []).reduce(
                (sum: number, v: any) => sum + (v.stock ?? 0),
                0
              );
              return (
                <tr key={product.id} className="border-b border-[#F0EDE5] last:border-0">
                  <td className="px-4 py-3">
                    {product.product_images?.[0]?.url ? (
                      <div className="relative h-12 w-12 overflow-hidden rounded-md bg-[#F0EDE5]">
                        <Image
                          src={product.product_images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-12 w-12 rounded-md bg-[#F0EDE5]" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-[#181715]">{product.name}</td>
                  <td className="px-4 py-3 text-[#8C8579]">{product.categories?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-[#181715]">
                    {Number(product.price).toLocaleString("fr-FR")} FCFA
                  </td>
                  <td className="px-4 py-3 text-[#181715]">{totalStock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        product.is_active
                          ? "bg-[#E8F5E9] text-[#006400]"
                          : "bg-[#F0EDE5] text-[#8C8579]"
                      }`}
                    >
                      {product.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/produits/${product.id}`} className="text-xs text-[#00008B] hover:underline">
                      Modifier
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
