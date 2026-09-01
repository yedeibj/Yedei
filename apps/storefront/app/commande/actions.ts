"use server";

import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { createServiceClient } from "@yedei/database/service";
import { headers } from "next/headers";

type OrderItemInput = {
  productId: string;
  name: string;
  size: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

const FEDAPAY_ENV = process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox";
const FEDAPAY_BASE_URL =
  FEDAPAY_ENV === "live" ? "https://api.fedapay.com" : "https://sandbox-api.fedapay.com";

function splitName(fullName: string) {
  const parts = fullName.trim().split(/\s+/);
  const firstname = parts[0] || "Client";
  const lastname = parts.length > 1 ? parts.slice(1).join(" ") : firstname;
  return { firstname, lastname };
}

export async function createOrder(input: {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  notes?: string;
  paymentMethod: "livraison" | "fedapay";
  deliveryFee: number;
  items: OrderItemInput[];
}) {
  if (!input.items || input.items.length === 0) {
    return { error: "Le panier est vide." };
  }
  if (!input.customerName.trim() || !input.phone.trim() || !input.address.trim()) {
    return { error: "Merci de remplir tous les champs obligatoires." };
  }

  const supabase = await createServerSupabaseClient();
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = Number(input.deliveryFee) || 0;
  const total = subtotal + deliveryFee;
  const orderId = crypto.randomUUID();

  const { error: orderError } = await supabase.from("orders").insert({
    id: orderId,
    customer_name: input.customerName.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || null,
    address: input.address.trim(),
    city: input.city?.trim() || null,
    notes: input.notes?.trim() || null,
    subtotal,
    delivery_fee: deliveryFee,
    total,
    payment_method: input.paymentMethod,
  });

  if (orderError) {
    console.error("Supabase order insert failed:", orderError);
    return { error: "Erreur lors de la création de la commande. Réessaie dans un instant." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.name,
      variant_size: item.size,
      variant_label: item.variantLabel ?? null,
      unit_price: item.price,
      quantity: item.quantity,
      image_url: item.imageUrl ?? null,
    }))
  );

  if (itemsError) {
    console.error("Supabase order_items insert failed:", itemsError);
    return { error: "Erreur lors de l'enregistrement des articles de la commande." };
  }

  if (input.paymentMethod === "livraison") {
    return { orderId };
  }

  // --- Paiement en ligne via FedaPay ---
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = host?.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/commande/retour?order=${orderId}`;
    const { firstname, lastname } = splitName(input.customerName);

    if (!process.env.FEDAPAY_SECRET_KEY) {
      console.error("FEDAPAY_SECRET_KEY est absente des variables d'environnement au runtime.");
      return { error: "Impossible d'initier le paiement en ligne. Réessaie ou choisis le paiement à la livraison." };
    }

    const createRes = await fetch(`${FEDAPAY_BASE_URL}/v1/transactions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: `Commande YEDEI #${orderId.slice(0, 8).toUpperCase()}`,
        amount: Math.round(total),
        currency: { iso: "XOF" },
        callback_url: callbackUrl,
        customer: {
          firstname,
          lastname,
          email: input.email?.trim() || undefined,
          phone_number: { number: input.phone.trim(), country: "bj" },
        },
      }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("FedaPay create transaction failed:", createRes.status, FEDAPAY_ENV, JSON.stringify(createData));
      return { error: "Impossible d'initier le paiement en ligne. Réessaie ou choisis le paiement à la livraison." };
    }

    const transaction = createData["v1/transaction"] ?? createData.transaction ?? createData;
    const transactionId = transaction?.id;

    if (!transactionId) {
      console.error("FedaPay response missing transaction id:", JSON.stringify(createData));
      return { error: "Impossible d'initier le paiement en ligne. Réessaie ou choisis le paiement à la livraison." };
    }

    const tokenRes = await fetch(`${FEDAPAY_BASE_URL}/v1/transactions/${transactionId}/token`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.FEDAPAY_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("FedaPay token generation failed:", tokenRes.status, JSON.stringify(tokenData));
      return { error: "Impossible de générer le lien de paiement. Réessaie ou choisis le paiement à la livraison." };
    }

    const paymentUrl = tokenData?.url;

    if (!paymentUrl) {
      console.error("FedaPay token response missing url:", JSON.stringify(tokenData));
      return { error: "Impossible de générer le lien de paiement. Réessaie ou choisis le paiement à la livraison." };
    }

    const serviceClient = createServiceClient();
    const { error: updateError } = await serviceClient
      .from("orders")
      .update({ fedapay_transaction_id: String(transactionId) })
      .eq("id", orderId);

    if (updateError) {
      console.error("Supabase order update (fedapay_transaction_id) failed:", updateError);
    }

    return { orderId, paymentUrl: paymentUrl as string };
  } catch (err) {
    console.error("Erreur inattendue lors de l'appel FedaPay:", err);
    return { error: "Erreur de connexion au service de paiement. Réessaie ou choisis le paiement à la livraison." };
  }
}
