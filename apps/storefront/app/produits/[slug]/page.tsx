import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: product } = await supabase
    .from("products")
    .select(
      "id, name, description, price, compare_at_price, product_images(url, sort_order), product_variants(size, stock)"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!product) notFound();

  const images = (product.product_images ?? []).sort(
    (a: any, b: any) => a.sort_order - b.sort_order
  );

  return (
    <main>
      <Header />
      <div className="grid grid-cols-1 gap-8 px-6 py-10 sm:px-12 lg:grid-cols-2">
        <div className="grid grid-cols-2 gap-3">
          {images.length > 0 ? (
            images.map((img: any, i: number) => (
              <div
                key={i}
                className={`relative aspect-[3/4] overflow-hidden rounded-md bg-[#F0EDE5] ${
                  i === 0 ? "col-span-2" : ""
                }`}
              >
                <Image src={img.url} alt={product.name} fill sizes="600px" className="object-cover" />
              </div>
            ))
          ) : (
            <div className="col-span-2 aspect-[3/4] rounded-md bg-[#F0EDE5]" />
          )}
        </div>

        <div>
          <h1 className="font-display text-3xl italic text-[#181715]">{product.name}</h1>
          <div className="mt-2 flex items-center gap-3">
            <p className="text-xl text-[#181715]">
              {Number(product.price).toLocaleString("fr-FR")} FCFA
            </p>
            {product.compare_at_price && (
              <p className="text-sm text-[#8C8579] line-through">
                {Number(product.compare_at_price).toLocaleString("fr-FR")} FCFA
              </p>
            )}
          </div>

          {product.description && (
            <p className="mt-6 text-sm leading-relaxed text-[#8C8579]">{product.description}</p>
          )}

          {product.product_variants?.length > 0 && (
            <div className="mt-8">
              <p className="text-xs uppercase tracking-wide text-[#181715]">Tailles disponibles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.product_variants.map((v: any) => (
                  <span
                    key={v.size}
                    className={`rounded-md border px-3 py-1.5 text-sm ${
                      v.stock > 0
                        ? "border-[#D8D3C9] text-[#181715]"
                        : "border-[#F0EDE5] text-[#D8D3C9] line-through"
                    }`}
                  >
                    {v.size}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}
