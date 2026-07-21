# Audit de conformité aux documents officiels - BC02

## 1. Objet

Cet audit confronte le dossier Spity aux deux documents officiels fournis pour le titre Expert en développement logiciel RNCP39583. Il distingue la présence d'un livrable de la preuve suffisante d'un critère d'évaluation.

Date de l'audit : 21 juillet 2026.

## 2. Sources contrôlées

| Source officielle | Pages | SHA-256 |
| --- | ---: | --- |
| `24 10 10 Grille évaluation Expert en développement logiciel_BC02.pdf` | 1 | `b708a8204e0944d5e0050b97fe54e2bd8b015a5d9e544a5713a27f07879f3358` |
| `Référentiel Expert en développement logiciel RNCP39583 (1) (1).pdf` | 17 | `4892018d969edff4ea79dfd90b23ec0c37ab5bd618af0cd9b831ba878cfe4466` |

Le bloc 2 comporte neuf compétences, seize livrables attendus et vingt-six critères d'évaluation.

## 3. Verdict

| Contrôle | Résultat |
| --- | --- |
| Compétences recensées | 9/9 |
| Livrables présents dans `docs/bc02/` | 16/16 |
| Critères repris dans l'index du dossier | 26/26 |
| Critères couverts par une preuve suffisante | 25/26 |
| Critère partiellement prouvé | 1/26 : autonomie utilisateur de C2.2.4 |
| Critère à compléter | 0/26 |

Conclusion : le dossier contient toutes les rubriques et tous les livrables demandés. Vingt-cinq critères disposent d'une preuve suffisante ; seule l'autonomie utilisateur de C2.2.4 reste partiellement prouvée.

## 4. Contrôle des seize livrables

