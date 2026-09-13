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
  { label: "Zones de livraison", href: "/zones-livraison" },
  { label: "Reglages", href: "/reglages" },
  { label: "Messages", href: "/messages" },
  { href: "/avis", label: "Avis clients" },
  { label: "Pages légales", href: "/pages-legales" },
];

export default function AdminSidebar({ unreadMessages = 0 }: { unreadMessages?: number }) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full w-56 flex-shrink-0 flex-col gap-1 border-r border-[#D8D3C9] bg-white px-4 py-6">
      {links.map((link) => {
        const isActive =
          link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
        const label =
          link.href === "/messages" && unreadMessages > 0
            ? `${link.label} (${unreadMessages})`
            : link.label;
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
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
