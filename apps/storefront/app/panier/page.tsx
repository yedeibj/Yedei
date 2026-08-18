"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <main>
      <Header />
      <div className="px-6 py-10 sm:px-12">
        <h1 className="font-display text-2xl italic text-[#181715]">Mon panier</h1>

        {items.length === 0 ? (
          <p className="mt-6 text-sm text-[#8C8579]">
            Ton panier est vide.{" "}
            <Link href="/" className="text-[#006400] underline">
              Continuer mes achats
            </Link>
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId + item.variantId}
                className="flex items-center gap-4 border-b border-[#F0EDE5] pb-4"
              >
                <div className="h-20 w-20 overflow-hidden rounded-md bg-white">
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="h-full w-full object-contain" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-[#181715]">{item.name}</p>
                  <p className="text-xs text-[#8C8579]">
                    Taille : {item.size}
                    {item.variantLabel && ` — ${item.variantLabel}`}
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                      className="rounded border border-[#D8D3C9] px-2 text-xs"
                    >
                      −
                    </button>
                    <span className="text-xs">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                      className="rounded border border-[#D8D3C9] px-2 text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-sm text-[#181715]">
                  {(item.price * item.quantity).toLocaleString("fr-FR")} FCFA
                </p>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, item.variantId)}
                  className="text-xs text-[#DC143C] hover:underline"
                >
                  Retirer
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between pt-4">
              <p className="text-sm font-medium text-[#181715]">Total</p>
              <p className="text-lg text-[#181715]">{totalPrice.toLocaleString("fr-FR")} FCFA</p>
            </div>

            <Link
              href="/commande"
              className="block w-full rounded-md bg-[#006400] py-3 text-center text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
            >
              Passer la commande
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
