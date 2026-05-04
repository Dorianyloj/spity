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

- Node.js 20+
- npm
- Docker et Docker Compose

## Installation

```bash
npm install
cp .env.example .env.local
docker compose up -d
npm run db:migrate
```

Adaptez `DATABASE_URL` et `JWT_SECRET` dans `.env.local` si nécessaire.

## Développement

```bash
npm run dev
```

Application : http://localhost:3000

phpMyAdmin : http://localhost:8081

## Commandes

```bash
npm run dev          # Serveur de développement
npm run build        # Build production
npm start            # Serveur production après build
npm run lint         # ESLint
npm run typecheck    # Vérification TypeScript
```

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

Page de test locale : http://localhost:3000/auth

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
npm run lint && npm run typecheck && npm run build
```
