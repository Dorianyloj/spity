# Plan de réalisation du dossier BC02

## Objectif

Valider intégralement le bloc 2 « Concevoir et développer des applications logicielles » du titre Expert en développement logiciel RNCP39583 à partir du projet Spity.

Le livrable final devra associer :

- une version stable et manipulable de Spity ;
- le code source et l'historique Git ;
- un dossier écrit répondant explicitement aux neuf compétences ;
- des preuves vérifiables : configurations, captures, rapports, scénarios, résultats et historique des corrections.

## Sources officielles

- Référentiel Expert en développement logiciel RNCP39583, bloc 2, pages 7 à 10.
- Grille d'évaluation BC02 du 10 octobre 2024.

## Matrice de couverture initiale

| Compétence | Livrable attendu | État initial de Spity | Travail nécessaire |
| --- | --- | --- | --- |
| C2.1.1 | Protocole de déploiement continu et critères de qualité/performance | Couvert techniquement | Conserver les preuves d'un déploiement distant et d'un exercice de retour arrière. |
| C2.1.2 | Protocole d'intégration continue | Couvert techniquement | Collecter une exécution GitHub Actions réussie et la configuration des protections de branches. |
| C2.2.1 | Architecture maintenable, prototype, frameworks et paradigmes | Présent | Prototype matching/événements livré, migration validée et architecture reliée aux user stories. Captures finales à ajouter en annexe. |
| C2.2.2 | Jeu de tests unitaires couvrant une fonctionnalité | Couvert | 83 tests Jest et 11 résultats d'intégration HTTP/MariaDB ; les parcours visuels complets seront étendus dans la recette. |
| C2.2.3 | Mesures de sécurité et d'accessibilité | Couvert sur le prototype | Matrice OWASP 2025, audit RGAA 4.1.2, corrections, quota HTTP, axe, Lighthouse authentifié et preuves mobiles produits. |
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

- [x] Corriger la configuration locale et créer les configurations Docker de test et de production.
- [x] Définir les environnements développement, test et production.
- [x] Définir les seuils de lint, typage, tests, couverture, sécurité et performance.
- [x] Rédiger le protocole de déploiement continu.

### Étape 3 - Intégration continue (C2.1.2)

- [x] Créer le pipeline CI.
- [x] Exécuter lint, typecheck, tests, couverture, build et contrôles de dépendances.
- [x] Définir la stratégie de branches, revues et fusion.
- [x] Conserver une exécution GitHub Actions réussie comme preuve.

### Étape 4 - Prototype maintenable (C2.2.1)

- [x] Corriger les défauts structurants existants.
- [x] Développer les parcours fonctionnels retenus.
- [x] Vérifier le rendu des routes et la conception responsive des interfaces.
- [x] Documenter architecture, frameworks, paradigmes et décisions techniques.
- [ ] Ajouter les captures desktop et mobile à l'annexe visuelle finale.

### Étape 5 - Tests unitaires (C2.2.2)

- [x] Mettre en place le harnais de test.
- [x] Tester les validateurs, le parseur de matériel, le contrôle d'origine et un composant critique.
- [x] Dépasser les seuils sur le périmètre déclaré et générer le rapport.
- [x] Étendre les tests aux routes et dépôts matching, partenariats et événements.
- [x] Vérifier les migrations et les parcours critiques avec une MariaDB isolée.
- [ ] Piloter les formulaires et parcours visuels avec Playwright dans le cahier de recette.

### Étape 6 - Sécurité et accessibilité (C2.2.3)

Documents de référence : [matrice OWASP](./07_SECURITE_OWASP_C223.md) et [audit RGAA](./08_ACCESSIBILITE_RGAA_C223.md).

- [x] Établir une matrice OWASP Top 10 : risque, mesure, preuve, test et reste à faire.
- [x] Choisir et justifier le RGAA 4.1.2 comme référentiel d'accessibilité.
- [x] Corriger les écarts de sécurité détectés et vérifier le quota au niveau HTTP.
- [x] Corriger les écarts de titres, contrastes, annonces, mouvement et reflow.
- [x] Auditer treize pages ou états publics/authentifiés et conserver rapports et captures CI.

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

Poursuivre l'étape 7 : définir le versionnement, produire une version fiable identifiable et documenter le déploiement progressif pour C2.2.4.
