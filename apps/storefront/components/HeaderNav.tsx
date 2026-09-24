"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CartIndicator from "./CartIndicator";
import { createClient as createBrowserSupabaseClient } from "@yedei/database/client";

type NavCategory = {
  id: string;
  label: string;
  slug: string;
  children: { id: string; label: string; slug: string }[];
};

type SearchResult = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl?: string;
};

export default function HeaderNav({ categories }: { categories: NavCategory[] }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [openMobileSubmenu, setOpenMobileSubmenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      const supabase = createBrowserSupabaseClient();
      const { data } = await supabase
        .from("products")
        .select("id, slug, name, price, product_images(url, sort_order)")
        .eq("is_active", true)
        .ilike("name", `%${query.trim()}%`)
        .limit(6);

      const mapped = (data ?? []).map((p: any) => {
        const sortedImages = [...(p.product_images ?? [])].sort(
          (a: any, b: any) => a.sort_order - b.sort_order
        );
        return {
          id: p.id,
          slug: p.slug,
          name: p.name,
          price: p.price,
          imageUrl: sortedImages[0]?.url,
        };
      });

      setResults(mapped);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function goToFullResults() {
    if (!query.trim()) return;
    setSearchOpen(false);
    router.push(`/recherche?q=${encodeURIComponent(query.trim())}`);
  }

  function formatFcfa(value: number) {
    return value.toLocaleString("fr-FR") + " FCFA";
  }

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
            <li>
              <Link
                href="/contact"
                className="text-sm uppercase tracking-widest2 text-ink/80 transition-colors hover:text-ink"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5">
          <button
            type="button"
            aria-label="Rechercher"
            onClick={() => setSearchOpen(true)}
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
            <li className="border-b border-stone-light/40 py-2">
              <Link
                href="/contact"
                onClick={() => setMenuOpen(false)}
                className="font-display text-xl text-ink"
              >
                Contact
              </Link>
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-6 border-t border-stone-light/60 pt-6">
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                setSearchOpen(true);
              }}
              className="flex items-center gap-2 text-sm text-ink/80"
            >
              <SearchIcon /> Rechercher
            </button>
            <button type="button" className="flex items-center gap-2 text-sm text-ink/80">
              <UserIcon /> Compte
            </button>
          </div>
        </nav>
      )}

      {/* Panneau de recherche */}
      {searchOpen && (
        <div className="fixed inset-0 z-[80]">
          <div
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-black/40"
            aria-hidden="true"
          />
          <div className="relative mx-auto mt-0 max-w-2xl bg-paper px-6 py-6 shadow-xl sm:mt-16 sm:rounded-2xl sm:px-8">
            <div className="flex items-center gap-3">
              <SearchIcon />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && goToFullResults()}
                placeholder="Rechercher un produit..."
                className="flex-1 border-none bg-transparent text-lg text-ink outline-none placeholder:text-ink/40"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                aria-label="Fermer la recherche"
                className="text-2xl leading-none text-ink/50 hover:text-ink"
              >
                ×
              </button>
            </div>

            <div className="mt-4 max-h-[60vh] overflow-y-auto border-t border-stone-light/60 pt-4">
              {isSearching && <p className="text-sm text-ink/50">Recherche...</p>}

              {!isSearching && query.trim() && results.length === 0 && (
                <p className="text-sm text-ink/50">Aucun résultat pour "{query}".</p>
              )}

              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/produits/${product.slug}`}
                  onClick={() => setSearchOpen(false)}
                  className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-sand"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-white">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt="" className="h-full w-full object-contain" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-ink">{product.name}</p>
                    <p className="text-xs text-ink/50">{formatFcfa(product.price)}</p>
                  </div>
                </Link>
              ))}

              {query.trim() && results.length > 0 && (
                <button
                  type="button"
                  onClick={goToFullResults}
                  className="mt-2 w-full rounded-md border border-stone-light/60 py-2 text-center text-xs uppercase tracking-wide text-ink/70 hover:border-ink hover:text-ink"
                >
                  Voir tous les résultats pour "{query}"
                </button>
              )}
            </div>
          </div>
        </div>
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
