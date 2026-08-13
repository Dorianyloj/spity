# Spity

Spity est un réseau social dédié à la communauté de l'escalade. Le dépôt regroupe l'application, son infrastructure de déploiement et les livrables de certification RNCP.

## Repères

- [`spity/`](spity) : application Next.js, migrations, tests, scripts et fichiers Docker ;
- [`docs/`](docs) : documentation produit, exploitation et certification ;
- [`docs/bc02/`](docs/bc02) : dossier final du bloc 2 ;
- [`docs/rncp/bloc-01/`](docs/rncp/bloc-01) : livrables du bloc 1 ;
- [`docs/rncp/bloc-04/`](docs/rncp/bloc-04) : chantier, feuille de route et preuves du bloc 4 ;
- [`CADRAGE_PROJET.md`](CADRAGE_PROJET.md) : périmètre produit ;
- [`CHANGELOG.md`](CHANGELOG.md) : versions et évolutions notables.

## Démarrage rapide

```bash
cd spity
cp .env.example .env.local
docker compose --env-file .env.local up -d mariadb
npm ci
npm run db:migrate
npm run dev
```

Les prérequis, commandes de qualité et procédures d'exploitation sont détaillés dans le [README de l'application](spity/README.md).

## État du projet

L'[état des lieux du 12 août 2026](docs/audits/2026-08-12-etat-des-lieux-projet.md) recense la situation initiale. Le [dossier Bloc 4](docs/rncp/bloc-04/DOSSIER_BLOC_04.md) couvre désormais les sept compétences avec des preuves datées et reproductibles.
