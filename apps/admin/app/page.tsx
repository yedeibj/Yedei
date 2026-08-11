import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import Link from "next/link";
import AdminShell from "@/components/AdminShell";

export default async function AdminHomePage() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: productCount },
    { count: categoryCount },
    { count: promotionCount },
    { count: pendingReviewCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase.from("promotions").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("reviews").select("*", { count: "exact", head: true }).eq("is_approved", false),
  ]);

  const stats = [
    { label: "Produits", value: productCount ?? 0, href: "/produits" },
    { label: "Catégories", value: categoryCount ?? 0, href: "/categories" },
    { label: "Promotions actives", value: promotionCount ?? 0, href: "/promotions" },
    { label: "Avis en attente", value: pendingReviewCount ?? 0, href: "/avis" },
  ];

  return (
    <AdminShell>
      <h2 className="font-sans text-sm uppercase tracking-wide text-[#8C8579]">Aperçu</h2>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <p className="text-3xl font-semibold text-[#181715]">{stat.value}</p>
            <p className="mt-1 text-sm text-[#8C8579]">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-sans text-sm uppercase tracking-wide text-[#8C8579]">
          Actions rapides
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/produits/nouveau"
            className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
          >
            + Ajouter un produit
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
