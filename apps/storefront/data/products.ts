export type Product = {
  id: string;
  name: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  isNew: boolean;
};

// Données statiques temporaires — à remplacer par un appel base de données / CMS.
export const products: Product[] = [
  {
    id: "p1",
    name: "Robe Aïsha en lin",
    price: 32000,
    currency: "FCFA",
    category: "Femmes",
    image: "https://picsum.photos/seed/yedei-product-1/900/1100",
    isNew: true,
  },
  {
    id: "p2",
    name: "Chemise Kofi col mao",
    price: 24000,
    currency: "FCFA",
    category: "Hommes",
    image: "https://picsum.photos/seed/yedei-product-2/900/1100",
    isNew: true,
  },
  {
    id: "p3",
    name: "Ensemble Naël coton doux",
    price: 18500,
    currency: "FCFA",
    category: "Enfants",
    image: "https://picsum.photos/seed/yedei-product-3/900/1100",
    isNew: true,
  },
  {
    id: "p4",
    name: "Body Sena bambou",
    price: 9500,
    currency: "FCFA",
    category: "Bébés",
    image: "https://picsum.photos/seed/yedei-product-4/900/1100",
    isNew: false,
  },
  {
    id: "p5",
    name: "Pantalon Diallo tailleur",
    price: 27500,
    currency: "FCFA",
    category: "Hommes",
    image: "https://picsum.photos/seed/yedei-product-5/900/1100",
    isNew: false,
  },
  {
    id: "p6",
    name: "Ensemble Amara deux pièces",
    price: 35000,
    currency: "FCFA",
    category: "Femmes",
    image: "https://picsum.photos/seed/yedei-product-6/900/1100",
    isNew: false,
  },
  {
    id: "p7",
    name: "Pyjama Yao étoilé",
    price: 11000,
    currency: "FCFA",
    category: "Bébés",
    image: "https://picsum.photos/seed/yedei-product-7/900/1100",
    isNew: false,
  },
  {
    id: "p8",
    name: "Tenue scolaire Fara",
    price: 21000,
    currency: "FCFA",
    category: "Enfants",
    image: "https://picsum.photos/seed/yedei-product-8/900/1100",
    isNew: false,
  },
];

export function formatPrice(product: Product): string {
  return `${product.price.toLocaleString("fr-FR")} ${product.currency}`;
}
