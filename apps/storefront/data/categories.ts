export type Subcategory = {
  label: string;
  href: string;
};

export type Category = {
  slug: string;
  label: string;
  description: string;
  image: string;
  subcategories: Subcategory[];
};

// Données statiques temporaires — à remplacer par un appel base de données / CMS.
export const categories: Category[] = [
  {
    slug: "femme",
    label: "Femmes",
    description: "Robes, ensembles et essentiels du quotidien",
    image: "https://picsum.photos/seed/yedei-femmes/1200/1500",
    subcategories: [
      { label: "Robes", href: "/collections/femme" },
      { label: "Ensembles", href: "/collections/femme" },
      { label: "Sous-vêtements", href: "/collections/femme" },
    ],
  },
  {
    slug: "homme",
    label: "Hommes",
    description: "Chemises, pantalons et pièces intemporelles",
    image: "https://picsum.photos/seed/yedei-hommes/1200/1500",
    subcategories: [
      { label: "Chemises", href: "/collections/homme" },
      { label: "Pantalons", href: "/collections/homme" },
      { label: "T-shirts", href: "/collections/homme" },
    ],
  },
  {
    slug: "enfant",
    label: "Enfants",
    description: "Tenues robustes et élégantes pour grandir",
    image: "https://picsum.photos/seed/yedei-enfants/1200/1500",
    subcategories: [
      { label: "Fille", href: "/collections/enfant-fille" },
      { label: "Garçon", href: "/collections/enfant-garcon" },
    ],
  },
  {
    slug: "bebe",
    label: "Bébés",
    description: "Douceur et confort dès les premiers jours",
    image: "https://picsum.photos/seed/yedei-bebes/1200/1500",
    subcategories: [
      { label: "Bodies", href: "/collections/bebe" },
      { label: "Pyjamas", href: "/collections/bebe" },
    ],
  },
];
