# Index des critères et des preuves BC02

## 1. Objet

Cet index reprend chaque critère de la grille d'évaluation du bloc 2 du titre Expert en développement logiciel RNCP39583. Il indique où le jury peut trouver l'explication, la réalisation technique et le résultat vérifié.

Sources officielles utilisées :

- Référentiel Expert en développement logiciel RNCP39583, bloc 2, pages 7 à 9 ;
- grille d'évaluation BC02 datée du 10 octobre 2024.

Statuts : **couvert** signifie que l'explication, la réalisation et une vérification suffisante sont présentes ; **partiel** signale une preuve existante mais incomplète ; **à compléter** signifie que le seuil littéral de la grille n'est pas encore atteint.

## 2. Résultat global

| Compétence | Livrable | Statut | Preuve principale |
| --- | --- | :---: | --- |
| C2.1.1 | Protocole de déploiement continu et critères qualité/performance | Couvert | [Environnements et déploiement](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md) |
| C2.1.2 | Protocole d'intégration continue | Couvert | [Protocole CI](./03_PROTOCOLE_INTEGRATION_CONTINUE.md) |
| C2.2.1 | Architecture maintenable et prototype fonctionnel | Couvert | [Architecture du prototype](./05_ARCHITECTURE_PROTOTYPE_C221.md) |
| C2.2.2 | Jeu de tests unitaires | Couvert | [Harnais unitaire](./04_HARNAIS_TESTS_UNITAIRES.md) et [audit officiel](./17_AUDIT_CONFORMITE_OFFICIEL_BC02.md) |
| C2.2.3 | Sécurité et accessibilité | Couvert | [OWASP](./07_SECURITE_OWASP_C223.md) et [RGAA](./08_ACCESSIBILITE_RGAA_C223.md) |
| C2.2.4 | Historique et dernière version fiable | Partiel | [Versions et déploiements](./09_VERSIONS_DEPLOIEMENTS_C224.md) |
| C2.3.1 | Cahier de recettes | Couvert | [Cahier F01 à F10](./10_CAHIER_RECETTES_C231.md) |
| C2.3.2 | Plan de correction des bogues | Couvert | [Registre des anomalies](./11_PLAN_CORRECTION_BOGUES_C232.md) |
| C2.4.1 | Trois manuels d'exploitation | Couvert | [Déploiement](./12_MANUEL_DEPLOIEMENT_C241.md), [utilisation](./13_MANUEL_UTILISATION_C241.md), [maintenance](./14_MANUEL_MISE_A_JOUR_C241.md) |

## 3. C2.1.1 - Environnements, qualité et déploiement

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Le protocole de déploiement continu est explicité. | Séquence de validation, staging immuable, migration, santé, promotion et retour arrière décrite dans les sections 8 et 9. | [Document C2.1.1](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md), [workflow CI](../../.github/workflows/ci.yml), [workflow release](../../.github/workflows/release.yml) | Couvert |
| L'environnement de développement est détaillé. | Node.js 22, npm 10, Next.js, TypeScript, MariaDB, Docker Compose, variables et commandes de démarrage sont précisés. | [Document C2.1.1](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md), [`package.json`](../../spity/package.json), [Compose local](../../spity/docker-compose.yml) | Couvert |
| Les outils permettent d'identifier compilateur, serveur d'application et gestion de sources. | TypeScript est vérifié par `tsc`, Next.js/Node fournit le serveur, Git et GitHub assurent les sources ; Drizzle, Jest, Playwright, Lighthouse et Docker complètent la chaîne. | [Table des outils](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md), [README](../../spity/README.md) | Couvert |
| Le protocole définit les différentes séquences de déploiement. | Conditions d'entrée, sauvegarde, migration one-shot, démarrage, contrôle, promotion et rollback sont ordonnés. | [Manuel de déploiement](./12_MANUEL_DEPLOIEMENT_C241.md), [runbook de release](../../spity/DEPLOYMENT.md) | Couvert |
| Les critères qualité/performance répondent aux exigences du projet. | Seuils lint, typage, couverture globale, vulnérabilités, accessibilité et Lighthouse sont bloquants. | [Seuils C2.1.1](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md), run CI `29827790355`, rapports locaux `.lighthouseci` et `coverage` | Couvert |

## 4. C2.1.2 - Intégration continue

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Le protocole d'intégration continue est explicité clairement. | Déclencheurs, environnement, permissions, stratégie de branches, revue et traitement d'échec sont documentés. | [Protocole CI](./03_PROTOCOLE_INTEGRATION_CONTINUE.md) | Couvert |
| Le protocole définit les séquences d'intégration. | Les jobs qualité, MariaDB/accessibilité, Lighthouse et recette standalone précèdent obligatoirement le staging. | [Workflow CI](../../.github/workflows/ci.yml), [run réussi 29827790355](https://github.com/Dorianyloj/spity/actions/runs/29827790355) | Couvert |

