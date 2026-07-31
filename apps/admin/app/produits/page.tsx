import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Link from "next/link";
import Image from "next/image";

export default async function ProductsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: products } = await supabase
    .from("products")
    .select("id, name, price, is_active, categories(name), product_images(url)")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#F6F3EC] px-8 py-10">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl italic text-[#181715]">Produits</h1>
        <Link
          href="/produits/nouveau"
          className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
        >
          + Ajouter un produit
        </Link>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#D8D3C9] text-xs uppercase tracking-wide text-[#8C8579]">
            <tr>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Nom</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Prix</th>
              <th className="px-4 py-3">Statut</th>
            </tr>
          </thead>
          <tbody>
            {(!products || products.length === 0) && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[#8C8579]">
                  Aucun produit pour l'instant.
                </td>
              </tr>
            )}
            {products?.map((product: any) => (
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
                <td className="px-4 py-3 text-[#8C8579]">
                  {product.categories?.name ?? "—"}
                </td>
                <td className="px-4 py-3 text-[#181715]">
                  {Number(product.price).toLocaleString("fr-FR")} FCFA
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
