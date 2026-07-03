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
    slug: "femmes",
    label: "Femmes",
    description: "Robes, ensembles et essentiels du quotidien",
    image: "https://picsum.photos/seed/yedei-femmes/1200/1500",
    subcategories: [
      { label: "Robes", href: "/femmes/robes" },
      { label: "Ensembles", href: "/femmes/ensembles" },
      { label: "Sous-vêtements", href: "/femmes/sous-vetements" },
    ],
  },
  {
    slug: "hommes",
    label: "Hommes",
    description: "Chemises, pantalons et pièces intemporelles",
    image: "https://picsum.photos/seed/yedei-hommes/1200/1500",
    subcategories: [
      { label: "Chemises", href: "/hommes/chemises" },
      { label: "Pantalons", href: "/hommes/pantalons" },
      { label: "T-shirts", href: "/hommes/t-shirts" },
    ],
  },
  {
    slug: "enfants",
    label: "Enfants",
    description: "Tenues robustes et élégantes pour grandir",
    image: "https://picsum.photos/seed/yedei-enfants/1200/1500",
    subcategories: [
      { label: "Ensembles", href: "/enfants/ensembles" },
      { label: "Tenues scolaires", href: "/enfants/tenues-scolaires" },
    ],
  },
  {
    slug: "bebes",
    label: "Bébés",
    description: "Douceur et confort dès les premiers jours",
    image: "https://picsum.photos/seed/yedei-bebes/1200/1500",
    subcategories: [
      { label: "Bodies", href: "/bebes/bodies" },
      { label: "Pyjamas", href: "/bebes/pyjamas" },
    ],
  },
];
