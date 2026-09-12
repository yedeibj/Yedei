"use client";

import { useState } from "react";
import Link from "next/link";
import InstallAppButtons from "./InstallAppButtons";

type FooterCategory = {
  id: string;
  label: string;
  slug: string;
  children: { id: string; label: string; slug: string }[];
};

type InfoLink = { label: string; href: string };

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "TikTok", href: "https://tiktok.com" },
];

export default function FooterClient({
  categories,
  infoLinks,
}: {
  categories: FooterCategory[];
  infoLinks: InfoLink[];
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-container px-6 py-16 md:px-10">
        {/* Logo + description */}
        <div className="mb-12 flex flex-col gap-6 border-b border-paper/15 pb-12 md:flex-row md:items-center md:justify-between">
          <img src="/logo-white.png" alt="YEDEI" className="h-12 w-auto self-start" />
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
                  onClick={() => setOpenSlug(isOpen ? null : category.slug)}
                  aria-expanded={isOpen}
                >
                  <Link
                    href={`/collections/${category.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="font-display text-lg italic hover:underline"
                  >
                    {category.label}
                  </Link>
                  {category.children.length > 0 && (
                    <span className="md:hidden" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  )}
                </button>
                {category.children.length > 0 && (
                  <ul
                    className={`flex flex-col gap-2 overflow-hidden text-sm text-paper/60 transition-all md:mt-4 md:max-h-none md:opacity-100 ${
                      isOpen ? "mt-3 max-h-40 opacity-100" : "max-h-0 opacity-0 md:opacity-100"
                    }`}
                  >
                    {category.children.map((child) => (
                      <li key={child.id}>
                        <Link href={`/collections/${child.slug}`} className="hover:text-paper">
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Pages légales — une ligne sur desktop, accordéon sur mobile */}
        {infoLinks.length > 0 && (
          <div className="mt-12 border-t border-paper/15 pt-8">
            {/* Mobile : accordéon */}
            <div className="md:hidden">
              <button
                type="button"
                onClick={() => setLegalOpen((open) => !open)}
                className="flex w-full items-center justify-between py-2 text-left"
                aria-expanded={legalOpen}
              >
                <span className="font-display text-lg italic">Informations légales</span>
                <span aria-hidden="true">{legalOpen ? "−" : "+"}</span>
              </button>
              <ul
                className={`flex flex-col gap-2 overflow-hidden text-sm text-paper/70 transition-all ${
                  legalOpen ? "mt-3 max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {infoLinks.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="hover:text-paper">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Desktop : une seule ligne */}
            <ul className="hidden flex-wrap items-center gap-x-6 gap-y-2 text-sm text-paper/70 md:flex">
              {infoLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-paper">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Téléchargement app + réseaux sociaux, côte à côte sur desktop */}
        <div className="mt-8 flex flex-col gap-8 border-t border-paper/15 pt-10 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="font-display text-xl italic">
              Télécharger l&apos;application YEDEI
            </h3>
            <p className="mt-2 max-w-md text-sm text-paper/60">
              Installez YEDEI directement depuis le site, sans passer par une
              boutique d&apos;applications.
            </p>
            <InstallAppButtons />
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-paper/70 md:flex-col md:items-end md:gap-2">
            {socialLinks.map((link) => (
              <li key={link.href}>
                <a href={link.href} target="_blank" rel="noreferrer" className="hover:text-paper">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-12 text-xs text-paper/40">
          © {new Date().getFullYear()} YEDEI. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
}
