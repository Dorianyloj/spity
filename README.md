# Spity

Spity est une application web dédiée à la communauté de l'escalade. Elle réunit des profils de grimpeurs et de clubs, la recherche de partenaires, les événements, les lieux et les contenus communautaires.

> **Accès jury :** commencer par [JURY.md](JURY.md). Cette page donne un parcours de lecture, les livrables, les preuves et les commandes de vérification.

## Dépôt en un coup d'œil

| Répertoire ou fichier | Rôle |
| --- | --- |
| [`spity/`](spity/) | Application exécutable : Next.js, MariaDB, migrations, tests, scripts et Docker. |
| [`docs/`](docs/) | Sources documentaires : dossiers RNCP, audits et preuves. |
| [`livrables/`](livrables/) | Fichiers finaux prêts à remettre, classés par bloc. |
| [`CADRAGE_PROJET.md`](CADRAGE_PROJET.md) | Vision produit, périmètre, parties prenantes et objectifs. |
| [`CHANGELOG.md`](CHANGELOG.md) | Historique des évolutions notables. |

## Parcours de lecture

- **Vue projet (5 min)** : [cadrage produit](CADRAGE_PROJET.md), puis [documentation applicative](spity/README.md).
- **Dossier RNCP Bloc 4 (15 min)** : [PDF à remettre](livrables/bloc-04/dossier-bloc-04-spity.pdf), [dossier source](docs/rncp/bloc-04/dossier/README.md) et [preuves](docs/rncp/bloc-04/preuves/README.md).
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

## Organisation du dépôt

L'arborescence sépare volontairement l'application, les sources documentaires et les fichiers de remise :

```text
.
├── spity/                  # application et automatisations
├── docs/                   # sources documentaires et preuves
│   └── rncp/bloc-04/
│       ├── dossier/        # parcours de lecture du dossier
│       └── preuves/        # preuves datées et manifestes
└── livrables/
    └── bloc-04/            # PDF final et empreinte à remettre
```

Le cadrage, le changelog et l'entrée jury restent à la racine afin d'être immédiatement visibles. Les fichiers temporaires et secrets locaux sont ignorés par Git. Aucun LXC n'est requis pour utiliser ou vérifier ce dépôt.
