# Manuel de mise à jour et de maintenance de Spity - C2.4.1

## Identification du document

| Champ | Valeur |
| --- | --- |
| Produit | Spity |
| Version de référence | `0.1.0` |
| Public | Développeurs et responsables d'exploitation |
| Dépôt | `Dorianyloj/spity` |
| Branche d'intégration | `develop` |
| Branche stable | `main` |
| Historique | [`CHANGELOG.md`](../../CHANGELOG.md) et historique Git |
| Dernière vérification | 20 juillet 2026 |

## 1. Objectif

Ce manuel décrit comment corriger, faire évoluer, mettre à niveau et publier Spity tout en conservant la traçabilité du code, du schéma de données, des tests et du déploiement. Il complète le [manuel de déploiement](./12_MANUEL_DEPLOIEMENT_C241.md).

Une mise à jour n'est terminée que lorsque les sources, la migration éventuelle, les tests, le changelog, l'image déployée et le résultat de contrôle désignent la même révision Git.

## 2. Repères techniques et responsabilités

| Zone | Technologie | Emplacement | Règle de maintenance |
| --- | --- | --- | --- |
| Pages et API | TypeScript, Next.js App Router, React | `spity/src/app` | Conserver les composants serveur par défaut ; valider les entrées et sorties API avec Zod. |
| Fonctionnalités | TypeScript strict | `spity/src/features` | Colocaliser composants, schémas, logique et dépôts par domaine. Aucun `any` explicite. |
| Interface | Tailwind CSS, composants internes, Lucide | `spity/src/components/ui` | Réutiliser le design system et vérifier clavier, contraste, mobile et lecteur d'écran. |
| Données | Drizzle ORM, MariaDB 11.4 | `spity/src/db`, `spity/drizzle` | Générer une nouvelle migration ; ne jamais modifier une migration appliquée. |
| Contrats | Zod | schémas colocalisés | Parser les corps, paramètres et réponses ; retourner des erreurs contrôlées. |
| Tests | Jest, Node Test Runner, Playwright | tests colocalisés et `spity/tests` | Adapter les tests au même changement et préserver les seuils. |
| Exécution | Node.js 22, npm lockfile | `.nvmrc`, `package.json`, `package-lock.json` | Utiliser la version fixée et installer avec `npm ci` en validation. |
| Livraison | Docker, Compose, GitHub Actions, GHCR | `Dockerfile`, `.github/workflows` | Construire une image par SHA, promouvoir le même candidat et ne jamais remplacer un tag stable manuellement. |

Le choix de TypeScript strict, Zod et Drizzle fournit trois contrôles complémentaires : compilation, validation à l'exécution et schéma relationnel versionné. Docker et le lockfile réduisent les écarts entre poste, CI et production. Git et le changelog assurent la traçabilité humaine de chaque évolution.

## 3. Classification et version

Spity suit Semantic Versioning `MAJEUR.MINEUR.CORRECTIF` :

- **correctif** : correction rétrocompatible, par exemple `0.1.0` vers `0.1.1` ;
- **mineur** : nouvelle fonction rétrocompatible, par exemple `0.1.0` vers `0.2.0` ;
- **majeur** : rupture d'API, de données ou de procédure après la version `1.0.0`.

