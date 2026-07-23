# Mes quatre compétences déterminantes du bloc 2

Les compétences C2.2.1, C2.2.2, C2.2.3 et C2.3.1 sont déterminantes pour la validation de mon bloc 2. Je ne veux donc pas seulement renvoyer vers du code ou annoncer qu'un contrôle est « conforme ». Dans ce chapitre, je reprends les indicateurs de la grille et j'explique ce que j'ai réellement réalisé, le résultat que j'ai obtenu et la preuve que je peux présenter au jury.

## C2.2.1 - Concevoir un prototype fonctionnel, maintenable et sécurisé

### Ce que je dois démontrer

La grille attend une architecture structurée, un prototype présenté et l'utilisation justifiée de frameworks et de paradigmes de développement. Elle vérifie aussi cinq résultats : le respect des bonnes pratiques, la réponse au besoin, la cohérence des fonctionnalités et des user stories, le fonctionnement des composants d'interface et la prise en compte de la sécurité.

### Ce que j'ai conçu

J'ai conçu Spity comme une application web responsive utilisable sur ordinateur et mobile. J'ai volontairement limité le prototype à dix fonctions démontrables, de F01 à F10, plutôt que de simuler toute la vision produit. Le parcours principal relie l'inscription, le profil grimpeur, la recherche d'un partenaire, les demandes de partenariat et l'inscription à un événement. Le parcours club permet de créer son profil, publier un événement, suivre les participants, modifier la capacité et annuler l'événement.

J'ai retenu une architecture en couches dans un seul projet TypeScript :

1. les pages Next.js et les composants React présentent les données et les actions ;
2. les Route Handlers contrôlent la session, le rôle, l'origine et les entrées Zod ;
3. les fonctions métier TypeScript portent les règles de matching, d'événement et de capacité ;
4. les repositories Drizzle isolent la persistance ;
5. MariaDB garantit les relations, les contraintes uniques et les transactions.

Next.js et React répondent au besoin web et responsive. Tailwind et mon design system évitent de dupliquer les composants. React Hook Form et Zod donnent une validation cohérente entre les formulaires et l'API. Drizzle me permet de conserver des requêtes typées et des migrations versionnées. Je sépare les fonctionnalités dans `src/features/` afin qu'un changement sur les événements n'oblige pas à modifier le matching ou les profils.

### Correspondance avec les indicateurs officiels

| Indicateur de la grille | Ma réalisation vérifiable | Résultat |
| --- | --- | :---: |
| Bonnes pratiques, frameworks et paradigmes | TypeScript strict, App Router, composants réutilisables, validation Zod, règles métier pures, repositories Drizzle et migrations additives. | Couvert |
| Prototype fonctionnel répondant aux besoins | Deux rôles et dix fonctions F01-F10 reliés dans des parcours de bout en bout. | Couvert |
| Ensemble cohérent de fonctions et de user stories | F01-F04 couvrent l'accès et le matching ; F05-F08 couvrent les événements ; F09-F10 portent les exigences transverses. | Couvert |
| Composants d'interface présents et fonctionnels | Formulaires, navigation, filtres, cartes, états vides, boutons et retours d'erreur testés sur desktop et à 360 px. | Couvert |
| Exigences de sécurité | Session signée, rôles, contrôle du propriétaire, CSRF, quota, Zod, requêtes paramétrées, transactions et en-têtes HTTP. | Couvert |

