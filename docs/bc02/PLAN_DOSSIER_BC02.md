# Plan de réalisation du dossier BC02

## Objectif

Valider intégralement le bloc 2 « Concevoir et développer des applications logicielles » du titre Expert en développement logiciel RNCP39583 à partir du projet Spity.

Le livrable final devra associer :

- une version stable et manipulable de Spity ;
- le code source et l'historique Git ;
- un dossier écrit répondant explicitement aux huit compétences ;
- des preuves vérifiables : configurations, captures, rapports, scénarios, résultats et historique des corrections.

## Sources officielles

- Référentiel Expert en développement logiciel RNCP39583, bloc 2, pages 7 à 10.
- Grille d'évaluation BC02 du 10 octobre 2024.

## Matrice de couverture initiale

| Compétence | Livrable attendu | État initial de Spity | Travail nécessaire |
| --- | --- | --- | --- |
| C2.1.1 | Protocole de déploiement continu et critères de qualité/performance | Partiel | Décrire les environnements, fiabiliser Docker, définir les séquences de déploiement et les seuils qualité/performance. |
| C2.1.2 | Protocole d'intégration continue | Non couvert | Créer la CI, documenter les déclencheurs, contrôles, branches et conditions de fusion. |
| C2.2.1 | Architecture maintenable, prototype, frameworks et paradigmes | Partiel | Définir le périmètre fonctionnel BC02, compléter le prototype et documenter architecture, choix et user stories. |
| C2.2.2 | Jeu de tests unitaires couvrant une fonctionnalité | Non couvert | Installer le harnais de test, tester les domaines principaux et produire un rapport de couverture majoritaire. |
| C2.2.3 | Mesures de sécurité et d'accessibilité | Partiel | Réaliser les audits OWASP Top 10 et RGAA, corriger les écarts et conserver les preuves. |
| C2.2.4 | Historique des versions et dernière version fiable | Partiel | Mettre en place versions/releases, déploiement progressif, contrôles de stabilité et retours utilisateurs. |
| C2.3.1 | Cahier de recettes | Non couvert | Couvrir toutes les fonctionnalités retenues avec scénarios, préconditions, résultats attendus et résultats obtenus. |
| C2.3.2 | Plan de correction des bogues | Non couvert | Tenir un registre des anomalies, les qualifier, analyser les échecs et tracer les corrections/retests. |
| C2.4.1 | Manuels de déploiement, d'utilisation et de mise à jour | Partiel | Produire trois manuels clairs et documenter les choix techniques. |

## Structure cible du dossier final

1. Présentation de Spity et périmètre du prototype évalué
2. Besoins, acteurs et user stories retenues
3. Architecture logicielle et choix techniques
4. Environnements de développement, test et production
5. Protocoles d'intégration et de déploiement continus
6. Stratégie qualité, tests unitaires et couverture
7. Sécurité et couverture de l'OWASP Top 10
8. Accessibilité et conformité au référentiel choisi
9. Gestion des versions et historique des évolutions
10. Cahier de recettes et résultats d'exécution
11. Registre des anomalies et plan de correction
12. Manuel de déploiement
13. Manuel d'utilisation
14. Manuel de mise à jour et maintenance
15. Bilan, limites et perspectives
16. Annexes et index des preuves

## Progression étape par étape

### Étape 1 - Cadrer le prototype BC02

Document de référence : [Périmètre fonctionnel et user stories](./01_PERIMETRE_FONCTIONNEL_ET_USER_STORIES.md).

- [x] Transformer le cadrage produit en périmètre démontrable.
- [x] Écrire les user stories et leurs critères d'acceptation.
- [x] Identifier ce qui est inclus, reporté ou exclu.
- [x] Relier chaque fonctionnalité à un futur scénario de recette.

### Étape 2 - Environnements et qualité (C2.1.1)

Document de référence : [Environnements, qualité et protocole de déploiement](./02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md).

- [x] Corriger et documenter les configurations d'environnement.
- [x] Définir les environnements développement, test et production.
- [x] Définir les seuils de lint, typage, tests, couverture, sécurité et performance.
- [x] Rédiger le protocole de déploiement continu.

### Étape 3 - Intégration continue (C2.1.2)

- Créer le pipeline CI.
- Exécuter lint, typecheck, tests, couverture, build et contrôles de dépendances.
- Définir la stratégie de branches, revues et fusion.
- Conserver une exécution réussie comme preuve.

### Étape 4 - Prototype maintenable (C2.2.1)

- Corriger les défauts structurants existants.
- Développer les parcours fonctionnels retenus.
- Vérifier les interfaces desktop et mobile.
- Documenter architecture, frameworks, paradigmes et décisions techniques.

### Étape 5 - Tests unitaires (C2.2.2)

- Mettre en place le harnais de test.
- Tester les validateurs, services métier, authentification et composants critiques.
- Atteindre une couverture majoritaire et archiver le rapport.

### Étape 6 - Sécurité et accessibilité (C2.2.3)

- Établir une matrice OWASP Top 10 : risque, mesure, preuve, test et reste à faire.
- Choisir et justifier le référentiel d'accessibilité.
- Réaliser l'audit, corriger les écarts et documenter les résultats.

### Étape 7 - Versions et déploiements (C2.2.4)

- Définir une convention de version.
- Produire des releases traçables.
- Déployer progressivement avec contrôles fonctionnels et techniques.
- Recueillir et documenter des retours utilisateurs.

### Étape 8 - Recette et corrections (C2.3.1 et C2.3.2)

- Exécuter le cahier de recettes complet.
- Enregistrer chaque anomalie avec sévérité, cause et priorité.
- Corriger, retester et conserver les résultats avant/après.

### Étape 9 - Documentation finale (C2.4.1)

- Finaliser les manuels de déploiement, d'utilisation et de mise à jour.
- Assembler le dossier final et ses annexes.
- Vérifier que chaque ligne de la grille possède au moins une preuve explicite.
- Exporter et contrôler visuellement la version PDF remise au jury.

## Règle de preuve

Chaque compétence sera considérée prête uniquement si les quatre éléments suivants existent :

1. une réalisation présente dans le dépôt ou l'environnement déployé ;
2. une explication claire dans le dossier ;
3. une preuve reproductible ou visuelle ;
4. un résultat vérifié, avec les limites éventuelles.

## Prochaine action

Commencer par l'étape 1 : définir le périmètre exact du prototype BC02 et écrire les user stories assorties de critères d'acceptation.
