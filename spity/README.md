# Spity

Spity est le prototype fonctionnel d'un réseau social pour la communauté escalade : profils grimpeurs et clubs, inventaire de matériel, recherche de partenaires, événements et répertoire de lieux.

Le cadrage produit complet se trouve dans [`../CADRAGE_PROJET.md`](../CADRAGE_PROJET.md). Les livrables de certification sont centralisés dans [`../docs`](../docs), notamment le dossier BC02 et le plan du bloc 4 consacré au maintien en condition opérationnelle.

## Stack

- TypeScript strict, Next.js App Router et React ;
- Tailwind CSS et composants accessibles internes ;
- Route Handlers Next.js, Zod et Drizzle ORM ;
- MariaDB 11.4 ;
- Jest, Node Test Runner, Playwright, axe et Lighthouse ;
- Docker Compose, GitHub Actions et GitHub Container Registry.

## Prérequis

- Node.js 22.x, conformément à [`.nvmrc`](.nvmrc) ;
- npm 10 ou supérieur ;
- Docker Engine avec Docker Compose v2.

## Installation locale

Depuis ce dossier `spity/` :

```bash
cp .env.example .env.local
docker compose --env-file .env.local up -d mariadb
npm ci
npm run db:migrate
npm run dev
```

Renseigner un `JWT_SECRET` aléatoire d'au moins 64 octets dans `.env.local`. L'application est ensuite disponible sur <http://localhost:3000>.

phpMyAdmin est un outil local facultatif. Il n'est pas démarré par défaut :

```bash
docker compose --env-file .env.local --profile tools up -d
```

Il est alors disponible sur <http://localhost:8083>. Le port est modifiable avec `PHPMYADMIN_PORT`.

Pour charger les comptes et données de démonstration dans une base locale uniquement :

```bash
npm run db:seed
```

## Commandes

```bash
npm run dev                  # Serveur de développement
npm run build                # Build de production
npm start                    # Serveur après build
npm run lint                 # ESLint
npm run typecheck            # Vérification TypeScript
npm run test:coverage        # Tests unitaires et couverture
npm run test:integration     # Tests HTTP avec MariaDB
npm run test:acceptance      # Recette Playwright F01 à F10
npm run accessibility:audit # Audit axe authentifié
npm run perf:audit           # Build et audit Lighthouse
npm run security:audit       # Audit des dépendances de production
```

Les tests d'intégration et d'acceptation nécessitent une MariaDB disponible via `DATABASE_URL`. Playwright nécessite aussi Chromium, installable avec `npx playwright install chromium`.

## Base de données

```bash
npm run db:generate  # Génère une nouvelle migration Drizzle
npm run db:migrate   # Applique les migrations existantes
npm run db:studio    # Ouvre Drizzle Studio
```

`db:push` est réservé aux expérimentations locales. Une mise à jour partagée ou de production passe toujours par une nouvelle migration versionnée ; une migration existante n'est jamais modifiée.

## Structure

- `src/app` : pages et Route Handlers App Router ;
- `src/features` : composants, schémas et logique par fonctionnalité ;
- `src/components/ui` : design system réutilisable ;
- `src/db` : client et schéma Drizzle ;
- `src/lib` : services et validateurs partagés ;
- `drizzle` : migrations SQL générées ;
- `tests` : intégration et recette navigateur ;
- `scripts` : audits, données de démonstration et validation de release.

## Documentation d'exploitation

- [Dossier synthétique BC02 au format PDF](../docs/bc02/livrable/DOSSIER_BC02_SPITY.pdf)
- [Index exhaustif des critères et preuves](../docs/bc02/15_INDEX_PREUVES_GRILLE_BC02.md)
- [Audit de conformité aux documents officiels](../docs/bc02/17_AUDIT_CONFORMITE_OFFICIEL_BC02.md)
- [Manuel de déploiement](../docs/bc02/12_MANUEL_DEPLOIEMENT_C241.md)
- [Manuel d'utilisation](../docs/bc02/13_MANUEL_UTILISATION_C241.md)
- [Manuel de mise à jour et maintenance](../docs/bc02/14_MANUEL_MISE_A_JOUR_C241.md)
- [État des lieux et plan d'action du bloc 4](../docs/rncp/bloc-04/PLAN_ACTION_BLOC_04.md)
- [Procédure autonome incluse dans chaque bundle de release](DEPLOYMENT.md)

Pour régénérer les captures puis le dossier HTML/PDF depuis une base locale de démonstration :

```bash
npm run db:seed
npm run docs:capture
npm run docs:capture:github
npm run docs:build
```
