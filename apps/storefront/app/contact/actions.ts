"use server";

import { createClient as createServerSupabaseClient } from "@yedei/database/server";
import { escapeHtml, sendNotificationEmail } from "@/lib/notify";

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

  const email = input.email?.trim() ?? "";
  const looksLikeEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const phone = input.phone?.trim() ?? "";

  const html =
    "<h2>Nouveau message de contact</h2>" +
    "<p><strong>Nom :</strong> " +
    escapeHtml(input.name.trim()) +
    "<br>" +
    "<strong>Email :</strong> " +
    escapeHtml(email || "non renseigné") +
    "<br>" +
    "<strong>Téléphone :</strong> " +
    escapeHtml(phone || "non renseigné") +
    "</p>" +
    "<p>" +
    escapeHtml(input.message.trim()).replace(/\n/g, "<br>") +
    "</p>" +
    "<p>Retrouve aussi ce message dans l'espace admin, page Messages.</p>";

  await sendNotificationEmail("Nouveau message de " + input.name.trim(), html, {
    replyTo: looksLikeEmail ? email : undefined,
  });

  return { success: true };
}