Chaque commit suit Conventional Commits : `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `style` ou `chore`, avec un scope utile. Les changements notables sont ajoutés sous `Unreleased` dans [`CHANGELOG.md`](../../CHANGELOG.md).

Avant de commencer, qualifier :

1. le besoin ou l'anomalie et son impact ;
2. les fonctions et contrats concernés ;
3. la nécessité d'une migration ;
4. les risques sécurité, accessibilité et perte de données ;
5. les tests et le niveau de version attendus ;
6. le plan de retour arrière.

## 4. Flux standard de modification

Depuis la racine du dépôt :

```bash
git switch develop
git pull --ff-only
git switch -c feat/description-courte
cd spity
npm ci
cp .env.example .env.local
docker compose --env-file .env.local up -d mariadb
npm run db:migrate
```

Si la branche corrige une anomalie, utiliser `fix/description-courte`. Ne pas pousser directement sur `main`.

Pendant le développement :

- conserver TypeScript strict et les alias `@/` ;
- placer la logique métier dans la feature concernée plutôt que dans la page ;
- parser toute donnée externe comme `unknown` avec Zod ;
- ne pas consigner de secret, mot de passe, cookie ni donnée personnelle ;
- ajouter ou adapter les tests au comportement modifié ;
- mettre à jour les trois manuels si la procédure ou l'interface change.

Avant chaque commit, examiner uniquement ses changements :

```bash
git status --short
git diff --check
git diff
```

Créer un commit logique, pousser la branche, puis ouvrir une pull request vers `develop`. La revue vérifie le besoin, le risque, les tests, la migration, l'accessibilité, la sécurité et la documentation.

## 5. Modifier la base de données

Le schéma source est [`spity/src/db/schema.ts`](../../spity/src/db/schema.ts). Les migrations générées se trouvent dans [`spity/drizzle`](../../spity/drizzle).

### 5.1 Créer une migration

1. Modifier le schéma Drizzle.
2. Générer un nouveau fichier :

```bash
cd spity
npm run db:generate
```

3. Relire le SQL généré et les métadonnées associées.
4. Vérifier qu'aucune migration existante n'a été réécrite.
5. Appliquer sur une base locale jetable ou sauvegardée :

```bash
npm run db:migrate
```

6. Lancer les tests d'intégration puis la recette des parcours concernés.

`npm run db:push` ne doit pas être utilisé pour une évolution partagée ou de production, car il ne produit pas l'historique de migration attendu.

### 5.2 Stratégie sans interruption

Préférer une séquence **étendre, migrer, contracter** :

1. ajouter une colonne ou table compatible avec l'ancienne application ;
2. déployer le code capable de lire ancien et nouveau formats si nécessaire ;
3. migrer ou compléter les données ;
4. observer la version ;
5. supprimer l'ancien champ dans une release ultérieure seulement.

Une migration destructive et son nettoyage ne doivent pas être regroupés avec l'introduction du nouveau modèle. Cette séparation maintient un retour arrière applicatif possible.

### 5.3 Correction d'une migration déjà appliquée

Ne jamais éditer son fichier. Créer une migration supplémentaire qui corrige l'état. Documenter la cause et le retest dans le [registre des bogues](./11_PLAN_CORRECTION_BOGUES_C232.md).

## 6. Mettre à jour une dépendance

Examiner d'abord l'état sans modifier le lockfile :

```bash
cd spity
npm outdated
npm audit --omit=dev
```

Procédure :

1. lire la note de version et le guide de migration de la source officielle ;
2. vérifier la compatibilité Node.js 22, Next.js, React et TypeScript ;
3. mettre à jour une famille cohérente de dépendances à la fois ;
4. utiliser `npm install nom@version` pour actualiser ensemble `package.json` et `package-lock.json` ;
5. adapter le code et les tests sans désactiver une règle de qualité ;
6. exécuter tous les contrôles concernés, puis `npm audit --omit=dev --audit-level=high` ;
7. consigner la mise à jour et toute rupture dans le changelog.

Pour changer la version majeure de Node.js, modifier de façon cohérente `.nvmrc`, `package.json#engines`, le `Dockerfile` et les workflows. Vérifier que les actions GitHub utilisent leur runtime maintenu ; les workflows actuels emploient les versions `v6`, exécutées nativement sur Node.js 24 côté runner.

Ne jamais lancer une mise à jour globale non relue ni supprimer le lockfile pour résoudre un conflit. Une alerte de sécurité critique ou élevée bloque la publication jusqu'à correction, remplacement ou décision de risque documentée.

## 7. Validation avant intégration

### 7.1 Portes locales minimales

