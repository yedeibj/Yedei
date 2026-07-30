export type PromoMessage = {
  id: string;
  text: string;
};

// ⚠️ Remplace ces textes par les tiens — ce fichier sera plus tard
// piloté depuis l'admin (table "promo_messages")
export const promoMessages: PromoMessage[] = [
  { id: "p1", text: "Livraison offerte dès 50 000 FCFA d'achat" },
  { id: "p2", text: "Nouvelle collection disponible" },
  { id: "p3", text: "Paiement 100% sécurisé" },
  { id: "p4", text: "Retours simplifiés sous 14 jours" },
];