## 5. C2.2.1 - Architecture et prototype

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Les bonnes pratiques de développement sont respectées. | Architecture par feature, TypeScript strict, composants serveur, validation Zod, dépôts Drizzle et composants UI partagés. | [Architecture](./05_ARCHITECTURE_PROTOTYPE_C221.md), [`src/features`](../../spity/src/features), [`src/components/ui`](../../spity/src/components/ui) | Couvert |
| Le prototype est fonctionnel et répond aux besoins identifiés. | Les rôles grimpeur et club réalisent inscription, profil, matching, partenariats et événements. | [Périmètre et user stories](./01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md), [recette](./10_CAHIER_RECETTES_C231.md) | Couvert |
| Le prototype met en œuvre un ensemble cohérent de fonctionnalités et les user stories. | F01 à F10 sont reliées à dix user stories et six scénarios navigateur. | [Traçabilité fonctionnelle](./01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md), [architecture section 5](./05_ARCHITECTURE_PROTOTYPE_C221.md) | Couvert |
| Les composants de l'interface sont présents et fonctionnels. | Formulaires, filtres, onglets, boutons, navigation responsive, états vides et retours d'action sont pilotés par Playwright. | [Captures visuelles](#12-preuves-visuelles), [`tests/acceptance`](../../spity/tests/acceptance) | Couvert |
| Le prototype satisfait les exigences de sécurité. | Sessions HttpOnly, contrôle d'origine, autorisations par rôle, Zod, bcrypt, rate limiting et en-têtes de sécurité sont actifs et testés. | [Matrice OWASP](./07_SECURITE_OWASP_C223.md), scénario `REC-F09-001` | Couvert |

## 6. C2.2.2 - Tests unitaires

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Les tests unitaires couvrent la majorité du code développé. | Les 23 suites et 126 tests mesurent tous les fichiers `src/` et couvrent 62,56 % des lignes/instructions, 77,67 % des branches et 55,06 % des fonctions. Les seuils globaux sont bloquants dans Jest et la CI. | [Harnais et périmètre](./04_HARNAIS_TESTS_UNITAIRES.md), [run CI 29827790355](https://github.com/Dorianyloj/spity/actions/runs/29827790355) | Couvert |

Limite déclarée : la majorité du code est couverte, mais les dépôts Drizzle, les Route Handlers et plusieurs Server Components restent moins couverts que les règles métier et composants interactifs.

## 7. C2.2.3 - Sécurité et accessibilité

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Les mesures couvrent les dix principales failles OWASP. | La matrice OWASP Top 10:2025 associe chaque risque à une mesure, un fichier, un test et un risque résiduel. | [Matrice OWASP](./07_SECURITE_OWASP_C223.md), `npm run security:audit`, scénario `REC-F09-001` | Couvert |
| Le référentiel d'accessibilité est présenté et justifié. | Le RGAA 4.1.2 est retenu pour le contexte français et complété par des tests axe, Lighthouse et manuels. | [Audit RGAA](./08_ACCESSIBILITE_RGAA_C223.md) | Couvert |
| Le prototype répond aux exigences du référentiel établi. | Dix états authentifiés et trois pages publiques obtiennent 100 % en accessibilité automatisée ; clavier, lien d'évitement, mouvement réduit et reflow 360 px sont vérifiés. | [Résultats RGAA](./08_ACCESSIBILITE_RGAA_C223.md), `.accessibility/summary.json`, [captures mobiles](#12-preuves-visuelles) | Couvert |

## 8. C2.2.4 - Versions et version fiable

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Un système de gestion de versions est utilisé. | Git, branches `develop`/`main`, Conventional Commits, SemVer, tags et images par SHA sont utilisés. | [Gestion des versions](./09_VERSIONS_DEPLOIEMENTS_C224.md), [`CHANGELOG.md`](../../CHANGELOG.md), historique Git | Couvert |
| Les évolutions du prototype sont tracées. | Le changelog, les commits, les migrations et le registre d'anomalies relient chaque évolution à une preuve. | [`CHANGELOG.md`](../../CHANGELOG.md), [`drizzle`](../../spity/drizzle), [bogues](./11_PLAN_CORRECTION_BOGUES_C232.md) | Couvert |
| Le logiciel est fonctionnel et manipulable en autonomie. | Une release `v0.1.0`, un bundle, trois manuels et des comptes de démonstration permettent le démarrage et les parcours sans assistance au code. Aucune observation indépendante n'est encore consignée. | [Release v0.1.0](https://github.com/Dorianyloj/spity/releases/tag/v0.1.0), [manuel utilisateur](./13_MANUEL_UTILISATION_C241.md) | Partiel |

Limite déclarée : la recette automatisée et la manipulation par le développeur sont prouvées. Une session pilote formalisée avec des utilisateurs externes au projet reste recommandée avant une exploitation publique.

## 9. C2.3.1 - Cahier de recettes

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Le cahier reprend l'ensemble des fonctionnalités attendues. | Les fonctions F01 à F10 sont toutes reliées à un scénario, des préconditions, des actions et des résultats. | [Cahier de recettes](./10_CAHIER_RECETTES_C231.md), [`bc02-recipe.spec.ts`](../../spity/tests/acceptance/bc02-recipe.spec.ts) | Couvert |
| Les tests fonctionnels, structurels et de sécurité sont conformes au plan. | Six scénarios Playwright vérifient rôles, données, capacité, sécurité, clavier et mobile sur MariaDB migrée. | Run `29819189642`, artefact `acceptance-c1cb0f1...`, [résultats](./10_CAHIER_RECETTES_C231.md) | Couvert |

## 10. C2.3.2 - Correction des bogues

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Les bogues sont détectés, qualifiés et traités. | Sept anomalies réelles comportent impact, sévérité, priorité, cause, correction, SHA et retest. | [Registre des anomalies](./11_PLAN_CORRECTION_BOGUES_C232.md) | Couvert |
| Une analyse des améliorations est réalisée pour chaque test en échec. | Les erreurs produit et les défauts du harnais sont distingués ; chaque échec Playwright observé possède une prévention. | [Analyse des échecs](./11_PLAN_CORRECTION_BOGUES_C232.md) | Couvert |
| Les corrections garantissent le bon fonctionnement attendu. | Aucun seuil ni exigence n'a été abaissé ; la CI suivante et le staging doivent être verts pour fermer une anomalie bloquante. | Runs `29749715001` bloqué puis `29750556481` réussi, commits `2941a44` et `689e59d` | Couvert |

## 11. C2.4.1 - Documentation d'exploitation

| Critère officiel | Explication et réalisation | Preuve vérifiable | Statut |
| --- | --- | --- | :---: |
| Les manuels sont rédigés avec clarté. | Trois documents séparés s'adressent respectivement à l'exploitant, l'utilisateur et le mainteneur ; commandes, rôles, diagnostics et checklists sont explicités. | [Déploiement](./12_MANUEL_DEPLOIEMENT_C241.md), [utilisation](./13_MANUEL_UTILISATION_C241.md), [mise à jour](./14_MANUEL_MISE_A_JOUR_C241.md) | Couvert |
| La documentation décrit les choix de technologies et de langages. | TypeScript, Next.js, React, Zod, Drizzle, MariaDB, Node.js, Docker, GitHub Actions et les outils de tests sont justifiés par couche. | [Choix technologiques](./12_MANUEL_DEPLOIEMENT_C241.md), [repères de maintenance](./14_MANUEL_MISE_A_JOUR_C241.md) | Couvert |

## 12. Preuves visuelles

Les neuf [annexes visuelles](./18_ANNEXES_VISUELLES_BC02.md) rassemblent quatre captures du prototype, les rapports Jest et Playwright, puis trois preuves GitHub : historique des commits, pipeline CI complet et release stable. Ce regroupement évite de répéter les mêmes images dans le corps du dossier.

## 13. Preuves distantes pérennes

| Preuve | URL | Résultat |
| --- | --- | --- |
| CI initiale complète de recette | [Run 29747713909](https://github.com/Dorianyloj/spity/actions/runs/29747713909) | Quatre portes et staging réussis. |
| Blocage réel du staging | [Run 29749715001](https://github.com/Dorianyloj/spity/actions/runs/29749715001) | Recette en échec, staging ignoré. |
| Retest standalone | [Run 29750556481](https://github.com/Dorianyloj/spity/actions/runs/29750556481) | Cinq jobs réussis et images publiées. |
| Release stable | [Spity v0.1.0](https://github.com/Dorianyloj/spity/releases/tag/v0.1.0) | Bundle, manifeste, somme SHA-256 et images versionnées. |
| Audit final du dossier | [Run 29819189642](https://github.com/Dorianyloj/spity/actions/runs/29819189642) | Cinq jobs réussis sur le commit du PDF synthétique. |
| Couverture globale et dossier actualisé | [Run 29827790355](https://github.com/Dorianyloj/spity/actions/runs/29827790355) | 126 tests, seuils globaux, cinq jobs et staging réussis. |

## 14. Points restant à organiser

Ces points doivent être présentés honnêtement au jury ; le premier correspond à la dernière preuve encore insuffisante :

- conduire une session pilote formalisée avec au moins deux utilisateurs externes au développement ;
- poursuivre progressivement la couverture des couches serveur au-delà du seuil global de 60 % ;
- conserver des captures des protections de branches GitHub si elles sont activées dans l'interface distante ;
- exécuter périodiquement un exercice de restauration sur un environnement isolé ;
- poursuivre les fonctions hors prototype : carte interactive, fil social persistant, topos et parcours RGPD autonomes.
