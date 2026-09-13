"use server";

import { createClient as createServerSupabaseClient } from "@yedei/database/server";

export async function sendContactMessage(input: {
  name: string;
  email?: string;
  phone?: string;
  message: string;
}) {
  if (!input.name.trim() || !input.message.trim()) {
    return { error: "Merci de remplir ton nom et ton message." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("contact_messages").insert({
    name: input.name.trim(),
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    message: input.message.trim(),
  });

  if (error) {
    return { error: "Erreur lors de l'envoi du message. Réessaie dans un instant." };
  }

  return { success: true };
}
