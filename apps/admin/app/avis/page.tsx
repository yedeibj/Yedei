import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

async function approveReview(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("reviews").update({ is_approved: true }).eq("id", id);
  revalidatePath("/avis");
}

async function unapproveReview(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("reviews").update({ is_approved: false }).eq("id", id);
  revalidatePath("/avis");
}

async function deleteReview(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("reviews").delete().eq("id", id);
  revalidatePath("/avis");
}

function Stars({ rating }: { rating: number | null }) {
  const n = rating ?? 0;
  return (
    <span className="text-[#006400]" aria-label={`${n} sur 5`}>
      {"★".repeat(n)}
      <span className="text-[#D8D3C9]">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

export default async function AvisPage({
  searchParams,
}: {
  searchParams: Promise<{ filtre?: string }>;
}) {
  const { filtre } = await searchParams;
  const supabase = await createServerSupabaseClient();

  let query = supabase
    .from("reviews")
    .select("id, author_name, rating, comment, is_approved, created_at, products(name)")
    .order("created_at", { ascending: false });

  if (filtre === "attente") query = query.eq("is_approved", false);
  if (filtre === "approuves") query = query.eq("is_approved", true);

  const { data: reviews } = await query;

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Avis clients</h1>
      <p className="mt-1 text-sm text-[#8C8579]">Modère les avis avant qu'ils apparaissent sur les fiches produits.</p>

      <div className="mt-6 flex gap-2 text-xs uppercase tracking-wide">
        <a href="/avis" className={`rounded-full px-3 py-1.5 ${!filtre ? "bg-[#181715] text-white" : "border border-[#D8D3C9] text-[#181715]"}`}>Tous</a>
        <a href="/avis?filtre=attente" className={`rounded-full px-3 py-1.5 ${filtre === "attente" ? "bg-[#181715] text-white" : "border border-[#D8D3C9] text-[#181715]"}`}>En attente</a>
        <a href="/avis?filtre=approuves" className={`rounded-full px-3 py-1.5 ${filtre === "approuves" ? "bg-[#181715] text-white" : "border border-[#D8D3C9] text-[#181715]"}`}>Approuvés</a>
      </div>

      <div className="mt-6 space-y-3">
        {(reviews ?? []).map((review: any) => {
          const product = Array.isArray(review.products) ? review.products[0] : review.products;
          return (
            <div key={review.id} className="flex flex-wrap items-start justify-between gap-4 rounded-md border border-[#D8D3C9] p-4">
              <div className="max-w-xl">
                <div className="flex items-center gap-2 text-sm">
                  <Stars rating={review.rating} />
                  <span className="font-medium text-[#181715]">{review.author_name ?? "Anonyme"}</span>
                  {!review.is_approved && (
                    <span className="rounded-full bg-[#FDECEF] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#DC143C]">En attente</span>
                  )}
                </div>
                {product?.name && <p className="mt-1 text-xs text-[#8C8579]">Produit : {product.name}</p>}
                <p className="mt-2 text-sm text-[#181715]">{review.comment}</p>
              </div>
              <div className="flex flex-shrink-0 items-center gap-2">
                {review.is_approved ? (
                  <ConfirmSubmitButton
                    action={unapproveReview}
                    hiddenFields={{ id: review.id }}
                    confirmMessage="Masquer cet avis du site ?"
                    label="Masquer"
                    className="rounded-md border border-[#D8D3C9] px-3 py-1.5 text-xs uppercase tracking-wide text-[#181715] hover:border-[#181715]"
                  />
                ) : (
                  <ConfirmSubmitButton
                    action={approveReview}
                    hiddenFields={{ id: review.id }}
                    confirmMessage="Approuver cet avis ? Il deviendra visible sur le site."
                    label="Approuver"
                    className="rounded-md bg-[#006400] px-3 py-1.5 text-xs uppercase tracking-wide text-white hover:opacity-90"
                  />
                )}
                <ConfirmSubmitButton
                  action={deleteReview}
                  hiddenFields={{ id: review.id }}
                  confirmMessage="Supprimer définitivement cet avis ?"
                  label="Supprimer"
                  className="rounded-md border border-[#DC143C] px-3 py-1.5 text-xs uppercase tracking-wide text-[#DC143C] hover:bg-[#FDECEF]"
                />
              </div>
            </div>
          );
        })}
        {(!reviews || reviews.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucun avis pour le moment.</p>
        )}
      </div>
    </AdminShell>
  );
}
