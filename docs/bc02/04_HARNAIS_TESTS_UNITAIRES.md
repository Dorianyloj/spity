# Harnais de tests unitaires - C2.2.2

## 1. Objectif et périmètre global

Le harnais de tests prévient les régressions sur les règles métier déjà isolées de Spity. Il couvre actuellement :

- la validation des comptes, mots de passe, profils, cotations, contenus et événements ;
- la validation et la normalisation du profil public et du matériel ;
- l'analyse d'une saisie libre de matériel d'escalade ;
- le contrôle d'origine utilisé contre les requêtes intersites ;
- les règles de filtrage, de paire unique et de conversion des données de matching ;
- les règles de dates, de capacité et d'inscription aux événements ;
- les états clavier et chargement du composant `Button` ;
- les pages d'accueil et du design system ;
- les tableaux de bord grimpeur et club, l'annuaire de lieux et les filtres de matching ;
- les formulaires de profil et l'inventaire de matériel ;
- les demandes de partenariat et les inscriptions, modifications et annulations d'événements ;
- le contrat des tables et des clés étrangères du schéma Drizzle.

La mesure porte sur tous les fichiers TypeScript et TSX de `src/`, à l'exception des fichiers de test et des déclarations TypeScript. Aucun module applicatif n'est retiré pour améliorer artificiellement le pourcentage.

## 2. Outils et configuration

| Outil | Rôle |
| --- | --- |
| Jest | Exécution et assertions des tests unitaires |
| `next/jest` | Transformation TypeScript/JSX cohérente avec Next.js |
| jsdom | Simulation de l'environnement du navigateur |
| React Testing Library | Test des composants selon leur comportement visible |
| `@testing-library/user-event` | Simulation des interactions clavier et utilisateur |
| V8 coverage | Mesure des lignes, instructions, fonctions et branches |

Commandes disponibles :

```bash
npm test
npm run test:watch
npm run test:coverage
```

Les seuils globaux bloquants sont :

- 60 % pour les lignes et instructions ;
- 55 % pour les fonctions ;
- 75 % pour les branches ;
- 100 % des tests réussis.

## 3. Organisation des tests

| Fichier de test | Risques contrôlés |
| --- | --- |
| `src/lib/validators.test.ts` | Entrées invalides, mot de passe faible, cotation incorrecte, contenu vide, capacité invalide |
| `src/features/profile/schemas.test.ts` | Normalisation des champs, coercition des formulaires, limites de quantité et de disponibilité |
| `src/features/profile/lib/equipment-parser.test.ts` | Catégorie, marque, modèle, quantité, dimensions, séparateurs et valeurs inconnues |
| `src/features/auth/lib/csrf.test.ts` | Origine absente, identique, externe, invalide et réponse 403 typée |
| `src/features/matching/lib/matching-rules.test.ts` | Clé de paire stable, JSON MariaDB, filtres combinés, localité, niveau et disponibilité |
| `src/features/events/lib/event-rules.test.ts` | Dates futures, ordre début/fin, capacité et refus des inscriptions invalides |
| `src/features/events/schemas.test.ts` | Contrats de création, modification, annulation et formulaire d'événement |
| `src/components/ui/button.test.tsx` | Activation au clavier, focus, verrouillage et état `aria-busy` |
| `src/app/page.test.tsx` et `src/app/design-system/page.test.tsx` | Contenu public, liens d'accès et rendu des composants partagés |
| `src/features/app/components/app-dashboard.test.tsx` | Variantes grimpeur/club, recommandations, matériel et navigation par rôle |
| `src/features/places/components/places-directory.test.tsx` | Recherche, filtres, compteurs et états vides des lieux |
| `src/features/profile/components/*.test.tsx` | Chargement, modification de profil, inventaire, analyse libre et erreurs API |
| `src/features/matching/components/*.test.tsx` | Filtres, envoi, acceptation, refus, statuts et erreurs API des partenariats |
| `src/features/events/components/events-board.test.tsx` | Inscription, désinscription, édition, annulation et capacité des événements |
| `src/db/schema.test.ts` | Noms des tables et colonnes relationnelles nécessaires aux parcours métier |

Les tests suivent le modèle AAA : préparation des données, exécution du comportement, puis assertions sur le résultat observable.

## 4. Résultat de référence

Exécution locale du 21 juillet 2026 sur le commit `9bb4efa` :

```text
Test Suites: 23 passed, 23 total
Tests:       126 passed, 126 total
```

| Indicateur | Résultat | Seuil | Statut |
| --- | ---: | ---: | --- |
| Instructions | 62,56 % (`6512/10409`) | 60 % | Conforme |
| Lignes | 62,56 % (`6512/10409`) | 60 % | Conforme |
| Fonctions | 55,06 % (`125/227`) | 55 % | Conforme |
| Branches | 77,67 % (`675/869`) | 75 % | Conforme |

Le rapport HTML est généré dans `spity/coverage/lcov-report/`. Ce dossier est ignoré par Git ; la CI conserve le rapport comme artefact pendant 30 jours.

La [CI no 29827790355](https://github.com/Dorianyloj/spity/actions/runs/29827790355) reproduit ce résultat sur le commit `b9e34c2` : le job `Quality gates` réussit et publie l'artefact `coverage-b9e34c2...` de 426 856 octets.

## 5. Complément d'intégration MariaDB

Les 126 tests Jest restent des tests unitaires rapides. Ils sont complétés par le scénario HTTP décrit dans [`06_TESTS_INTEGRATION_C222.md`](./06_TESTS_INTEGRATION_C222.md), qui applique les migrations sur MariaDB et traverse les Route Handlers, la session, les dépôts Drizzle et les contraintes de base.

Le résultat local de référence est de 10 contrôles TAP réussis, dont deux inscriptions concurrentes sur la dernière place d'un événement.

## 6. Régression détectée par le harnais

Identifiant provisoire : `BUG-TEST-001`.

| Champ | Valeur |
| --- | --- |
| Contexte | Analyse de la saisie libre d'un inventaire de matériel |
| Entrée | `Beal Joker corde 60 m 9,1 mm turquoise` |
| Résultat incorrect | La virgule décimale séparait l'entrée en deux articles ; le diamètre et la couleur étaient perdus |
| Cause | L'expression de découpage traitait toutes les virgules comme des séparateurs de liste |
| Correction | Ne séparer une virgule que lorsqu'elle n'introduit pas la partie décimale d'un nombre |
| Défaut associé | Une catégorie inconnue produisait aussi un modèle générique au lieu de conserver le libellé saisi |
| Retest | Les 49 tests passent et le parseur atteint 100 % sur les quatre indicateurs |

Cet exemple alimentera le plan de correction C2.3.2 avec le SHA du commit et la preuve avant/après.

## 7. Limites et progression

La grille demande que les tests couvrent la majorité du code développé. Le résultat global de 62,56 % des lignes et instructions satisfait ce critère et reste contrôlé par la CI.

Les prochains lots peuvent encore renforcer :

1. la création et la vérification des sessions ;
2. le verrouillage après échecs de connexion ;
3. les dépôts de matériel avec une base de test ;
4. les Route Handlers d'authentification, de profil, de matching et d'événements ;
5. les dépôts Drizzle avec davantage de cas d'erreur et de concurrence ;
6. les Server Components asynchrones des fiches de lieux ;
7. les parcours visuels avec Playwright, en complément des tests HTTP et unitaires.

Les Server Components asynchrones seront vérifiés par des tests de bout en bout, conformément à la recommandation actuelle de Next.js.
