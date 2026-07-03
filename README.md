# YEDEI — Monorepo

Deux applications Next.js, un seul repo, une base de données partagée.

## Structure

```
yedei/
├── apps/
│   ├── storefront/     → déployé sur xxxx.com
│   │   ├── app/
│   │   ├── components/
│   │   └── data/       (temporaire, à remplacer par @yedei/database)
│   └── admin/           → déployé sur admin.xxxx.com
│       └── app/         (squelette, à construire)
├── packages/
│   ├── database/         → schéma + client base de données, partagé
│   ├── ui/                → composants partagés (design system)
│   └── config/             → tsconfig commun aux deux apps
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Ce qui existe déjà

- **storefront** : homepage complète (Header, Hero, catégories, nouveautés,
  section marque, footer avec accordéon + téléchargement app).
- **admin** : squelette vide (layout + page de garde), rien de fonctionnel
  encore.
- **packages/database**, **packages/ui**, **packages/config** : points
  d'entrée vides, prêts à être remplis.

## Ce qui reste à construire

- `packages/database` : schéma (produits, catégories, commandes,
  utilisateurs) + client de connexion.
- `apps/admin` : authentification, gestion produits/commandes/catégories.
- Remplacer `apps/storefront/data/*.ts` par des appels à
  `@yedei/database` une fois le schéma prêt.
- `packages/ui` : extraire les composants réutilisables entre storefront et
  admin (en commençant par `FilYedei`).

## Installation

```bash
pnpm install
pnpm dev:storefront   # http://localhost:3000
pnpm dev:admin        # http://localhost:3001
```

## Déploiement (Vercel)

Créer **deux projets Vercel** pointant vers ce même repo GitHub :

| Projet Vercel | Root Directory       | Domaine           |
|----------------|-----------------------|--------------------|
| yedei-storefront | `apps/storefront`   | `xxxx.com`         |
| yedei-admin       | `apps/admin`         | `admin.xxxx.com`   |

Chaque projet build indépendamment, mais les deux partagent
`packages/database` et `packages/ui` grâce aux workspaces pnpm.