```bash
cd spity
npm run lint
npm run typecheck
npm run test:coverage
npm run security:audit
npm run build
```

Seuils unitaires actuels : 80 % lignes, fonctions et instructions, 75 % branches sur le périmètre Jest. Une baisse de seuil ne constitue pas une correction.

### 7.2 Contrôles avec MariaDB et navigateur

Avec `DATABASE_URL` pointant vers une base isolée :

```bash
npm run db:migrate
npm run test:integration
npm run test:acceptance
npm run accessibility:audit
npm run perf:audit
```

Installer Chromium au besoin avec `npx playwright install chromium`. Les scripts navigateur démarrent leurs propres serveurs ; ne pas réutiliser le même port pour plusieurs audits simultanés.

Le périmètre et les preuves sont détaillés dans le [harnais unitaire](./04_HARNAIS_TESTS_UNITAIRES.md), les [tests d'intégration](./06_TESTS_INTEGRATION_C222.md), les audits [OWASP](./07_SECURITE_OWASP_C223.md) et [RGAA](./08_ACCESSIBILITE_RGAA_C223.md), ainsi que le [cahier de recettes](./10_CAHIER_RECETTES_C231.md).

### 7.3 CI obligatoire

La pull request puis `develop` exécutent les portes distantes. Le staging continu n'est produit qu'après succès du lint, typage, tests, audit des dépendances, build, intégration MariaDB, accessibilité, performance et recette Playwright.

Ne pas fusionner avec un job obligatoire rouge. Une relance est acceptable uniquement après analyse d'une cause transitoire ; elle ne remplace pas une correction.

## 8. Préparer et publier une version

### 8.1 Préparer la révision candidate

1. Vérifier que tous les changements prévus sont intégrés dans `develop`.
2. Choisir la nouvelle version SemVer.
3. Mettre à jour sans créer automatiquement de tag :

```bash
cd spity
npm version --no-git-tag-version 0.1.1
cd ..
```

4. Déplacer les éléments pertinents de `Unreleased` vers `## [0.1.1] - AAAA-MM-JJ` et mettre à jour les liens du changelog.
5. Exécuter la validation complète.
6. Committer `package.json`, `package-lock.json` et `CHANGELOG.md`, puis pousser `develop`.
7. Attendre que le staging continu de ce SHA précis soit vert et que ses images `sha-SHA_GIT` existent dans GHCR.

### 8.2 Créer le tag

Le tag doit viser exactement le commit passé par le staging continu :

```bash
git status --short
git tag --annotate v0.1.1 --message "Spity v0.1.1"
git push origin v0.1.1
```

Ne jamais déplacer ni forcer un tag stable. Le workflow de release :

1. vérifie la concordance tag, `package.json` et changelog ;
2. rejoue les portes qualité, les migrations, l'intégration, l'accessibilité et Lighthouse ;
3. récupère les images immuables `sha-SHA_GIT` issues du staging ;
4. exécute migration et smoke test dans un environnement isolé ;
5. promeut les mêmes digests sous `candidate-VERSION`, `VERSION` et `latest` ;
6. génère le bundle, le manifeste et la somme SHA-256 ;
7. publie la release GitHub.

La recette Playwright ne se répète pas dans le workflow de tag : elle a déjà bloqué la construction staging du SHA immuable que la release exige et promeut. La validation de tag exécute en complément ses propres contrôles et smoke tests.

### 8.3 Vérifier les livrables

Télécharger le bundle et contrôler :

```bash
sha256sum --check spity-0.1.1.tar.gz.sha256
tar --list --gzip --file spity-0.1.1.tar.gz
```

L'archive doit contenir le Compose de production, le modèle d'environnement, `DEPLOYMENT.md`, le changelog et `release-manifest.json`. Comparer les digests du manifeste avec GHCR avant déploiement.

## 9. Mise à jour d'une instance déployée

Suivre dans l'ordre le [manuel de déploiement](./12_MANUEL_DEPLOIEMENT_C241.md) :

1. conserver l'ancienne version, son SHA et ses digests ;
2. vérifier le nouveau bundle et préparer `.env.production` ;
3. tirer les images versionnées ;
4. attendre MariaDB saine et créer une sauvegarde externalisée ;
5. exécuter le conteneur de migration ponctuel ;
6. démarrer l'application sans reconstruction locale ;
7. comparer `/api/health` à la version et au SHA attendus ;
8. exécuter les contrôles fonctionnels HTTPS ;
9. consigner le résultat et conserver les preuves.

Le déploiement ne doit pas utiliser un `docker compose build` improvisé sur le serveur : l'image publiée et testée est la référence.

## 10. Retour arrière d'une mise à jour

Déclencher le retour arrière si la santé échoue, si la version est incohérente, si une fonction critique régresse ou si les erreurs affectent les utilisateurs.

1. noter l'incident et conserver les journaux ;
2. remettre `IMAGE_TAG`, `APP_VERSION` et `APP_REVISION` de la dernière version validée ;
3. relancer l'image applicative précédente ;
4. vérifier santé et parcours critiques ;
5. restaurer la base uniquement si la migration empêche réellement ce retour applicatif ;
6. créer une anomalie avec cause, impact, décision et résultat du retest.

La commande de restauration et ses avertissements figurent dans le [manuel de déploiement, section 9](./12_MANUEL_DEPLOIEMENT_C241.md#9-retour-arrière-et-restauration).

## 11. Maintenance courante

| Fréquence indicative | Contrôle | Trace attendue |
| --- | --- | --- |
| À chaque déploiement | Sauvegarde, migration, santé, version, parcours critiques | Journal de déploiement et manifeste. |
| Hebdomadaire | Disponibilité HTTPS, santé, redémarrages, erreurs applicatives et espace disque | Relevé d'exploitation sans secret. |
| Mensuelle | `npm outdated`, audit de dépendances, images de base et actions CI | Ticket de mise à jour ou acceptation de risque datée. |
| Trimestrielle | Test de restauration sur environnement isolé, revue des accès GHCR et secrets | Procès-verbal de restauration et revue d'accès. |
| Avant soutenance ou release | Recette F01-F10, accessibilité, Lighthouse et contrôle mobile | Rapports CI et captures datées. |

Renouveler un secret compromis immédiatement, invalider les accès associés puis redéployer. Ne pas publier l'ancienne valeur dans le ticket d'incident.

## 12. Traçabilité d'une intervention

Pour chaque mise à jour, conserver :

| Élément | Exemple |
| --- | --- |
| Besoin ou anomalie | Identifiant, scénario, résultat attendu et observé. |
| Source | Branche, pull request, commits et auteur Git. |
| Version | Ancienne et nouvelle versions SemVer. |
| Données | Migration ajoutée, résultat et sauvegarde associée. |
| Validation | Commandes, rapports, URL d'exécution CI et décisions de revue. |
| Artefact | Tag, SHA, images et digests du manifeste. |
| Exploitation | Heure, opérateur, santé, contrôles fonctionnels et retour arrière éventuel. |

Cette chaîne relie une décision métier à la version effectivement exploitée et rend les évolutions futures compréhensibles par une autre équipe.

## 13. Checklist de maintenance

- [ ] Besoin, risque, version et plan de retour arrière qualifiés.
- [ ] Branche dédiée et historique Git propre.
- [ ] Contrats Zod, code strict et tests mis à jour.
- [ ] Nouvelle migration relue si le schéma change ; aucune ancienne migration modifiée.
- [ ] Changelog et documentation d'exploitation actualisés.
- [ ] Portes locales et CI réussies sans abaissement des seuils.
- [ ] SHA candidat réellement promu par le staging.
- [ ] Tag immuable, bundle, somme et manifeste vérifiés.
- [ ] Sauvegarde et contrôles post-déploiement consignés.
