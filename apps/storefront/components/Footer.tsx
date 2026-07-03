"use client";

import { useState } from "react";
import Link from "next/link";
import FilYedei from "./FilYedei";
import { categories } from "@/data/categories";

const infoLinks = [
  { label: "Contact", href: "/contact" },
  { label: "Livraison", href: "/livraison" },
  { label: "Paiement", href: "/paiement" },
];

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export default function Footer() {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-container px-6 py-16 md:px-10">
        <div className="mb-12 flex flex-col gap-6 border-b border-paper/15 pb-12 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-display text-2xl">YEDEI</span>
            <FilYedei className="mt-3" />
          </div>
          <p className="max-w-sm text-sm text-paper/60">
            Vêtements pour hommes, femmes, enfants et bébés. Conçus avec soin,
            pensés pour durer.
          </p>
        </div>

        {/* Catégories — accordéon mobile / colonnes desktop */}
        <div className="grid gap-8 md:grid-cols-4">
          {categories.map((category) => {
            const isOpen = openSlug === category.slug;
            return (
              <div
                key={category.slug}
                className="border-b border-paper/15 pb-4 md:border-none md:pb-0"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-2 text-left md:pointer-events-none md:py-0"
                  onClick={() =>
                    setOpenSlug(isOpen ? null : category.slug)
                  }
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-lg italic">
                    {category.label}
                  </span>
                  <span className="md:hidden" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <ul
                  className={`flex flex-col gap-2 overflow-hidden text-sm text-paper/60 transition-all md:mt-4 md:max-h-none md:opacity-100 ${
                    isOpen ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
                  }`}
                >
                  {category.subcategories.map((sub) => (
                    <li key={sub.href}>
                      <Link href={sub.href} className="hover:text-paper">
                        {sub.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Infos + réseaux sociaux */}
        <div className="mt-12 flex flex-col gap-8 border-t border-paper/15 pt-10 sm:flex-row sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
            {infoLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="hover:text-paper">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-paper"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Téléchargement application */}
        <div className="mt-12 border-t border-paper/15 pt-10">
          <h3 className="font-display text-xl italic">
            Télécharger l&apos;application YEDEI
          </h3>
          <p className="mt-2 max-w-md text-sm text-paper/60">
            Installez YEDEI directement depuis le site, sans passer par une
            boutique d&apos;applications.
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <a
              href="/app/yedei-android.apk"
              className="border border-paper/40 px-6 py-3 text-xs uppercase tracking-widest2 transition-colors hover:bg-paper hover:text-ink"
            >
              Télécharger sur Android
            </a>
            <a
              href="/installation-iphone"
              className="border border-paper/40 px-6 py-3 text-xs uppercase tracking-widest2 transition-colors hover:bg-paper hover:text-ink"
            >
              Télécharger sur iPhone
            </a>
          </div>
        </div>

        <p className="mt-12 text-xs text-paper/40">
          © {new Date().getFullYear()} YEDEI. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
