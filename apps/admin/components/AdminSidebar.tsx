"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Tableau de bord" },
  { href: "/produits", label: "Produits" },
  { href: "/categories", label: "Catégories" },
  { label: "Hero (accueil)", href: "/hero" },
  { href: "/promotions", label: "Promotions" },
  { href: "/collection-saison", label: "Collection de saison" },
  { label: "Textes accueil", href: "/textes-accueil" },
  { href: "/promo", label: "Barre promotionnelle" },
  { label: "Commandes", href: "/commandes" },
  { label: "Réglages", href: "/reglages" },
  { href: "/avis", label: "Avis clients" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-56 flex-shrink-0 flex-col gap-1 border-r border-[#D8D3C9] bg-white px-4 py-6">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-[#E8F5E9] font-medium text-[#006400]"
                : "text-[#8C8579] hover:bg-[#F6F3EC] hover:text-[#181715]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
