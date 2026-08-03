# Plan de correction des bogues - C2.3.2

## 1. Objectif

Ce registre qualifie les anomalies réellement détectées pendant le développement et la recette de Spity. Il relie chaque échec à son impact, sa cause, sa correction et son retest. Aucun bogue ni résultat utilisateur n'est inventé.

## 2. Méthode de traitement

### Qualification

| Sévérité | Définition | Délai cible |
| --- | --- | --- |
| Bloquante | Empêche la CI, le déploiement ou un parcours critique sans contournement. | Correction avant toute livraison |
| Majeure | Altère une fonction métier importante ou son intégrité, avec contournement limité. | Lot courant |
| Mineure | Dégrade l'accessibilité, la preuve ou l'exploitation sans perte métier immédiate. | Lot courant ou suivant |

La priorité combine la sévérité, la fréquence, le risque de régression et l'exposition utilisateur : `P0` immédiat, `P1` avant livraison, `P2` planifié.

### Cycle

1. Conserver la commande, l'entrée et le résultat qui échoue.
2. Reproduire sur un environnement contrôlé.
3. Qualifier l'impact, la sévérité et la priorité.
4. Identifier la cause racine et le point de contrôle manquant.
5. Corriger sans réduire les seuils de qualité.
6. Ajouter ou renforcer un test automatisé.
7. Rejouer le test ciblé puis le pipeline complet.
8. Fermer uniquement lorsque le résultat attendu est obtenu et traçable par SHA.

## 3. Registre des anomalies traitées

| ID | Anomalie et impact | Sévérité / priorité | Cause racine | Correction et SHA | Retest | État |
| --- | --- | --- | --- | --- | --- | :---: |
| BUG-TEST-001 | `9,1 mm` était découpé en deux articles ; diamètre et couleur du matériel étaient perdus. | Majeure / P1 | Toutes les virgules étaient considérées comme séparateurs de liste. | Ne plus découper une virgule introduisant une décimale et préserver le texte des catégories inconnues. `eb837f4` | Cas `Beal Joker corde 60 m 9,1 mm turquoise` ; parseur à 100 % de couverture. | Fermée |
| BUG-CI-002 | Les rapports Lighthouse existaient mais l'artefact CI ne les embarquait pas, supprimant une preuve du contrôle. | Majeure / P1 | `.lighthouseci` est caché et l'upload excluait les fichiers cachés. | Ajouter `include-hidden-files: true`. `25d0de5` | Artefact `lighthouse-25d0de5...` produit et téléchargeable. | Fermée |
| BUG-MATCH-003 | Un profil ayant désactivé sa recherche restait contactable lors d'une nouvelle demande. | Majeure / P1 | Le même accès public servait à l'éligibilité au matching et à la restitution de l'historique. | Utiliser un accès dédié qui exige `partnerSearch.enabled` tout en gardant l'accès public pour l'historique. `1db84b8` | CI `29739778393`, tests de matching et historique acceptée/refusée de REC-F03-F04-001. | Fermée |
| BUG-CI-004 | GitHub annotait les jobs avec la dépréciation du runtime Node.js 20 des actions. | Mineure / P1 | `setup-node@v4` et `upload-artifact@v4` ciblaient l'ancien runtime des actions. | Migrer les actions officielles vers `v6`. `8be8a29` | CI `29744313577` réussie sans annotation. | Fermée |
| BUG-A11Y-005 | Le titre visuel « Aucun profil ne correspond » était annoncé comme paragraphe, ce qui dégradait la navigation par titres. | Mineure / P1 | Le composant partagé `EmptyState` utilisait un élément `p` pour son titre. | Remplacer le paragraphe par un `h2` et ajouter un test de rôle/niveau. `2941a44` | Test Jest dédié et REC-F03-F04-001 réussis ; 86/86 tests. | Fermée |
| BUG-TEST-006 | L'ajout de Playwright faisait collecter le fichier de recette par Jest et bloquait `npm run quality`. | Bloquante / P0 | Le motif Jest excluait l'intégration mais pas `tests/acceptance`. | Exclure explicitement le dossier Playwright de Jest. `2941a44` | Avant : 13 suites réussies et 1 suite en erreur ; après : 13/13 suites et 86/86 tests. | Fermée |
| BUG-TEST-007 | Une exécution de recette sur un commit documentaire a échoué et a bloqué le staging, alors que le même code produit passait localement et dans la CI précédente. | Bloquante / P0 | Le job ciblait `next dev` sur un cache froid et compilait les routes pendant la recette au lieu de tester l'artefact livré. | Construire le mode standalone, copier ses assets puis exécuter Playwright contre `node server.js`. Utiliser `localhost` en CI afin que le cookie `Secure` reste valide sur la boucle locale. `689e59d` | 6/6 localement en 14,5 s sur le standalone ; CI `29750556481` et staging réussis sans retry. | Fermée |