| Compétence | Livrable officiel | Preuve Spity | Présence |
| --- | --- | --- | :---: |
| C2.1.1 | Protocole de déploiement continu | [`02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md`](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md) | Oui |
| C2.1.1 | Critères de qualité et de performance | [`02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md`](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md) | Oui |
| C2.1.2 | Protocole d'intégration continue | [`03_PROTOCOLE_INTEGRATION_CONTINUE.md`](./03_PROTOCOLE_INTEGRATION_CONTINUE.md) | Oui |
| C2.2.1 | Architecture structurée et maintenable | [`05_ARCHITECTURE_PROTOTYPE_C221.md`](./05_ARCHITECTURE_PROTOTYPE_C221.md) | Oui |
| C2.2.1 | Présentation d'un prototype | [captures](./annexes/captures) et [`01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md`](./01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md) | Oui |
| C2.2.1 | Frameworks et paradigmes de développement | [`05_ARCHITECTURE_PROTOTYPE_C221.md`](./05_ARCHITECTURE_PROTOTYPE_C221.md) | Oui |
| C2.2.2 | Jeu de tests unitaires | [`04_HARNAIS_TESTS_UNITAIRES.md`](./04_HARNAIS_TESTS_UNITAIRES.md) et vingt-trois suites Jest | Oui |
| C2.2.3 | Présentation des mesures de sécurité | [`07_SECURITE_OWASP_C223.md`](./07_SECURITE_OWASP_C223.md) | Oui |
| C2.2.3 | Actions d'accessibilité | [`08_ACCESSIBILITE_RGAA_C223.md`](./08_ACCESSIBILITE_RGAA_C223.md) | Oui |
| C2.2.4 | Historique des versions | [`09_VERSIONS_DEPLOIEMENTS_C224.md`](./09_VERSIONS_DEPLOIEMENTS_C224.md), Git et [`CHANGELOG.md`](../../CHANGELOG.md) | Oui |
| C2.2.4 | Dernière version fonctionnelle, fiable et viable | release [`v0.1.0`](https://github.com/Dorianyloj/spity/releases/tag/v0.1.0) | Oui |
| C2.3.1 | Cahier de recettes | [`10_CAHIER_RECETTES_C231.md`](./10_CAHIER_RECETTES_C231.md) | Oui |
| C2.3.2 | Plan de correction des bogues | [`11_PLAN_CORRECTION_BOGUES_C232.md`](./11_PLAN_CORRECTION_BOGUES_C232.md) | Oui |
| C2.4.1 | Manuel de déploiement | [`12_MANUEL_DEPLOIEMENT_C241.md`](./12_MANUEL_DEPLOIEMENT_C241.md) | Oui |
| C2.4.1 | Manuel d'utilisation | [`13_MANUEL_UTILISATION_C241.md`](./13_MANUEL_UTILISATION_C241.md) | Oui |
| C2.4.1 | Manuel de mise à jour | [`14_MANUEL_MISE_A_JOUR_C241.md`](./14_MANUEL_MISE_A_JOUR_C241.md) | Oui |

## 5. Contrôle des vingt-six critères

| Compétence | Critères officiels | Couvert | Partiel | À compléter |
| --- | ---: | ---: | ---: | ---: |
| C2.1.1 | 5 | 5 | 0 | 0 |
| C2.1.2 | 2 | 2 | 0 | 0 |
| C2.2.1 | 5 | 5 | 0 | 0 |
| C2.2.2 | 1 | 1 | 0 | 0 |
| C2.2.3 | 3 | 3 | 0 | 0 |
| C2.2.4 | 3 | 2 | 1 | 0 |
| C2.3.1 | 2 | 2 | 0 | 0 |
| C2.3.2 | 3 | 3 | 0 | 0 |
| C2.4.1 | 2 | 2 | 0 | 0 |
| **Total** | **26** | **25** | **1** | **0** |

Le détail ligne par ligne est conservé dans [`15_INDEX_PREUVES_GRILLE_BC02.md`](./15_INDEX_PREUVES_GRILLE_BC02.md).

## 6. Validation C2.2.2 - Couverture unitaire globale

La configuration Jest mesure désormais tous les fichiers TypeScript et TSX de `src/`, hors tests et déclarations. Les seuils globaux sont bloquants dans `npm run test:coverage` et dans la CI.

La mesure exhaustive donne :

| Mesure globale | Résultat du 21 juillet 2026 |
| --- | ---: |
| Instructions | 62,56 % (`6512/10409`) |
| Lignes | 62,56 % (`6512/10409`) |
| Fonctions | 55,06 % (`125/227`) |
| Branches | 77,67 % (`675/869`) |
| Suites et tests réussis | 23 suites, 126 tests |

La majorité du code développé est couverte au sens littéral du critère. Les tests d'intégration MariaDB et la recette Playwright restent complémentaires : ils contrôlent les assemblages HTTP, la persistance réelle et les parcours navigateur.

Le seuil de 60 % des lignes et instructions empêche une régression sous la cible retenue pour la soutenance.

## 7. Écart C2.2.4 - Autonomie utilisateur

La release, les comptes de démonstration, le manuel utilisateur et la recette prouvent que le logiciel peut être manipulé techniquement. En revanche, aucune session avec une personne distincte du développeur n'est encore consignée.

Action attendue : faire exécuter le parcours de recette à au moins deux utilisateurs externes, relever réussite sans aide, durée, blocages et corrections, puis joindre un compte rendu anonymisé.

## 8. Risque de remise hors ligne

Le PDF synthétique contient l'index des vingt-six critères et six annexes essentielles. Les huit documents techniques retirés pour limiter la longueur restent accessibles par des liens GitHub. Pour une remise sans accès réseau, il faut transmettre le PDF avec le dossier `docs/bc02/` ou une archive contenant les quatorze documents techniques et les captures.

## 9. Preuve technique la plus récente

L'[exécution GitHub Actions no 29827790355](https://github.com/Dorianyloj/spity/actions/runs/29827790355), sur le commit `b9e34c2`, a réussi les cinq jobs : qualité avec couverture globale, intégration MariaDB, recette BC02, Lighthouse et images staging. L'artefact `coverage-b9e34c2...` conserve le rapport Jest complet jusqu'au 20 août 2026.
