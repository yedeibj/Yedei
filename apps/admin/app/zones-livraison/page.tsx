import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

async function addZone(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return;
  const isDefault = formData.get("is_default") === "on";
  if (isDefault) {
    await supabase.from("delivery_zones").update({ is_default: false }).neq("id", "00000000-0000-0000-0000-000000000000");
  }
  await supabase.from("delivery_zones").insert({
    name,
    fee: Number(formData.get("fee") ?? 0),
    sort_order: Number(formData.get("sort_order") ?? 0),
    is_default: isDefault,
  });
  revalidatePath("/zones-livraison");
}

async function updateZone(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  if (!id || !name) return;
  const isDefault = formData.get("is_default") === "on";
  if (isDefault) {
    await supabase.from("delivery_zones").update({ is_default: false }).neq("id", id);
  }
  await supabase
    .from("delivery_zones")
    .update({
      name,
      fee: Number(formData.get("fee") ?? 0),
      sort_order: Number(formData.get("sort_order") ?? 0),
      is_default: isDefault,
    })
    .eq("id", id);
  revalidatePath("/zones-livraison");
}

async function deleteZone(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("delivery_zones").delete().eq("id", id);
  revalidatePath("/zones-livraison");
}

export default async function DeliveryZonesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: zones } = await supabase
    .from("delivery_zones")
    .select("id, name, fee, is_default, sort_order")
    .order("sort_order");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Zones de livraison</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Le client choisit sa zone au moment de la commande — les frais de livraison sont toujours payés en ligne immédiatement, même en paiement à la livraison.
      </p>

      <div className="mt-8 space-y-4">
        {(zones ?? []).map((zone) => (
          <div key={zone.id} className="rounded-md border border-[#D8D3C9] p-4">
            <form action={updateZone} className="flex flex-wrap items-end gap-3">
              <input type="hidden" name="id" value={zone.id} />
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Nom</label>
                <input
                  name="name"
                  defaultValue={zone.name}
                  required
                  className="mt-1 w-40 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Frais (FCFA)</label>
                <input
                  name="fee"
                  type="number"
                  step="1"
                  defaultValue={zone.fee}
                  className="mt-1 w-28 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wide text-[#8C8579]">Ordre</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={zone.sort_order}
                  className="mt-1 w-20 rounded-md border border-[#D8D3C9] px-2 py-1.5 text-sm outline-none focus:border-[#006400]"
                />
              </div>
              <label className="flex items-center gap-2 pb-2 text-sm">
                <input type="checkbox" name="is_default" defaultChecked={zone.is_default} />
                Zone par défaut
              </label>
              <button
                type="submit"
                className="rounded-md bg-[#006400] px-3 py-1.5 text-xs font-medium uppercase tracking-wide text-white hover:opacity-90"
              >
                Enregistrer
              </button>
            </form>
            <div className="mt-2 flex justify-end">
              <ConfirmSubmitButton
                action={deleteZone}
                hiddenFields={{ id: zone.id }}
                confirmMessage={`Supprimer la zone "${zone.name}" ?`}
                label="Supprimer"
                className="text-xs text-[#DC143C] hover:underline"
              />
            </div>
          </div>
        ))}
        {(!zones || zones.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucune zone pour le moment.</p>
        )}
      </div>

      <div className="mt-10 max-w-lg rounded-md border border-[#D8D3C9] p-5">
        <h2 className="text-sm font-medium uppercase tracking-wide text-[#181715]">Nouvelle zone</h2>
        <form action={addZone} className="mt-4 space-y-3">
          <input
            name="name"
            placeholder="Nom (ex: Porto-Novo)"
            required
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <input
            name="fee"
            type="number"
            step="1"
            placeholder="Frais (FCFA)"
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <input
            name="sort_order"
            type="number"
            defaultValue={0}
            placeholder="Ordre d'affichage"
            className="w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="is_default" />
            Zone par défaut
          </label>
          <button
            type="submit"
            className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
          >
            Créer
          </button>
        </form>
      </div>
    </AdminShell>
  );
}