## 4. Analyse des échecs de la recette Playwright

| Échec observé | Qualification | Amélioration appliquée | Prévention |
| --- | --- | --- | --- |
| « Mot de passe » ciblait le champ et le bouton d'affichage. | Harnais, sans défaut produit. | Ciblage explicite de `#register-password` et `#login-password`. | Utiliser rôle + nom seulement lorsqu'ils identifient un élément unique. |
| `getByRole('alert')` trouvait aussi l'annonceur de route Next.js. | Harnais, sans défaut produit. | Assertion sur l'identifiant de l'erreur rattachée au champ. | Préférer la relation champ-erreur à un rôle global non unique. |
| Deux liens « Entrer dans l'app » étaient présents après onboarding. | Harnais ; les deux commandes ont la même destination valide. | Sélection déterministe du premier raccourci visible. | Limiter les assertions strictes aux commandes uniques ou les cadrer par région. |
| L'état vide n'était pas trouvé comme titre. | Défaut produit BUG-A11Y-005. | Titre partagé rendu en `h2`. | Test unitaire sémantique et scénario navigateur maintenus dans la CI. |
| Jest chargeait la suite Playwright. | Défaut d'outillage BUG-TEST-006. | Séparation explicite des répertoires de tests. | `npm run quality` et `npm run test:acceptance` sont deux portes CI indépendantes. |
| La recette distante `29749715001` a échoué sur un SHA ne modifiant pas l'application. | Harnais BUG-TEST-007 ; le staging a été correctement ignoré. | Remplacement du serveur de développement par le build standalone utilisé dans Docker. | Aucun retry ajouté ; la CI suivante doit réussir les quatre portes avant de reconstruire le staging. |
| Le standalone renvoyait `401` après inscription sur `127.0.0.1`. | Harnais ; le cookie de production est volontairement `Secure`. | URL de boucle locale CI alignée sur `localhost`, sans affaiblir le cookie ni modifier la production. | Test local avec `NODE_ENV=production`, puis exécution distante sur un runner neuf. |

Ces échecs n'ont pas été masqués par des délais plus longs, des retries ou une baisse de seuil. Chaque cause a été corrigée au niveau du produit ou du harnais, puis la recette complète a été rejouée sans test ignoré ni instable.

## 5. Preuves avant et après

| Contrôle | Avant | Après |
| --- | --- | --- |
| Recette navigateur | Échecs successifs conservant captures, vidéos et traces. | 6/6 en 14,5 s sur le build standalone ; aucun retry ni skip. |
| Structure de l'état vide | Titre exposé comme paragraphe. | `h2` vérifié par Jest et Playwright. |
| Coexistence Jest/Playwright | 1 suite en erreur lors de `npm run quality`. | 13/13 suites, 86/86 tests. |
| Couverture | Seuils maintenus. | Lignes 96 %, branches 89,69 %, fonctions 100 %. |
| Construction | Non exécutée après le premier échec Jest. | Build Next.js réussi, 28 routes générées. |
| Sécurité des dépendances | Seuil inchangé. | 0 haute, 0 critique ; 2 modérées documentées. |

## 6. Risques suivis et décision

Deux avis PostCSS modérés restent ouverts dans une dépendance embarquée par Next.js. La correction automatique proposée impose un downgrade majeur incohérent ; le risque est accepté temporairement selon l'analyse [OWASP C2.2.3](./07_SECURITE_OWASP_C223.md), avec une CI bloquante dès le niveau haut.

La session pilote avec des utilisateurs distincts du développeur reste à organiser. Elle pourra ouvrir de nouvelles anomalies d'usage ; celles-ci devront reprendre le même cycle de qualification, correction et retest.

À la date du 20 juillet 2026, aucune anomalie bloquante ou majeure connue de la recette F01 à F10 ne reste ouverte. La correction est considérée conforme lorsque le job distant de recette et les trois portes existantes sont réussis avant staging.

L'[exécution GitHub Actions no 29750556481](https://github.com/Dorianyloj/spity/actions/runs/29750556481) constitue le retest de BUG-TEST-007 : qualité, intégration MariaDB, Lighthouse, recette standalone et staging sont tous réussis sur le SHA `689e59dccf15dc611dbddccea9cf81ccc187c40c`.
