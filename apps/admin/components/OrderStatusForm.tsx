"use client";

import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_OPTIONS = [
  { value: "en_attente", label: "En attente" },
  { value: "confirmee", label: "Confirmée" },
  { value: "expediee", label: "Expédiée" },
  { value: "livree", label: "Livrée" },
  { value: "annulee", label: "Annulée" },
];

const PAYMENT_OPTIONS = [
  { value: "impaye", label: "Non payé" },
  { value: "paye", label: "Payé" },
];

export default function OrderStatusForm({
  orderId,
  status,
  paymentStatus,
}: {
  orderId: string;
  status: string;
  paymentStatus: string;
}) {
  const router = useRouter();
  const [localStatus, setLocalStatus] = useState(status);
  const [localPayment, setLocalPayment] = useState(paymentStatus);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    const supabase = createBrowserSupabaseClient();
    await supabase
      .from("orders")
      .update({ status: localStatus, payment_status: localPayment })
      .eq("id", orderId);
    setIsSaving(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={localStatus}
        onChange={(e) => setLocalStatus(e.target.value)}
        className="rounded-md border border-[#D8D3C9] bg-white px-2 py-1.5 text-xs outline-none focus:border-[#006400]"
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <select
        value={localPayment}
        onChange={(e) => setLocalPayment(e.target.value)}
        className="rounded-md border border-[#D8D3C9] bg-white px-2 py-1.5 text-xs outline-none focus:border-[#006400]"
      >
        {PAYMENT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="rounded-md bg-[#006400] px-3 py-1.5 text-xs uppercase tracking-wide text-white hover:opacity-90 disabled:opacity-50"
      >
        {isSaving ? "..." : "Enregistrer"}
      </button>
    </div>
  );
}