Je peux démontrer ce résultat sans préparation spéciale sur [spity.fr](https://spity.fr) : je me connecte comme grimpeur, je filtre les partenaires et je m'inscris à un événement ; je passe ensuite sur le compte club pour retrouver le participant et administrer l'événement. Les captures A1 à A4 montrent les interfaces desktop et mobile. L'[architecture détaillée](./05_ARCHITECTURE_PROTOTYPE_C221.md) relie chaque user story à sa route, sa règle et sa preuve.

## C2.2.2 - Développer un harnais de tests couvrant la majorité du code

### Ce que je dois démontrer

La grille demande un jeu de tests unitaires portant sur les fonctionnalités demandées et couvrant la majorité du code développé. Pour éviter une couverture artificielle, ma configuration mesure tout `src/`, y compris les fichiers sans test, et pas seulement les modules faciles à tester.

### Mon harnais de tests

J'utilise Jest, jsdom et React Testing Library. Mes 23 suites regroupent 126 tests. Elles contrôlent notamment :

- les schémas Zod et les entrées invalides ;
- les règles de matching et d'événements, dont les limites de capacité ;
- le contrôle CSRF, le quota et les en-têtes de sécurité ;
- le parseur de matériel et ses cas limites ;
- les composants partagés, les formulaires et la navigation clavier ;
- les tableaux de bord, profils, lieux, partenariats et événements ;
- le contrat des tables Drizzle nécessaires au prototype.

Le fichier [`jest.config.ts`](../../spity/jest.config.ts) impose quatre seuils globaux. Si un seuil baisse, `npm run test:coverage` échoue et le job `Quality gates` bloque le staging.

| Indicateur mesuré sur tout `src/` | Résultat | Seuil bloquant | Décision |
| --- | ---: | ---: | :---: |
| Lignes | 62,56 % | 60 % | Conforme |
| Instructions | 62,56 % | 60 % | Conforme |
| Branches | 77,67 % | 75 % | Conforme |
| Fonctions | 55,06 % | 55 % | Conforme |
| Exécution | 126 tests dans 23 suites | 100 % des tests réussis | Conforme |

La couverture des lignes, instructions, branches et fonctions dépasse donc la moitié du code mesuré. La capture A8 montre le rapport global produit par Jest. Je complète les tests unitaires avec une intégration HTTP/MariaDB et une recette Playwright, mais je ne les additionne pas artificiellement au pourcentage unitaire.

Le harnais a déjà détecté une vraie régression : la virgule décimale de `9,1 mm` était interprétée comme un séparateur de matériel. J'ai ajouté le cas de test, corrigé le découpage puis exécuté toute la suite. Cette anomalie montre que les tests protègent un comportement métier concret et ne servent pas uniquement à produire un chiffre. Le détail des suites et de la progression se trouve dans le [document du harnais](./04_HARNAIS_TESTS_UNITAIRES.md).

Je garde une limite explicite : plusieurs Route Handlers et repositories sont moins couverts que les règles et composants. Le seuil global officiel est atteint, mais ma prochaine étape technique consiste à isoler davantage ces dépendances pour augmenter la couverture serveur sans remplacer les tests d'intégration.

## C2.2.3 - Garantir l'évolutivité, la sécurité et l'accessibilité

### Ce que je dois démontrer

La grille demande une présentation des mesures de sécurité couvrant les dix risques OWASP, le choix justifié d'un référentiel d'accessibilité et la preuve que le prototype respecte les exigences applicables de ce référentiel. J'ai aussi relié ces contrôles aux spécifications techniques et fonctionnelles du projet.

### Sécurité mise en œuvre

J'ai utilisé l'OWASP Top 10:2025, version la plus récente au moment du dossier. La matrice complète est disponible dans mon [audit de sécurité](./07_SECURITE_OWASP_C223.md). Les mesures ne sont pas seulement documentées : elles se retrouvent dans le code, les tests unitaires, les tests HTTP/MariaDB et la CI.

| Catégorie OWASP | Mesure principale que j'ai mise en œuvre |
| --- | --- |
| A01 Contrôle d'accès | Session serveur, rôles, propriétaire/destinataire vérifiés, réponses 401/403 et contrôle CSRF. |
| A02 Mauvaise configuration | Variables validées, CSP, HSTS, `nosniff`, anti-frame et suppression de l'en-tête de technologie. |
| A03 Chaîne logicielle | Lockfile, `npm ci`, audit bloquant sur haut/critique et Dependabot npm/Actions. |
| A04 Cryptographie | bcrypt facteur 12, secret HMAC borné, comparaison constante et cookie `HttpOnly`/`Secure`. |
| A05 Injection | Zod, Drizzle paramétré, rendu React échappé et absence de SQL ou HTML concaténé. |
| A06 Conception non sûre | Transitions métier bornées, paire unique, transaction et verrou lors de la dernière place. |
| A07 Authentification | Erreur neutre, verrouillage du compte, quota 10/15 min et session signée expirante. |
| A08 Intégrité | Migrations et dépendances versionnées, réponses API typées, artefacts reliés au SHA. |
| A09 Journalisation | Événements JSON sans email, mot de passe ni jeton ; conservation des résultats CI. |
| A10 Cas exceptionnels | JSON invalide géré, réponses sans stack, transactions, healthcheck et error boundary. |

J'annonce aussi les risques résiduels : quota mémoire mono-instance, alerting non centralisé, session non révocable avant expiration et deux alertes PostCSS modérées. Je préfère présenter ces limites et leur plan de traitement plutôt que revendiquer une sécurité de production que le prototype n'a pas encore.

### Accessibilité mise en œuvre

J'ai choisi le RGAA 4.1.2 parce qu'il s'agit du référentiel français directement applicable à une interface web et qu'il donne des critères vérifiables sur la structure, le clavier, les formulaires, les couleurs et la consultation. Mon échantillon contient les pages publiques, huit états authentifiés et deux vues mobiles à 360 px.

Mon premier audit a révélé des défauts concrets : absence de lien d'évitement, retours non annoncés, contrastes insuffisants, hiérarchie de titres incorrecte et débordements sur mobile. J'ai corrigé ces points avec un lien vers le contenu principal, `role="alert"` et `aria-live`, des couleurs à plus de 4,5:1, des titres ordonnés, une commande mobile de 44 x 44 px, un reflow sans largeur parasite et la prise en charge de `prefers-reduced-motion`.

Les résultats après correction sont les suivants : aucune violation axe sur l'échantillon, accessibilité Lighthouse à 100 % sur les trois pages publiques, huit états authentifiés et deux vues mobiles, et aucun débordement du document à 360 px. Ces contrôles sont bloquants dans la CI. Le [rapport RGAA](./08_ACCESSIBILITE_RGAA_C223.md) reprend les treize thèmes, les critères applicables, les corrections avant/après et les limites des outils automatiques.

L'évolutivité est assurée par la séparation des fonctionnalités, les composants partagés, les contrats Zod et les migrations additives. La conformité fonctionnelle est vérifiée par les mêmes fonctions F01-F10 que celles annoncées dans le périmètre : je ne teste pas un produit différent de celui que je présente.

## C2.3.1 - Élaborer et exécuter le cahier de recettes

### Ce que je dois démontrer

La grille vérifie que le cahier reprend toutes les fonctionnalités attendues et que les tests fonctionnels, structurels et de sécurité ont réellement été exécutés conformément au plan. Mon cahier ne se limite donc pas à une liste de scénarios futurs : il contient les préconditions, les actions, les résultats attendus, les résultats obtenus et la décision de recette.

### Ma recette exécutée

J'ai relié les dix fonctions du périmètre à six scénarios Playwright exécutés sur le build standalone avec une MariaDB créée et migrée pour la recette.

| Scénario | Fonctions et risques vérifiés | Résultat obtenu |
| --- | --- | :---: |
| REC-F01-001 | Mot de passe faible, inscription, onboarding, session, déconnexion et reconnexion. | Conforme |
| REC-F02-001 | Consultation et modification du profil grimpeur, puis création d'un profil club. | Conforme |
| REC-F03-F04-001 | Filtres combinés, état vide, demandes, acceptation, refus et historique. | Conforme |
| REC-F05-F08-001 | Création d'un événement, dernière place, confidentialité, capacité, désinscription et annulation. | Conforme |
| REC-F09-001 | Accès anonyme, mauvais rôle, origine étrangère, UUID invalide, CSP et réponses sûres. | Conforme |
| REC-F10-001 | Navigation clavier, titre, nom accessible, mouvement réduit et reflow à 360 px. | Conforme |

La couverture fonctionnelle est complète pour le périmètre annoncé : F01 à F10 possèdent toutes une preuve navigateur et une preuve complémentaire unitaire ou d'intégration. Les contrôles structurels ajoutent ESLint, TypeScript strict et le build de 28 routes. Les contrôles de sécurité ajoutent l'audit des dépendances, les tests CSRF/quota et les autorisations HTTP. L'accessibilité ajoute axe et Lighthouse.

Le résultat de référence est de 6 scénarios réussis sur 6, sans test ignoré, instable ou rejoué. Les 126 tests unitaires, les 11 résultats d'intégration et les cinq jobs de la CI sont également réussis. La capture A9 montre le rapport Playwright et le run GitHub Actions 29831871915 confirme que le staging n'a commencé qu'après la réussite des quatre portes précédentes.

Les scénarios exécutables sont conservés dans [`tests/acceptance/bc02-recipe.spec.ts`](../../spity/tests/acceptance/bc02-recipe.spec.ts). Le [cahier de recettes complet](./10_CAHIER_RECETTES_C231.md) documente les critères d'entrée, les données, la matrice F01-F10, les résultats et les artefacts. Ma décision de recette est donc « favorable pour le périmètre BC02 », avec les fonctions hors périmètre toujours annoncées comme telles.

## Synthèse de validation

| Compétence déterminante | Preuve centrale | Résultat |
| --- | --- | :---: |
| C2.2.1 | Prototype desktop/mobile, architecture et parcours F01-F10 | Couvert |
| C2.2.2 | 126 tests, couverture globale majoritaire et seuils CI | Couvert |
| C2.2.3 | Matrices OWASP/RGAA, corrections et audits automatisés | Couvert sur le prototype |
| C2.3.1 | Cahier F01-F10 et six scénarios Playwright exécutés | Couvert |

Pendant la soutenance, je commencerai par ces quatre compétences. Pour chacune, je présenterai d'abord le besoin, puis une manipulation ou un résultat, et enfin le fichier de preuve. Cela me permet de montrer que le prototype, les tests, la sécurité, l'accessibilité et la recette correspondent au même périmètre fonctionnel.
