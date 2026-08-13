# Spity

Spity est une application web dédiée à la communauté de l'escalade. Elle réunit des profils de grimpeurs et de clubs, la recherche de partenaires, les événements, les lieux et les contenus communautaires.

> **Accès jury :** commencer par [JURY.md](JURY.md). Cette page donne un parcours de lecture, les livrables, les preuves et les commandes de vérification.

## Dépôt en un coup d'œil

| Répertoire ou fichier | Rôle |
| --- | --- |
| [`spity/`](spity/) | Application Next.js, base MariaDB, migrations, tests, scripts et Docker. |
| [`docs/`](docs/) | Documentation produit, dossiers RNCP, audits et preuves. |
| [`output/`](output/) | Exports générés et relus, jamais les sources à modifier. |
| [`CADRAGE_PROJET.md`](CADRAGE_PROJET.md) | Vision produit, périmètre, parties prenantes et objectifs. |
| [`CHANGELOG.md`](CHANGELOG.md) | Historique des évolutions notables. |

## Parcours de lecture

- **Vue projet (5 min)** : [cadrage produit](CADRAGE_PROJET.md), puis [documentation applicative](spity/README.md).
- **Dossier RNCP Bloc 4 (15 min)** : [dossier de remise](docs/rncp/bloc-04/dossier-jury/README.md), [revue finale](docs/rncp/bloc-04/REVUE_FINALE_BLOC_04.md) et [preuves](docs/rncp/bloc-04/preuves/README.md).
- **Vérification complète** : suivre les commandes de [JURY.md](JURY.md) et consulter le [manifeste SHA-256](docs/rncp/bloc-04/preuves/MANIFEST.sha256).

## Démarrage local

Depuis le dossier `spity/` :

```bash
cp .env.example .env.local
docker compose --env-file .env.local up -d mariadb
npm ci
npm run db:migrate
npm run dev
```

L'application est disponible sur <http://localhost:3000>. Les prérequis, les variables locales et les commandes détaillées se trouvent dans le [README applicatif](spity/README.md).

## Qualité et maintenance

```bash
cd spity
npm run quality       # lint, typage, tests, audits, build et contrôle Bloc 4
npm run bloc4:check   # cohérence des 7 compétences, preuves et manifeste
npm run test:maintenance
```

Les contrôles sont versionnés et s'exécutent également dans GitHub Actions. Le dépôt distingue strictement les sources, les preuves datées, les simulations déclarées, le staging validé et la production observée.

## Organisation des livrables

La documentation est rangée par objectif :

```text
docs/
├── audits/             # états des lieux datés
├── bc02/               # livrables du Bloc 2 conservés
└── rncp/
    ├── bloc-01/        # livrables du Bloc 1
    ├── bloc-04/        # dossier, preuves et dossier jury du Bloc 4
    └── referentiel/    # référentiel officiel archivé
```

Les fichiers temporaires et secrets locaux sont ignorés par Git. Aucun LXC n'est requis pour utiliser ou vérifier ce dépôt.
