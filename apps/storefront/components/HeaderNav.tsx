"use client";

import { useState } from "react";
import Link from "next/link";
import CartIndicator from "./CartIndicator";

type NavCategory = {
  id: string;
  label: string;
  slug: string;
  children: { id: string; label: string; slug: string }[];
};

export default function HeaderNav({ categories }: { categories: NavCategory[] }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-light/60 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-container items-center justify-between px-6 py-4 md:px-10">
        {/* Logo */}
        <Link href="/">
          <img src="/logo.png" alt="YEDEI" className="h-12 w-auto sm:h-14" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-10">
            <li>
              <Link
                href="/"
                className="text-sm uppercase tracking-widest2 text-ink/80 transition-colors hover:text-ink"
              >
                Accueil
              </Link>
            </li>
            {categories.map((cat) => (
              <li key={cat.id} className="group relative">
                <Link
                  href={`/collections/${cat.slug}`}
                  className="text-sm uppercase tracking-widest2 text-ink/80 transition-colors hover:text-ink"
                >
                  {cat.label}
                </Link>
                {cat.children.length > 0 && (
                  <div className="invisible absolute left-1/2 top-full z-10 -translate-x-1/2 pt-3 opacity-0 transition-opacity group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-[180px] rounded-md border border-stone-light/60 bg-paper py-2 shadow-lg">
                      {cat.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/collections/${child.slug}`}
                            className="block px-4 py-2 text-sm text-ink/80 hover:bg-sand hover:text-ink"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
          <div className="text-ink/80 transition-colors hover:text-ink">
            <CartIndicator />
          </div>
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
                   <ul className="flex flex-col gap-1">
            <li className="border-b border-stone-light/40 py-2">
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="font-display text-xl text-ink"
              >
                Accueil
              </Link>
            </li>
            {categories.map((cat) => {
              const isSubOpen = openMobileSubmenu === cat.id;
              return (
                <li key={cat.id} className="border-b border-stone-light/40 py-2 last:border-0">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/collections/${cat.slug}`}
                      onClick={() => setMenuOpen(false)}
                      className="font-display text-xl text-ink"
                    >
                      {cat.label}
                    </Link>
                    {cat.children.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setOpenMobileSubmenu(isSubOpen ? null : cat.id)}
                        aria-label="Afficher les sous-catégories"
                        className="px-2 text-lg text-ink/60"
                      >
                        {isSubOpen ? "−" : "+"}
                      </button>
                    )}
                  </div>
                  {isSubOpen && (
                    <ul className="mt-2 flex flex-col gap-2 pl-3">
                      {cat.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/collections/${child.slug}`}
                            onClick={() => setMenuOpen(false)}
                            className="text-sm text-ink/70"
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
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
