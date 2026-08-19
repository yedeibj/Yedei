const TRUST_POINTS = [
  {
    title: "Tissus de qualité",
    description: "Des matières choisies avec soin, pour durer saison après saison.",
    color: "#006400",
  },
  {
    title: "Livraison rapide",
    description: "Ta commande préparée et expédiée en un temps record.",
    color: "#dc143c",
  },
  {
    title: "Paiement à la livraison",
    description: "Tu payes seulement quand ta commande arrive chez toi.",
    color: "#00008b",
  },
  {
    title: "Retours simplifiés",
    description: "Un souci avec ta commande ? On s'en occupe rapidement.",
    color: "#006400",
  },
];

export default function BrandStory() {
  return (
    <section className="bg-[#F6F3EC] px-6 py-16 sm:px-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="flex gap-[3px]" aria-hidden="true">
            <span className="h-[3px] w-[10px] rounded-full bg-[#006400]" />
            <span className="h-[3px] w-[7px] rounded-full bg-[#dc143c]" />
            <span className="h-[3px] w-[13px] rounded-full bg-[#00008b]" />
          </span>
          <p className="mt-3 text-xs uppercase tracking-[0.25em] text-[#8C8579]">
            Depuis le Bénin
          </p>
          <h2 className="mt-2 font-display text-3xl italic leading-tight text-[#181715] sm:text-4xl">
            L'élégance pour toute la famille
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[#8C8579] sm:text-base">
            YEDEI est né d'une conviction simple : s'habiller élégamment ne devrait jamais
            être compliqué, ni réservé à une seule tranche d'âge. De la première tenue de bébé
            aux pièces intemporelles pour les parents, nous sélectionnons chaque article avec
            la même exigence — de belles matières, des coupes soignées, et des prix qui
            restent honnêtes.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-[#181715] sm:text-sm">
            <span><span className="font-medium text-[#006400]">4</span> collections</span>
            <span className="text-[#D8D3C9]">·</span>
            <span><span className="font-medium text-[#dc143c]">100%</span> paiement à la livraison</span>
            <span className="text-[#D8D3C9]">·</span>
            <span>Livraison au <span className="font-medium text-[#00008b]">Bénin</span> et environs</span>
          </div>

          <p className="mt-6 font-display text-sm italic text-[#8C8579]">
            L'élégance, à chaque étape de la vie.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TRUST_POINTS.map((point) => (
            <div
              key={point.title}
              className="rounded-lg border border-[#D8D3C9] bg-white p-5"
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: point.color }}
                aria-hidden="true"
              />
              <p className="mt-3 font-display text-base italic text-[#181715]">
                {point.title}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#8C8579]">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
