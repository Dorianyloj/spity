# Spity

Spity est un réseau social pour la communauté escalade : matching entre grimpeurs, répertoire de salles/falaises/clubs, topos collaboratifs, événements clubs et contenu social contextualisé.

Le projet est développé dans le cadre d'une certification Titre RNCP. Le cadrage produit complet est disponible dans `../CADRAGE_PROJET.md`.

## Stack

- Next.js App Router
- React
- Tailwind CSS
- Drizzle ORM
- MariaDB
- Zod

## Prérequis

- Node.js 22 (voir `.nvmrc`)
- npm 10+
- Docker Desktop avec Docker Compose

## Installation

```bash
npm ci
cp .env.example .env.local
docker compose --env-file .env.local up -d
npm run db:migrate
```

Remplacez au minimum `JWT_SECRET`, `MYSQL_PASSWORD` et `MYSQL_ROOT_PASSWORD` dans `.env.local`. `DATABASE_URL` doit utiliser le même mot de passe que `MYSQL_PASSWORD`.

phpMyAdmin est un outil optionnel du profil `tools` :

```bash
docker compose --env-file .env.local --profile tools up -d
```

## Développement

```bash
npm run dev
```

Application : http://localhost:3000

phpMyAdmin : http://localhost:8081

État de l'application et de MariaDB : http://localhost:3000/api/health

## Commandes

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm start            # Serveur production après build
npm run lint         # ESLint
npm run typecheck    # Vérification TypeScript
npm run quality      # Lint, TypeScript et build
npm run security:audit # Vulnérabilités des dépendances de production
npm run perf:audit   # Audit Lighthouse des pages principales
```

## Environnements

### Tests

La base de test est isolée, exposée uniquement sur `127.0.0.1:3307` et stockée en mémoire :

```bash
cp .env.test.example .env.test
docker compose --env-file .env.test -f docker-compose.test.yml up -d --wait
docker compose --env-file .env.test -f docker-compose.test.yml down
```

### Production Docker

```bash
cp .env.production.example .env.production
# Remplacer toutes les valeurs CHANGE_ME.
docker compose --env-file .env.production -f docker-compose.production.yml build
docker compose --env-file .env.production -f docker-compose.production.yml up -d mariadb
docker compose --env-file .env.production -f docker-compose.production.yml --profile migration run --rm migrate
docker compose --env-file .env.production -f docker-compose.production.yml up -d app
```

La configuration de production lie l'application à `127.0.0.1:3000` par défaut afin qu'elle soit publiée derrière un reverse proxy HTTPS.

## Base de données

```bash
npm run db:generate  # Génère une migration Drizzle
npm run db:migrate   # Applique les migrations
npm run db:push      # Synchronise le schéma sans migration
npm run db:studio    # Lance Drizzle Studio
```

## Structure

- `src/app` : routes App Router
- `src/components/ui` : design system réutilisable
- `src/db` : client et schéma Drizzle
- `src/lib` : configuration et validateurs partagés
- `drizzle` : migrations SQL générées

## Authentification

Routes disponibles :

```bash
POST /api/auth/register  # Crée un compte et pose le cookie de session
POST /api/auth/login     # Connecte un utilisateur
POST /api/auth/logout    # Supprime le cookie de session
GET  /api/auth/me        # Retourne la session active
```

Pages locales :

- http://localhost:3000/login
- http://localhost:3000/register

## Profils

Routes disponibles :

```bash
GET   /api/profile/me        # Retourne le profil de l'utilisateur connecté
POST  /api/profile/grimpeur  # Crée le profil grimpeur
PATCH /api/profile/grimpeur  # Met à jour le profil grimpeur
POST  /api/profile/club      # Crée le profil club
PATCH /api/profile/club      # Met à jour le profil club
```

Pages locales :

- http://localhost:3000/profile/onboarding
- http://localhost:3000/profile/me

## Qualité

Avant commit, lancer :

```bash
npm run quality
npm run security:audit
```

Après un build réussi, `npm run perf:audit` lance l'application et vérifie les seuils Lighthouse définis dans `lighthouserc.js`.

Le protocole complet des environnements, contrôles qualité, déploiements et retours arrière est documenté dans [`../docs/bc02/02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md`](../docs/bc02/02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md).
