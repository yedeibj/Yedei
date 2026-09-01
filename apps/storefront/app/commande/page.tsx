import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CommandePage() {
  const supabase = await createServerSupabaseClient();
  const { data: setting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "delivery_fee")
    .single();

  const deliveryFee = setting ? Number(setting.value) : 0;

  return <CheckoutForm deliveryFee={deliveryFee} />;
}
