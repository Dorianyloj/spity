# Harnais de tests unitaires - C2.2.2

## 1. Objectif et périmètre initial

Le harnais de tests prévient les régressions sur les règles métier déjà isolées de Spity. Il couvre actuellement :

- la validation des comptes, mots de passe, profils, cotations, contenus et événements ;
- la validation et la normalisation du profil public et du matériel ;
- l'analyse d'une saisie libre de matériel d'escalade ;
- le contrôle d'origine utilisé contre les requêtes intersites ;
- les règles de filtrage, de paire unique et de conversion des données de matching ;
- les règles de dates, de capacité et d'inscription aux événements ;
- les états clavier et chargement du composant `Button`.

Cette première couverture est volontairement mesurée sur les fichiers déclarés dans `jest.config.ts`. Elle ne doit pas être interprétée comme une couverture globale de toute l'application.

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

Les seuils bloquants du périmètre mesuré sont :

- 80 % pour les lignes, instructions et fonctions ;
- 70 % pour les branches ;
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

Les tests suivent le modèle AAA : préparation des données, exécution du comportement, puis assertions sur le résultat observable.

## 4. Résultat de référence

Exécution locale du 20 juillet 2026 :

```text
Test Suites: 8 passed, 8 total
Tests:       69 passed, 69 total
```

| Indicateur | Résultat | Seuil | Statut |
| --- | ---: | ---: | --- |
| Instructions | 97,87 % | 80 % | Conforme |
| Lignes | 97,87 % | 80 % | Conforme |
| Fonctions | 100 % | 80 % | Conforme |
| Branches | 90,90 % | 70 % | Conforme |

Le rapport HTML est généré dans `spity/coverage/lcov-report/`. Ce dossier est ignoré par Git ; la CI conserve le rapport comme artefact pendant 30 jours.

## 5. Régression détectée par le harnais

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

## 6. Limites de la couverture actuelle

La grille demande que les tests couvrent la majorité du code développé. Ce résultat n'est pas encore atteint à l'échelle des 8 000 lignes du projet.

Les prochains lots devront couvrir :

1. la création et la vérification des sessions ;
2. le verrouillage après échecs de connexion ;
3. les dépôts de profils et de matériel avec une base de test ;
4. les autorisations de chaque Route Handler ;
5. les formulaires d'authentification et de profil ;
6. les dépôts matching, partenariats et événements avec MariaDB ;
7. les parcours complets avec Playwright, en complément des tests unitaires.

Les Server Components asynchrones seront vérifiés par des tests de bout en bout, conformément à la recommandation actuelle de Next.js.
