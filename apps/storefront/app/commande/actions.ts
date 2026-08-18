"use server";

import { createClient as createServerSupabaseClient } from "@yedei/database/server";

type OrderItemInput = {
  productId: string;
  name: string;
  size: string;
  variantLabel?: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export async function createOrder(input: {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city?: string;
  notes?: string;
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

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      customer_name: input.customerName.trim(),
      phone: input.phone.trim(),
      email: input.email?.trim() || null,
      address: input.address.trim(),
      city: input.city?.trim() || null,
      notes: input.notes?.trim() || null,
      subtotal,
      total: subtotal,
      payment_method: "livraison",
    })
    .select("id")
    .single();

  if (orderError || !order) {
    return { error: "Erreur lors de la création de la commande. Réessaie dans un instant." };
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
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
    return { error: "Erreur lors de l'enregistrement des articles de la commande." };
  }

  return { orderId: order.id as string };
}
