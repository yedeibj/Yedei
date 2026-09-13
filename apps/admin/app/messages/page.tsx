import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { revalidatePath } from "next/cache";
import AdminShell from "@/components/AdminShell";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

async function markAsRead(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/messages");
}

async function deleteMessage(formData: FormData) {
  "use server";
  const supabase = await createServerSupabaseClient();
  const id = String(formData.get("id"));
  if (!id) return;
  await supabase.from("contact_messages").delete().eq("id", id);
  revalidatePath("/messages");
}

export default async function MessagesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("id, name, email, phone, message, is_read, created_at")
    .order("created_at", { ascending: false });

  return (
    <AdminShell>
      <h1 className="font-display text-2xl italic text-[#181715]">Messages de contact</h1>
      <p className="mt-1 text-sm text-[#8C8579]">
        Messages envoyés depuis le formulaire de contact du site.
      </p>

      <div className="mt-8 space-y-4">
        {(messages ?? []).map((msg) => (
          <div key={msg.id} className="rounded-md border border-[#D8D3C9] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[#181715]">
                  {msg.name}
                  {!msg.is_read && (
                    <span className="ml-2 rounded-full bg-[#FDECEF] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[#DC143C]">
                      Nouveau
                    </span>
                  )}
                </p>
                <p className="text-xs text-[#8C8579]">
                  {msg.email || "Pas d'email"}
                  {msg.phone ? " · " + msg.phone : ""}
                </p>
                <p className="text-[10px] text-[#8C8579]">
                  {new Date(msg.created_at).toLocaleString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!msg.is_read && (
                  <form action={markAsRead}>
                    <input type="hidden" name="id" value={msg.id} />
                    <button type="submit" className="text-xs text-[#006400] hover:underline">
                      Marquer comme lu
                    </button>
                  </form>
                )}
                <ConfirmSubmitButton
                  action={deleteMessage}
                  hiddenFields={{ id: msg.id }}
                  confirmMessage="Supprimer ce message ?"
                  label="Supprimer"
                  className="text-xs text-[#DC143C] hover:underline"
                />
              </div>
            </div>
            <p className="mt-3 text-sm text-[#181715]">{msg.message}</p>
          </div>
        ))}
        {(!messages || messages.length === 0) && (
          <p className="text-sm text-[#8C8579]">Aucun message pour le moment.</p>
        )}
      </div>
    </AdminShell>
  );
}
