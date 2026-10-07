const RESEND_API_URL = "https://api.resend.com/emails";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function sendNotificationEmail(
  subject: string,
  html: string,
  options?: { replyTo?: string }
) {
  const apiKey = process.env.RESEND_API_KEY;
  const toRaw = process.env.NOTIFY_EMAIL_TO;

  if (!apiKey || !toRaw) {
    console.error("Notification ignorée : RESEND_API_KEY ou NOTIFY_EMAIL_TO manquante.");
    return;
  }

  const to = toRaw.split(",").map((addr) => addr.trim()).filter(Boolean);

  try {
    const payload: Record<string, unknown> = {
      from: "YEDEI <onboarding@resend.dev>",
      to,
      subject,
      html,
    };
    if (options?.replyTo) payload.reply_to = options.replyTo;

    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Resend a refusé l'envoi :", res.status, body);
    }
  } catch (err) {
    console.error("Erreur lors de l'envoi de la notification :", err);
  }
}
