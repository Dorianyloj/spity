# Parcours jury — Spity

Bienvenue dans le dépôt de Spity. Cette page permet d'accéder rapidement aux éléments utiles pour évaluer le projet, sans devoir parcourir les fichiers techniques un par un.

## 1. Identité du projet

| Élément | Information |
| --- | --- |
| Projet | Spity, réseau social pour la communauté de l'escalade |
| Application | Next.js, TypeScript, React, Drizzle ORM et MariaDB |
| Qualité | Jest, Node Test Runner, Playwright, axe, Lighthouse et GitHub Actions |
| Livrable principal de maintenance | [Bloc 4 — Maintenir l'application en condition opérationnelle](docs/rncp/bloc-04/dossier-jury/README.md) |

Le [cadrage produit](CADRAGE_PROJET.md) présente le besoin, les utilisateurs, les fonctionnalités et les objectifs. Le [README applicatif](spity/README.md) décrit l'installation et l'architecture du code.

## 2. Trois parcours de consultation

### Parcours express — 5 minutes

1. Lire le [README du projet](README.md).
2. Ouvrir la [revue finale Bloc 4](docs/rncp/bloc-04/REVUE_FINALE_BLOC_04.md).
3. Consulter l'[export PDF](output/pdf/dossier-bloc-04-spity.pdf) si une lecture hors dépôt est souhaitée.

### Parcours Bloc 4 — 20 minutes

1. Suivre le [dossier de remise](docs/rncp/bloc-04/dossier-jury/README.md).
2. Utiliser la [matrice de preuves](docs/rncp/bloc-04/dossier-jury/annexes/MATRICE_DE_PREUVES.md).
3. Consulter les [captures applicatives, Git et CI/CD](docs/rncp/bloc-04/preuves/captures/README.md).
4. Vérifier l'intégrité dans [`preuves/MANIFEST.sha256`](docs/rncp/bloc-04/preuves/MANIFEST.sha256).

### Parcours technique — 45 minutes

1. Installer l'application avec le [README de `spity/`](spity/README.md).
2. Lire les procédures d'exploitation (`MAINTENANCE.md`, `OBSERVABILITY.md`, `INCIDENT_MANAGEMENT.md`, `RELEASE_VERIFICATION.md`, `RELEASE_JOURNAL.md` et `SUPPORT.md`) dans `spity/`.
3. Rejouer les contrôles ci-dessous.

## 3. Correspondance Bloc 4

| Compétence | Démonstration | Preuve de référence |
| --- | --- | --- |
| C4.1.1 — Dépendances | Politique, Dependabot, audits et SBOM | `B4-C411-03` |
| C4.1.2 — Supervision | Sondes, seuils, SLO et exercices d'alerte | `B4-C412-04` |
| C4.2.1 — Anomalies | Registre, cycle de vie et fiches reproductibles | `B4-C421-03` |
| C4.2.2 — Correctifs CI/CD | Version/SHA, staging, smoke test et rollback | `B4-C422-04` |
| C4.3.1 — Améliorations | Backlog priorisé, coûts, délais et indicateurs | `B4-C431-02` |
| C4.3.2 — Versions | Journal SemVer/SHA et distinction des statuts | `B4-C432-02` |
| C4.3.3 — Support | Registre de collaboration et critères de résolution | `B4-C433-02` |

La [revue finale](docs/rncp/bloc-04/REVUE_FINALE_BLOC_04.md) relie chaque ligne à une commande et au fichier de preuve exact. Le [dossier détaillé](docs/rncp/bloc-04/DOSSIER_BLOC_04.md) explique les décisions, les résultats et les limites.

## 4. Vérifier le projet

Depuis `spity/` :

```bash
npm ci
npm run lint
npm run typecheck
npm run test:maintenance
npm run bloc4:check
npm run quality
```

`npm run bloc4:check` contrôle les sept compétences, les documents, les sources opérationnelles, les preuves JSON, les registres et toutes les empreintes du manifeste. Les exercices de maintenance utilisent des données et serveurs locaux en mémoire ; aucun LXC n'est utilisé.

## 5. Périmètre de preuve et transparence

Le dépôt applique les règles suivantes :

- une preuve datée ne contient ni secret, ni export de base, ni donnée personnelle ;
- une simulation est signalée comme simulation et n'est jamais présentée comme un échange client réel ;
- un staging validé est distinct d'une promotion de production ;
- une instance de production n'est déclarée observée qu'avec un état de santé, une version et une révision cohérents ;
- les fichiers couverts par le Bloc 4 sont protégés par le manifeste SHA-256.

Le principal point ouvert est documenté sans être masqué : une production saine peut être en décalage de révision avec une référence auditée. La réponse attendue est une release autorisée et vérifiée, pas un déploiement improvisé.

## 6. Fichiers à remettre ou à ouvrir

- [Dossier écrit Bloc 4](docs/rncp/bloc-04/DOSSIER_BLOC_04.md)
- [Dossier de remise structuré](docs/rncp/bloc-04/dossier-jury/README.md)
- [Revue finale des compétences](docs/rncp/bloc-04/REVUE_FINALE_BLOC_04.md)
- [Feuille de route et état réel](docs/rncp/bloc-04/PLAN_ACTION_BLOC_04.md)
- [Preuves et manifeste](docs/rncp/bloc-04/preuves/README.md)
- [Captures réelles : parcours, Git et CI/CD](docs/rncp/bloc-04/preuves/captures/README.md)
- [Export PDF Bloc 4](output/pdf/dossier-bloc-04-spity.pdf)

Le dépôt est volontairement organisé pour que ces fichiers restent consultables sans dépendre d'un environnement externe : le code exécutable est dans `spity/`, les livrables dans `docs/` et les exports dans `output/`.
