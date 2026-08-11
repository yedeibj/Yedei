"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartIndicator() {
  const { totalItems } = useCart();

  return (
    <Link href="/panier" className="relative inline-flex items-center">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M6 6h15l-1.5 9h-12L6 6Z" />
        <path d="M6 6 5 3H2" />
        <circle cx="9" cy="20" r="1" />
        <circle cx="17" cy="20" r="1" />
      </svg>
      {totalItems > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#006400] text-[10px] text-white">
          {totalItems}
        </span>
      )}
    </Link>
  );
}
