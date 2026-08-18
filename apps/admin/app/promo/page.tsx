import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";

async function addMessage(formData: FormData) {
  "use server";
  const text = formData.get("text") as string;
  if (!text?.trim()) return;

  const supabase = await createServerSupabaseClient();
  await supabase.from("promo_messages").insert({ text: text.trim() });
  revalidatePath("/promo");
}

async function toggleMessage(id: string, current: boolean) {
  "use server";
  const supabase = await createServerSupabaseClient();
  await supabase.from("promo_messages").update({ is_active: !current }).eq("id", id);
  revalidatePath("/promo");
}

async function deleteMessage(id: string) {
  "use server";
  const supabase = await createServerSupabaseClient();
  await supabase.from("promo_messages").delete().eq("id", id);
  revalidatePath("/promo");
}

export default async function PromoMessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: messages } = await supabase
    .from("promo_messages")
    .select("id, text, is_active, sort_order")
    .order("sort_order");

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">
        Barre promotionnelle
      </h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Ces messages défilent en haut du site. Active/désactive-les ou ajoutes-en.
      </p>

      <form action={addMessage} className="mt-6 flex gap-3">
        <input
          type="text"
          name="text"
          required
          placeholder="Ex: Livraison offerte dès 50 000 FCFA"
          className="flex-1 rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
        />
        <button
          type="submit"
          className="rounded-md bg-[#006400] px-4 py-2 text-sm font-medium uppercase tracking-wide text-white hover:opacity-90"
        >
          Ajouter
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[#D8D3C9] text-xs uppercase tracking-wide text-[#8C8579]">
            <tr>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(!messages || messages.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-[#8C8579]">
                  Aucun message pour l'instant.
                </td>
              </tr>
            )}
            {messages?.map((msg) => (
              <tr key={msg.id} className="border-b border-[#F0EDE5] last:border-0">
                <td className="px-4 py-3 text-[#181715]">{msg.text}</td>
                <td className="px-4 py-3">
                  <form action={toggleMessage.bind(null, msg.id, msg.is_active)}>
                    <button
                      type="submit"
                      className={`rounded-full px-2 py-1 text-xs ${
                        msg.is_active
                          ? "bg-[#E8F5E9] text-[#006400]"
                          : "bg-[#F0EDE5] text-[#8C8579]"
                      }`}
                    >
                      {msg.is_active ? "Actif" : "Inactif"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deleteMessage.bind(null, msg.id)}>
                    <button type="submit" className="text-xs text-[#DC143C] hover:underline">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
