"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

function formatFcfa(value: number) {
  return value.toLocaleString("fr-FR") + " FCFA";
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } = useCart();

  return (
    <>
      {/* Fond assombri */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* Tiroir */}
      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
        aria-label="Panier"
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-[#F0EDE5] px-5 py-4">
          <h2 className="font-display text-xl italic text-[#181715]">
            Mon panier {items.length > 0 && `(${items.length})`}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Fermer le panier"
            className="text-2xl leading-none text-[#8C8579] hover:text-[#181715]"
          >
            ×
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm text-[#8C8579]">Ton panier est vide.</p>
            <button
              type="button"
              onClick={closeCart}
              className="mt-4 text-sm text-[#006400] underline"
            >
              Continuer mes achats
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.productId + item.variantId} className="flex gap-3 border-b border-[#F0EDE5] pb-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-white">
                      {item.imageUrl && (
                        <img src={item.imageUrl} alt="" className="h-full w-full object-contain" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-[#181715]">{item.name}</p>
                      <p className="mt-0.5 text-xs text-[#8C8579]">
                        Taille : {item.size}
                        {item.variantLabel && ` — ${item.variantLabel}`}
                      </p>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center rounded-md border border-[#D8D3C9]">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                            className="px-2 py-1 text-xs text-[#181715]"
                          >
                            −
                          </button>
                          <span className="px-2 text-xs">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.productId, item.variantId, item.quantity + 1)}
                            className="px-2 py-1 text-xs text-[#181715]"
                          >
                            +
                          </button>
                        </div>
                        <p className="text-sm text-[#181715]">
                          {formatFcfa(item.price * item.quantity)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="mt-2 text-xs text-[#DC143C] hover:underline"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#D8D3C9] px-5 py-4">
              <div className="flex items-center justify-between text-sm">
                <p className="font-medium text-[#181715]">Sous-total</p>
                <p className="text-[#181715]">{formatFcfa(totalPrice)}</p>
              </div>
              <p className="mt-1 text-xs text-[#8C8579]">
                Frais de livraison calculés à l'étape suivante.
              </p>

              <Link
                href="/commande"
                onClick={closeCart}
                className="mt-4 block w-full rounded-md bg-[#006400] py-3 text-center text-sm font-medium uppercase tracking-wide text-white transition-opacity hover:opacity-90"
              >
                Passer la commande
              </Link>
              <button
                type="button"
                onClick={closeCart}
                className="mt-2 block w-full text-center text-sm text-[#8C8579] hover:text-[#181715]"
              >
                Continuer mes achats
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
