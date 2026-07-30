export type HeroSlide = {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

// ⚠️ Place tes images dans /public/hero/ (ex: slide-homme.jpg)
export const heroSlides: HeroSlide[] = [
  {
    id: "slide-homme",
    image: "/hero/slide-homme.jpg",
    eyebrow: "Collection Homme",
    title: "L'élégance sur mesure",
    description: "Des coupes soignées, pensées pour durer.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/homme",
  },
  {
    id: "slide-femme",
    image: "/hero/slide-femme.jpg",
    eyebrow: "Collection Femme",
    title: "La grâce en mouvement",
    description: "Des silhouettes intemporelles pour chaque saison.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/femme",
  },
  {
    id: "slide-enfant",
    image: "/hero/slide-enfant.jpg",
    eyebrow: "Collection Enfant",
    title: "Grandir avec style",
    description: "Confort et caractère, dès les premiers pas.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/enfant",
  },
  {
    id: "slide-bebe",
    image: "/hero/slide-bebe.jpg",
    eyebrow: "Collection Bébé",
    title: "Douceur dès la naissance",
    description: "Des matières précieuses pour les tout-petits.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/bebe",
  },
  {
    id: "slide-nouveautes",
    image: "/hero/slide-nouveautes.jpg",
    eyebrow: "Nouveautés",
    title: "La saison qui commence",
    description: "Les dernières pièces arrivées en boutique.",
    ctaLabel: "Voir les nouveautés",
    ctaHref: "/nouveautes",
  },
];
