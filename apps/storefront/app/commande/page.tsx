import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CommandePage() {
  const supabase = await createServerSupabaseClient();
  const { data: zones } = await supabase
    .from("delivery_zones")
    .select("id, name, fee, is_default")
    .order("sort_order");

  return <CheckoutForm zones={zones ?? []} />;
}
