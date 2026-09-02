import Link from "next/link";
import { createServiceClient } from "@yedei/database/service";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const FEDAPAY_ENV = process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox";
const FEDAPAY_BASE_URL =
  FEDAPAY_ENV === "live" ? "https://api.fedapay.com" : "https://sandbox-api.fedapay.com";

export default async function OrderReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; id?: string }>;
}) {
  const { order: orderId, id: transactionId } = await searchParams;
  let verifiedStatus: string | null = null;
  let paymentMethod: string | null = null;
  let subtotal: number | null = null;

  if (transactionId && orderId) {
    try {
      const res = await fetch(`${FEDAPAY_BASE_URL}/v1/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}` },
        cache: "no-store",
      });
      const data = await res.json();
      const transaction = data["v1/transaction"] ?? data.transaction ?? data;
      verifiedStatus = transaction?.status ?? null;

      const supabase = createServiceClient();
      const { data: orderRow } = await supabase
        .from("orders")
        .select("payment_method, subtotal")
        .eq("id", orderId)
        .eq("fedapay_transaction_id", String(transactionId))
        .single();

      paymentMethod = orderRow?.payment_method ?? null;
      subtotal = orderRow?.subtotal ? Number(orderRow.subtotal) : null;

      if (verifiedStatus === "approved" && orderRow) {
        const updatePayload: Record<string, any> = { delivery_fee_paid: true, status: "confirmee" };
        if (paymentMethod === "fedapay") {
          updatePayload.payment_status = "paye";
        }
        await supabase
          .from("orders")
          .update(updatePayload)
          .eq("id", orderId)
          .eq("fedapay_transaction_id", String(transactionId));
      }
    } catch {
      verifiedStatus = null;
    }
  }

  const reference = orderId ? orderId.slice(0, 8).toUpperCase() : null;
  const isApproved = verifiedStatus === "approved";
  const isDeliveryOnly = paymentMethod === "livraison";

  return (
    <main>
      <Header />
      <div className="mx-auto max-w-lg px-6 py-20 text-center sm:px-12">
        <span className="flex justify-center gap-[3px]" aria-hidden="true">
          <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
          <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
          <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
        </span>

        {isApproved ? (
          <>
            <h1 className="mt-4 font-display text-3xl italic text-[#181715]">
              {isDeliveryOnly ? "Frais de livraison payés, merci !" : "Paiement reçu, merci !"}
            </h1>
            {reference && (
              <p className="mt-3 text-sm text-[#8C8579]">
                Référence de commande : <span className="text-[#181715]">#{reference}</span>
              </p>
            )}
            <p className="mt-4 text-sm leading-relaxed text-[#8C8579]">
              {isDeliveryOnly && subtotal
                ? `Il te reste ${subtotal.toLocaleString("fr-FR")} FCFA à régler à la livraison.`
                : "Ta commande est confirmée, nous préparons ta livraison."}
            </p>
          </>
        ) : (
          <>
            <h1 className="mt-4 font-display text-3xl italic text-[#181715]">
              Paiement non confirmé
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-[#8C8579]">
              Le paiement n'a pas pu être confirmé (annulé ou refusé). Ta commande reste
              enregistrée en attente — contacte-nous si besoin.
            </p>
          </>
        )}

        <Link
          href="/"
          className="mt-8 inline-block rounded-md bg-[#006400] px-6 py-3 text-sm uppercase tracking-wide text-white hover:opacity-90"
        >
          Retour à l'accueil
        </Link>
      </div>
      <Footer />
    </main>
  );
}
