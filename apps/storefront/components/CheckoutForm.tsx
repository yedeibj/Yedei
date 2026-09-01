"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/app/commande/actions";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

function formatFcfa(value: number) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

export default function CheckoutForm({ deliveryFee }: { deliveryFee: number }) {
  const { items, totalPrice, clearCart } = useCart();
  const total = totalPrice + deliveryFee;

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"livraison" | "fedapay">("fedapay");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await createOrder({
      customerName,
      phone,
      email,
      address,
      city,
      notes,
      paymentMethod,
      deliveryFee,
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name,
        size: item.size,
        variantLabel: item.variantLabel,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
    });

    if (result.error) {
      setIsSubmitting(false);
      setError(result.error);
      return;
    }

    clearCart();

    if (result.paymentUrl) {
      window.location.href = result.paymentUrl;
      return;
    }

    setIsSubmitting(false);
    setConfirmedOrderId(result.orderId ?? null);
  }

  if (confirmedOrderId) {
    const reference = confirmedOrderId.slice(0, 8).toUpperCase();
    return (
      <main>
        <Header />
        <div className="mx-auto max-w-lg px-6 py-20 text-center sm:px-12">
          <span className="flex justify-center gap-[3px]" aria-hidden="true">
            <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
            <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
            <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
          </span>
          <h1 className="mt-4 font-display text-3xl italic text-[#181715]">
            Merci pour ta commande !
          </h1>
          <p className="mt-3 text-sm text-[#8C8579]">
            Référence de commande : <span className="text-[#181715]">#{reference}</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-[#8C8579]">
            Nous allons te contacter très vite au numéro fourni pour confirmer la livraison.
            Paiement à la livraison.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-md bg-[#006400] px-6 py-3 text-sm uppercase tracking-wide text-white hover:opacity-90"
          >
            Retour à l'accueil
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main>
        <Header />
        <div className="px-6 py-16 text-center sm:px-12">
          <p className="text-sm text-[#8C8579]">Ton panier est vide.</p>
          <Link href="/" className="mt-3 inline-block text-sm text-[#006400] underline">
            Continuer mes achats
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Header />
      <div className="grid grid-cols-1 gap-10 px-6 py-10 sm:px-12 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-2xl italic text-[#181715]">Finaliser la commande</h1>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs uppercase tracking-wide text-[#181715]">
                Nom complet
              </label>
              <input
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wide text-[#181715]">
                  Téléphone
                </label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
                />
              </div>
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
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-[#181715]">
                Adresse de livraison
              </label>
              <input
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Quartier, rue, repère..."
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-[#181715]">
                Ville
              </label>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-[#181715]">
                Note (optionnel)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Instructions de livraison, préférence horaire..."
                className="mt-1 w-full rounded-md border border-[#D8D3C9] px-3 py-2 text-sm outline-none focus:border-[#006400]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wide text-[#181715]">
                Mode de paiement
              </label>
              <div className="mt-2 space-y-2">
                <label className="flex items-center gap-3 rounded-md border border-[#D8D3C9] px-3 py-3 text-sm has-[:checked]:border-[#006400] has-[:checked]:bg-[#E8F5E9]">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === "fedapay"}
                    onChange={() => setPaymentMethod("fedapay")}
                  />
                  Payer en ligne maintenant (carte bancaire, Mobile Money)
                </label>
                <label className="flex items-center gap-3 rounded-md border border-[#D8D3C9] px-3 py-3 text-sm has-[:checked]:border-[#006400] has-[:checked]:bg-[#E8F5E9]">
