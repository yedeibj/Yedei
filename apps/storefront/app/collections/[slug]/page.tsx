import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: category } = await supabase
    .from("categories")
    .select("id, name, slug, parent_id, image_url")
    .eq("slug", slug)
    .single();

  if (!category) notFound();

  const [{ data: children }, parentResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, name, slug")
      .eq("parent_id", category.id)
      .order("sort_order"),
    category.parent_id
      ? supabase.from("categories").select("id, name, slug").eq("id", category.parent_id).single()
      : Promise.resolve({ data: null }),
  ]);

  const parent = parentResult.data;

  const siblings = category.parent_id
    ? (
        await supabase
          .from("categories")
          .select("id, name, slug")
          .eq("parent_id", category.parent_id)
          .order("sort_order")
      ).data
    : null;

  const categoryIds = [category.id, ...(children ?? []).map((c) => c.id)];

  const { data: products } = await supabase
    .from("products")
    .select("id, slug, name, price, is_new, is_best_seller, product_images(url)")
    .in("category_id", categoryIds)
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  return (
    <main>
      <Header />

      {/* Bannière */}
      <div className="relative flex min-h-[220px] items-end overflow-hidden bg-[#181715] sm:min-h-[300px]">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#006400]/30 via-[#181715] to-[#00008B]/30" />
        )}
        <div className="relative z-10 px-6 pb-8 sm:px-12 sm:pb-12">
          <div className="mb-2 text-xs text-white/70">
            <Link href="/" className="hover:text-white">Accueil</Link>
            {parent && (
              <>
                {" / "}
                <Link href={`/collections/${parent.slug}`} className="hover:text-white">
                  {parent.name}
                </Link>
              </>
            )}
            {" / "}
            <span className="text-white">{category.name}</span>
          </div>
          <h1 className="font-display text-4xl italic text-white sm:text-5xl">{category.name}</h1>
        </div>
      </div>

      {/* Pills sous-catégories / catégories sœurs */}
      {(children && children.length > 0) || (siblings && siblings.length > 0) ? (
        <div className="flex flex-wrap gap-2 px-6 py-6 sm:px-12">
          {children && children.length > 0 && (
            <>
              <Link
                href={`/collections/${category.slug}`}
                className="rounded-full border border-[#006400] bg-[#E8F5E9] px-4 py-1.5 text-xs uppercase tracking-wide text-[#006400]"
              >
                Tout {category.name}
              </Link>
              {children.map((child) => (
                <Link
                  key={child.id}
                  href={`/collections/${child.slug}`}
                  className="rounded-full border border-[#D8D3C9] px-4 py-1.5 text-xs uppercase tracking-wide text-[#181715] hover:border-[#006400] hover:text-[#006400]"
                >
                  {child.name}
                </Link>
              ))}
            </>
          )}
          {siblings &&
            siblings.length > 0 &&
            siblings.map((sib) => (
              <Link
                key={sib.id}
                href={`/collections/${sib.slug}`}
                className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wide ${
                  sib.id === category.id
                    ? "border-[#006400] bg-[#E8F5E9] text-[#006400]"
                    : "border-[#D8D3C9] text-[#181715] hover:border-[#006400] hover:text-[#006400]"
                }`}
              >
                {sib.name}
              </Link>
            ))}
        </div>
      ) : null}

      {/* Grille produits */}
      <div className="px-6 pb-16 sm:px-12">
        {!products || products.length === 0 ? (
          <p className="py-16 text-center text-sm text-[#8C8579]">
            Aucun produit disponible dans cette collection pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price}
                imageUrl={product.product_images?.[0]?.url}
                isNew={product.is_new}
                isBestSeller={product.is_best_seller}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
