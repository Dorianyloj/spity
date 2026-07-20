# Protocole d'intégration continue - C2.1.2

## 1. Objectif et compétence couverte

Ce document décrit le système d'intégration continue de Spity. Il répond à la compétence C2.1.2 du bloc BC02 : fusionner régulièrement le code source et tester les blocs de code afin de réduire les risques de régression.

La réalisation technique est versionnée dans [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml).

La configuration suit les recommandations officielles :

- [construire et tester une application Node.js avec GitHub Actions](https://docs.github.com/actions/automating-builds-and-tests/building-and-testing-nodejs) ;
- [configurer Jest avec Next.js](https://nextjs.org/docs/app/guides/testing/jest).

## 2. Déclencheurs du pipeline

Le workflow `Continuous integration` est déclenché lors :

- d'un `push` vers `develop` ou `main` ;
- de l'ouverture ou de la mise à jour d'une pull request ciblant `develop` ou `main`.

Une seule exécution est conservée par branche. Lorsqu'un nouveau commit est poussé, l'exécution obsolète est annulée afin de ne pas produire de résultat portant sur une ancienne révision.

Le workflow dispose uniquement de l'autorisation `contents: read`. Il ne peut ni modifier le dépôt ni publier une version.

## 3. Environnement d'intégration

| Élément | Configuration |
| --- | --- |
| Exécuteur | GitHub-hosted runner `ubuntu-latest` |
| Runtime | Version Node.js déclarée dans `spity/.nvmrc` |
| Gestionnaire | npm et installation déterministe avec `npm ci` |
| Verrou de dépendances | `spity/package-lock.json` |
| Cache | Cache npm indexé par le fichier de verrouillage |
| Dossier d'exécution | `spity/` |
| Durée maximale | 20 minutes |
| Secrets de build | Valeurs de test non sensibles injectées dans le job |

Le job `Quality gates` ne démarre pas MariaDB : ses tests sont unitaires et le build Next.js n'ouvre pas de connexion à la base. Un job indépendant `MariaDB integration tests` démarre toutefois une base vide, applique les migrations et vérifie les routes et dépôts du prototype.

## 4. Séquence d'intégration

Les étapes s'exécutent dans l'ordre suivant. Une étape en échec bloque toutes les étapes suivantes, sauf la publication du rapport de couverture configurée avec `if: always()`.

| Ordre | Étape | Commande ou action | Critère de succès |
| ---: | --- | --- | --- |
| 1 | Récupération des sources | `actions/checkout@v6` | SHA demandé disponible sur le runner |
| 2 | Installation de Node.js | `actions/setup-node@v6` | Version de `.nvmrc` active |
| 3 | Installation déterministe | `npm ci` | Dépendances conformes au lockfile |
| 4 | Analyse statique | `npm run lint` | Aucune erreur ou avertissement |
| 5 | Vérification du typage | `npm run typecheck` | Aucune erreur TypeScript |
| 6 | Tests et couverture | `npm run test:coverage` | Tous les tests et seuils réussis |
| 7 | Audit des dépendances | `npm run security:audit` | Aucune alerte haute ou critique de production |
| 8 | Validation de l'infrastructure | Trois commandes `docker compose ... config --quiet` | Configurations développement, test et production valides |
| 9 | Construction | `npm run build` | Build de production Next.js réussi |
| 10 | Conservation de la preuve | `actions/upload-artifact@v6` | Rapport `coverage-<SHA>` conservé 30 jours |

### Job d'intégration MariaDB

| Ordre | Étape | Critère de succès |
| ---: | --- | --- |
| 1 | Démarrer `mariadb:11.4` | Healthcheck MariaDB réussi |
| 2 | Installer avec `npm ci` | Lockfile respecté |
| 3 | Exécuter `npm run db:migrate` | Toutes les migrations s'appliquent sur une base vide |
| 4 | Exécuter `npm run test:integration` | 11 résultats TAP réussis, aucune fuite de capacité, d'autorisation ou de quota d'authentification |
| 5 | Exécuter `npm run accessibility:audit` | Dix états authentifiés à 100 %, lien d'évitement, mouvement réduit et reflow mobile validés |
| 6 | Publier les artefacts | Rapports TAP, Lighthouse authentifié et captures mobiles conservés 30 jours |

## 5. Protocole de contribution et de fusion

1. Mettre à jour `develop` avant de créer une branche courte `feat/...`, `fix/...`, `test/...` ou `docs/...`.
2. Réaliser un changement logique et l'accompagner des tests adaptés au risque.
3. Exécuter localement `npm run quality` avant le push.
4. Pousser la branche et ouvrir une pull request vers `develop`.
5. Vérifier que le périmètre, les migrations éventuelles et les risques de sécurité sont décrits dans la pull request.
6. Attendre le succès du contrôle `Quality gates`.
7. Faire relire le changement et traiter chaque commentaire bloquant.
8. Fusionner uniquement lorsque la revue et la CI sont validées.
9. Réserver `main` aux versions stables promues depuis `develop`.
10. Identifier chaque version livrée avec un tag et reporter son SHA dans le journal des versions.

Les protections de branches GitHub devront rendre le contrôle `Quality gates` et une revue obligatoires avant fusion vers `main`. Une capture de cette configuration sera conservée comme preuve externe au dépôt.

## 6. Traitement d'un échec

Lorsqu'une étape échoue :

1. la fusion ou la promotion est suspendue ;
2. le journal de l'étape permet d'identifier la commande et le fichier concernés ;
3. une anomalie est créée si l'échec révèle une régression ou un défaut du produit ;
4. la correction est réalisée sur la même branche ou sur une branche `fix/...` dédiée ;
5. le pipeline complet est rejoué depuis l'installation déterministe ;
6. aucun contrôle n'est désactivé pour rendre artificiellement la CI verte.

Une dépendance vulnérable ne peut être ignorée que si son périmètre, son exploitabilité, la mesure compensatoire, le responsable et la date de réévaluation sont documentés.

## 7. Résultats initiaux

Contrôles locaux exécutés le 20 juillet 2026 :

| Contrôle | Résultat |
| --- | --- |
| ESLint | Succès, aucune erreur |
| TypeScript | Succès, aucune erreur |
| Jest | 49 tests réussis sur 49 |
| Couverture ciblée | 97,5 % lignes, 87,91 % branches, 100 % fonctions |
| Audit de production au niveau `high` | Succès, aucune alerte haute ou critique |
| Configurations Compose | Trois configurations valides |
| Build Docker standalone | Succès sous Node.js 22, exécution avec l'utilisateur `nextjs` |
| Healthcheck avec MariaDB migrée | HTTP 200, statut `ok` |
| Lighthouse | Seuils réussis sur accueil, connexion et inscription |

### Preuve GitHub Actions

L'[exécution GitHub Actions no 29733455501](https://github.com/Dorianyloj/spity/actions/runs/29733455501) a été réalisée sur le SHA `25d0de5a3ee5167e6cba5299dce0196a4bb0d188` le 20 juillet 2026.

| Élément distant | Résultat |
| --- | --- |
| Job `Quality gates` | Succès |
| Job `Lighthouse thresholds` | Succès |
| Artefact de couverture | `coverage-25d0de5a3ee5167e6cba5299dce0196a4bb0d188`, 38 041 octets |
| Artefact Lighthouse | `lighthouse-25d0de5a3ee5167e6cba5299dce0196a4bb0d188`, 328 684 octets |
| Durée de conservation | 30 jours |

Cette exécution constitue la preuve reproductible initiale de C2.1.2. Une capture du résumé des deux jobs sera intégrée au dossier final afin que la preuve reste lisible après expiration des artefacts.

### Validation du lot prototype C2.2.1

L'[exécution GitHub Actions no 29739778393](https://github.com/Dorianyloj/spity/actions/runs/29739778393) a validé le SHA `1db84b8e1058aea6c4785fa5b14a9fdcde533541` le 20 juillet 2026 après l'ajout des parcours matching et événements.

| Élément distant | Résultat |
| --- | --- |
| Job `Quality gates` | Succès : lint, TypeScript, 69 tests, couverture, audit, configurations Docker et build |
| Job `Lighthouse thresholds` | Succès |
| Statut global | Succès |

Cette seconde exécution prouve que le prototype décrit dans le document C2.2.1 est reproductible sur l'environnement d'intégration, et pas uniquement sur le poste de développement.

### Validation des tests d'intégration C2.2.2

L'[exécution GitHub Actions no 29740751753](https://github.com/Dorianyloj/spity/actions/runs/29740751753) a validé le SHA `1e1cb16a9908257dba9b2e8f8e251c672ac0a6d4` le 20 juillet 2026.

| Job | Résultat |
| --- | --- |
| `Quality gates` | Succès |
| `MariaDB integration tests` | Succès : service sain, migrations complètes et 10 résultats TAP |
| `Lighthouse thresholds` | Succès |
| Artefact d'intégration | `integration-1e1cb16a9908257dba9b2e8f8e251c672ac0a6d4`, 898 octets, conservé 30 jours |

Cette exécution est la preuve distante que les migrations et les parcours critiques fonctionnent ensemble sur une base créée à neuf.

### Validation sécurité et accessibilité C2.2.3

L'[exécution GitHub Actions no 29743712530](https://github.com/Dorianyloj/spity/actions/runs/29743712530) a validé le SHA `3779eee23e86f013c76e54f8f96a44a87a80b31c` le 20 juillet 2026.

| Job | Résultat |
| --- | --- |
| `Quality gates` | Succès : 83 tests, couverture, audit de dépendances, lint, TypeScript et build |
| `MariaDB integration tests` | Succès : 11 résultats TAP puis audit authentifié sur dix états |
| `Lighthouse thresholds` | Succès : accessibilité 100 % sur les trois pages publiques |
| Artefact de couverture | `coverage-3779eee23e86f013c76e54f8f96a44a87a80b31c`, 53 385 octets |
| Artefact d'intégration | `integration-3779eee23e86f013c76e54f8f96a44a87a80b31c`, 961 octets |
| Artefact Lighthouse public | `lighthouse-3779eee23e86f013c76e54f8f96a44a87a80b31c`, 327 941 octets |
| Artefact accessibilité authentifiée | `accessibility-3779eee23e86f013c76e54f8f96a44a87a80b31c`, 1 509 342 octets |
| Expiration des artefacts | 19 août 2026 |

Cette exécution prouve sur une base et un runner neufs le quota HTTP, les corrections RGAA, les scores Lighthouse et la génération des captures mobiles décrites dans les documents C2.2.3.

## 8. Limites et évolutions prévues

- La CI prouve actuellement la qualité du périmètre unitaire ciblé, pas encore la majorité de l'application complète.
- Les composants critiques et l'échantillon RGAA sont pilotés par axe, Lighthouse et Puppeteer ; le cahier de recette devra encore couvrir l'ensemble des parcours visuels nominaux et alternatifs.
- Les contrôles d'accessibilité restent séparés des tests métier afin de conserver des diagnostics lisibles.
- Le déploiement continu restera séparé de la CI : une version ne sera promue qu'après le succès des contrôles et une validation explicite de l'environnement cible.
