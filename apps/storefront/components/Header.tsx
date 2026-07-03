"use client";

import { useState } from "react";
import Link from "next/link";
import FilYedei from "./FilYedei";
import { categories } from "@/data/categories";

const navLinks = categories.map((c) => ({ label: c.label, href: `/${c.slug}` }));

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-light/60 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <Link href="/" className="flex flex-col items-start gap-1.5">
          <span className="font-display text-2xl tracking-wide text-ink">
            YEDEI
          </span>
          <FilYedei />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm uppercase tracking-widest2 text-ink/80 transition-colors hover:text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Rechercher"
            className="hidden text-ink/80 transition-colors hover:text-ink md:block"
          >
            <SearchIcon />
          </button>
          <button
            type="button"
            aria-label="Mon compte"
            className="hidden text-ink/80 transition-colors hover:text-ink md:block"
          >
            <UserIcon />
          </button>
          <button
            type="button"
            aria-label="Voir le panier"
            className="text-ink/80 transition-colors hover:text-ink"
          >
            <BagIcon />
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="text-ink/80 transition-colors hover:text-ink md:hidden"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav
          aria-label="Navigation mobile"
          className="border-t border-stone-light/60 bg-paper px-6 py-6 md:hidden"
        >
          <ul className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="font-display text-xl text-ink"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center gap-6 border-t border-stone-light/60 pt-6">
            <button type="button" className="flex items-center gap-2 text-sm text-ink/80">
              <SearchIcon /> Rechercher
            </button>
            <button type="button" className="flex items-center gap-2 text-sm text-ink/80">
              <UserIcon /> Compte
            </button>
          </div>
        </nav>
      )}
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 6-6 8-6s6.5 2 8 6" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 8h12l-1 12H7L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 016 0v2" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
