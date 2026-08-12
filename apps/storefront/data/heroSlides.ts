export type HeroSlide = {
  id: string;
  image: string;
  eyebrow?: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  active?: boolean;
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
    active: false,
  },
  {
    id: "slide-femme",
    image: "/hero/slide-femme.jpg",
    eyebrow: "Collection Femme",
    title: "La grâce en mouvement",
    description: "Des silhouettes intemporelles pour chaque saison.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/femme",
    active: false,
  },
  {
    id: "slide-enfant",
    image: "",
    eyebrow: "Collection Enfant",
    title: "Grandir avec style",
    description: "Confort et caractère, dès les premiers pas.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/enfant",
    active: false,
  },
  {
    id: "slide-bebe",
    image: "/hero/slide-bebe.jpg",
    eyebrow: "Collection Bébé",
    title: "Douceur dès la naissance",
    description: "Des matières précieuses pour les tout-petits.",
    ctaLabel: "Découvrir la collection",
    ctaHref: "/collections/bebe",
    active: false,
  },
   {
  id: "slide-scolaire",
  image: "https://wrnzexenkzxemdwhatwr.supabase.co/storage/v1/object/public/hero/WhatsApp%20Image%202026-08-10%20at%2016.58.52.jpeg",
  eyebrow: "Tenues scolaires",
  title: "La rentrée au collège",
  description: "Découvrez nos tenues scolaires pensées pour accompagner les collégiens avec style et confort.",
  ctaLabel: "Voir les tenues scolaires",
  ctaHref: "/scolaire",
},

{
  id: "slide-rentree",
  image: "https://wrnzexenkzxemdwhatwr.supabase.co/storage/v1/object/public/hero/WhatsApp%20Image%202026-08-11%20at%2002.07.00.jpeg",
  eyebrow: "Collection Scolaire",
  title: "Prêts pour la rentrée",
  description: "Pantalons, jupes-culottes et tenues scolaires pour filles et garçons du collège.",
  ctaLabel: "Découvrir la collection",
  ctaHref: "/scolaire",
},

  
  {
    id: "slide-nouveautes",
    image: "https:",
    eyebrow: "Nouveautés",
    title: "La saison qui commence",
    description: "Les dernières pièces arrivées en boutique.",
    ctaLabel: "Voir les nouveautés",
    ctaHref: "/nouveautes",
    active: false,
  },
];
