import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";

async function updateDeliveryFee(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const value = String(formData.get("delivery_fee") ?? "0").trim();
  await supabase.from("site_settings").upsert({ key: "delivery_fee", value });
  revalidatePath("/reglages");
}

export default async function SettingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: setting } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "delivery_fee")
    .single();

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Réglages</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Paramètres généraux du site.
      </p>

      <div className="mt-8 max-w-sm rounded-md border border-[#D8D3C9] p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">
          Frais de livraison
        </h2>
        <p className="mt-1 text-xs text-[#8C8579]">
          Montant fixe ajouté au total de chaque commande, peu importe l'adresse.
        </p>
        <form action={updateDeliveryFee} className="mt-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">
              Montant (FCFA)
            </label>
            <input
              name="delivery_fee"
              type="number"
              step="1"
              defaultValue={setting?.value ?? "1000"}
              className="mt-1 w-full rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
            />
          </div>
          <button
            type="submit"
            className="rounded-md bg-[#006400] px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90"
          >
            Enregistrer
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
