"use client";

import { useState } from "react";
import { sendContactMessage } from "@/app/contact/actions";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSent, setIsSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await sendContactMessage({ name, email, phone, message });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    setIsSent(true);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
  }

  if (isSent) {
    return (
      <div className="rounded-md border border-[#006400] bg-[#E8F5E9] p-6 text-center">
        <p className="font-display text-lg italic text-[#006400]">Message envoyé, merci !</p>
        <p className="mt-2 text-sm text-[#8C8579]">
          Nous te répondrons dans les meilleurs délais.
        </p>
        <button
          type="button"
          onClick={() => setIsSent(false)}
          className="mt-4 text-sm text-[#006400] underline"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs uppercase tracking-wide text-[#181715]">
          Nom complet
        </label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs uppercase tracking-wide text-[#181715]">
            Email (optionnel)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wide text-[#181715]">
            Téléphone (optionnel)
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wide text-[#181715]">
          Message
        </label>
        <textarea
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
        />
      </div>

      {error && <p className="text-sm text-[#DC143C]">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-[#006400] py-3 text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-50 sm:w-auto sm:px-10"
      >
        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
