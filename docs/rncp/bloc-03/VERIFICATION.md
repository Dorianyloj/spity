# Vérification du kit et de l'application

Contrôles du 15 septembre 2026 sur 9d166c0, arbre applicatif 9109ce976825a6536fa1c7219a2b5ef5e8c3b64c, incluant les évolutions du matching à cette révision. Les résultats du 14 septembre restent dans preuves/verification-2026-09-14.json. Les trois captures du 15 septembre sont identifiées dans preuves/captures/manifest.json. Linear conserve son relevé distinct du 14 septembre.

| Contrôle réellement exécuté | Résultat | Portée |
| --- | --- | --- |
| Lint | Réussi | Analyse ESLint du projet. |
| TypeScript | Réussi | Contrôle statique sans émission. |
| Tests unitaires | 389 tests réussis dans 72 suites | Aucun test ignoré ou instantané annoncé ; ce résultat n'est pas une couverture en pourcentage. |
| Build Next.js | Réussi, version installée 16.3.4 | Construction de l'application et vérification TypeScript. |
| MariaDB de démonstration | Base dédiée préparée, réutilisée | Base dédiée spity_bloc3_demo sur 127.0.0.1:33313 ; la base habituelle n'est pas réinitialisée. |
| Recette navigateur | Six scénarios réussis, aucun échec, skip ou flaky | Inscription, profils, matching, partenariats, événements, droits et navigation mobile/clavier. |

Les contrôles ont utilisé Node.js 24.14.0 ; Node.js 22 reste la référence du projet. Le runtime documentaire est distinct. Le build a réussi avec l'accès aux polices Google ; l'échec réseau du 14 septembre reste archivé.

La recette locale utilise next dev sur le port 3313, selon la configuration hors CI. Ce résultat ne vaut pas nouvelle recette distante du standalone. L'avertissement décoratif VANTA « No THREE defined on window » n'a pas empêché les six parcours de réussir. Aucun déploiement de production, audit externe ou accord client réel n'est déclaré.

## Portée sur la version présentée

Ces résultats ne certifient pas la version courante si elle diffère de l'arbre testé. Au contrôle documentaire du 15 septembre, partnership-center.tsx et partnership-center.test.tsx différaient localement de HEAD. Ces changements n'ont pas reçu de nouvelle recette dans cette revue. Le contrôle du kit distingue HEAD, les modifications locales et la preuve datée. Stabiliser la version à présenter, rejouer les contrôles et le parcours complet, puis actualiser la preuve.

## Vérification des livrables

Le classeur comporte cinq feuilles, trente activités et 175 formules sans erreur exportée. Les contrôles de recalcul portent sur le reste à faire, le taux horaire, une capacité nulle et une entrée manquante ; les entrées sont restaurées avant export. Le taux de 50 % désigne cinq tâches sur dix du cas, sans pondération.

Les rendus PDF et PPTX sont inspectés, sans ouverture déclarée dans Microsoft PowerPoint. La matrice précise les trois compétences éliminatoires du règlement spécial. La checklist conserve rôle personnel, dates, consignes du campus et répétition. Aucun dépôt DigiformaCertif n'est effectué.
