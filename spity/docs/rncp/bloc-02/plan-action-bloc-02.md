# Bloc 2 - Plan d'action et matrice de preuves

**Certification :** Expert en développement logiciel - RNCP 39583  
**Projet support :** Spity  
**Candidat :** Dorian Joly  
**Document de travail :** version initiale du 20 juillet 2026

## 1. Objet du livrable

Le bloc 2, « Concevoir et développer des applications logicielles », est évalué à partir du code source d'un logiciel développé pendant le parcours et de sa documentation associée.

Le dossier écrit final doit démontrer les neuf compétences suivantes :

- C2.1.1 : environnements de développement, de test et de déploiement ;
- C2.1.2 : intégration continue ;
- C2.2.1 : architecture, prototype, framework et paradigmes ;
- C2.2.2 : tests unitaires ;
- C2.2.3 : sécurité OWASP et accessibilité ;
- C2.2.4 : gestion des versions et déploiement progressif ;
- C2.3.1 : cahier de recette ;
- C2.3.2 : plan de correction des bogues ;
- C2.4.1 : manuels de déploiement, d'utilisation et de mise à jour.

Le dossier final ne devra pas seulement décrire Spity. Chaque affirmation importante devra être reliée à une preuve vérifiable : fichier source, configuration, workflow automatisé, résultat de test, capture d'écran, historique Git ou procès-verbal de recette.

## 2. Périmètre du prototype audité

L'audit initial porte sur la version de Spity présente sur la branche `develop` au 20 juillet 2026.

### Fonctionnalités actuellement manipulables

- inscription et connexion d'un utilisateur ;
- gestion d'une session par cookie sécurisé ;
- création et modification d'un profil grimpeur ou club ;
- gestion d'un inventaire de matériel ;
- consultation du tableau de bord ;
- consultation et filtrage du répertoire des salles, falaises et clubs ;
- consultation des fiches détaillées des lieux.

### Socle technique constaté

- Next.js 16.2.4 avec App Router ;
- React 19 et TypeScript en mode strict ;
- Tailwind CSS et composants d'interface réutilisables ;
- Route Handlers Next.js pour l'API ;
- Drizzle ORM et MariaDB ;
- React Hook Form et Zod pour les formulaires et la validation ;
- Docker Compose pour MariaDB et phpMyAdmin ;
- Git pour la gestion des versions.

## 3. Résultat de l'audit initial

Légende :

- **Présent** : élément déjà disponible et démontrable ;
- **Partiel** : base existante, mais preuve ou couverture insuffisante pour le jury ;
- **Absent** : élément à produire avant le rendu.

| Compétence | État initial | Éléments déjà présents | Écart à traiter pour le jury |
|---|---|---|---|
| C2.1.1 | Présent | Environnements séparés, image standalone, protocole, healthcheck et seuils Lighthouse vérifiés | Conserver la preuve d'un déploiement distant et d'un exercice de retour arrière |
| C2.1.2 | Présent | CI versionnée et protocole d'intégration documenté | Conserver une exécution GitHub Actions réussie et configurer les protections de branches |
| C2.2.1 | Présent | Parcours matching et événements complets, App Router, architecture par fonctionnalités, Drizzle et schéma documenté | Ajouter les captures desktop/mobile à l'annexe finale |
| C2.2.2 | Présent sur le prototype | 69 tests Jest, 10 résultats HTTP/MariaDB, concurrence et autorisations vérifiées | Ajouter les parcours visuels Playwright au cahier de recette |
| C2.2.3 | Partiel | Zod, bcrypt, cookies `httpOnly`, contrôle d'origine, verrouillage de compte, en-têtes HTTP, attributs ARIA | Réaliser une analyse OWASP Top 10, corriger les écarts, choisir le référentiel RGAA, auditer et documenter les résultats |
| C2.2.4 | Partiel | Gestion de versions Git et historique lisible ; build de production fonctionnel | Mettre en place un environnement déployé, tracer les versions et fournir des preuves de stabilité et de manipulation autonome |
| C2.3.1 | Absent | Vérifications techniques ponctuelles uniquement | Rédiger un cahier de recette complet et exécuter les tests fonctionnels, structurels et de sécurité |
| C2.3.2 | Absent | Corrections visibles dans l'historique Git, sans registre formalisé | Créer un registre d'anomalies avec qualification, priorité, cause, correction, retest et statut |
| C2.4.1 | Partiel | README d'installation et commandes principales | Rédiger trois manuels distincts et suffisamment détaillés : déploiement, utilisation et mise à jour |

## 4. Contrôles techniques de référence

Les contrôles suivants ont été exécutés le 20 juillet 2026 afin d'établir l'état initial :

| Contrôle | Commande | Résultat initial |
|---|---|---|
| Qualité statique | `npm run lint` | Succès, aucune erreur ESLint |
| Typage | `npm run typecheck` | Succès, aucune erreur TypeScript |
| Construction | `npm run build` | Succès, 22 routes générées |
| Tests unitaires | `npm test` | Commande et harnais absents |
| Intégration continue | Workflow dans `.github/workflows/` | Absent |

Ces résultats constituent une ligne de base. Ils devront être reproduits automatiquement par la CI et complétés par les tests, les audits et la recette.

## 5. Points de vigilance identifiés

### Sécurité

- Les identifiants de la base locale sont écrits en clair dans `docker-compose.yml`. Ils doivent être remplacés par des variables d'environnement documentées.
- Le rate limiting actuel repose sur la mémoire du processus. Il ne convient pas à un déploiement distribué et doit être présenté comme une limite du prototype ou remplacé par un stockage partagé.
- La politique de sécurité des contenus (CSP) n'est pas encore définie dans les en-têtes HTTP.
- La couverture des dix catégories OWASP n'est pas démontrée par un audit formalisé.
- Les entrées et sorties API ne sont pas encore toutes prouvées par des tests automatisés.

### Qualité et exploitation

- Aucun seuil de couverture, de performance ou d'accessibilité n'est actuellement versionné.
- Aucun workflow automatisé ne contrôle les contributions avant fusion.
- Aucun environnement de préproduction ou de production n'est documenté.
- Aucun journal de versions ou protocole de retour arrière n'est disponible.

### Périmètre fonctionnel

Le cadrage du MVP complet prévoit également les publications sociales, les topos collaboratifs, les événements et le matching. Le dossier devra distinguer explicitement :

- le périmètre effectivement développé et démontré pour le bloc 2 ;
- les fonctionnalités prévues mais non incluses dans la version évaluée ;
- les évolutions futures, qui ne devront pas être présentées comme déjà réalisées.

## 6. Plan de réalisation étape par étape

### Étape 1 - Qualité et intégration continue

Objectif : satisfaire C2.1.1 et C2.1.2 avec un protocole reproductible.

Actions :

1. Ajouter le harnais de tests et les scripts normalisés.
2. Créer un workflow GitHub Actions exécutant installation déterministe, lint, typage, tests et build.
3. Définir les règles de branches, les conditions de fusion et la gestion des secrets.
4. Fixer des critères mesurables de qualité et de performance.
5. Conserver des résultats d'exécution comme preuves.

Preuves attendues : workflow YAML, scripts `package.json`, capture d'une exécution réussie, tableau des seuils et protocole d'intégration.

### Étape 2 - Architecture et prototype

Objectif : démontrer C2.2.1 sur le code réellement livré.

Actions :

1. Documenter les couches interface, métier, accès aux données et infrastructure.
2. Expliquer App Router, les Server Components, les Client Components et les Route Handlers.
3. Relier les fonctionnalités démontrées aux user stories du cahier fonctionnel.
4. Illustrer un parcours complet, de l'interface jusqu'à MariaDB.
5. Justifier la maintenabilité, l'évolutivité et les choix ergonomiques responsive.

Preuves attendues : schémas, arborescence commentée, extraits de code courts, captures desktop et mobile, table user stories/écrans.

### Étape 3 - Harnais de tests unitaires

Objectif : satisfaire C2.2.2 avec une fonctionnalité critique couverte de bout en bout au niveau unitaire.

Actions :

1. Configurer Jest et React Testing Library, conformément au cadrage projet.
2. Tester en priorité la validation, la session, le contrôle d'origine et les règles métier du profil.
3. Ajouter des tests de composants sur les interactions principales.
4. Générer un rapport de couverture.
5. Définir un seuil progressif réaliste, puis l'augmenter sur le périmètre évalué.

Preuves attendues : fichiers de test, configuration, rapport de couverture, résultat CI et explication des cas limites.

### Étape 4 - Sécurité OWASP et accessibilité RGAA

Objectif : satisfaire C2.2.3 sans se limiter à une liste de bonnes pratiques.

Actions :

1. Cartographier les dix catégories OWASP Top 10 avec mesures, preuves et risques résiduels.
2. Corriger les secrets locaux, compléter les en-têtes de sécurité et vérifier les autorisations API.
3. Ajouter les contrôles automatisés pertinents : dépendances, analyse statique et tests de sécurité ciblés.
4. Retenir le RGAA comme référentiel d'accessibilité et définir le périmètre audité.
5. Effectuer des contrôles clavier, lecteur d'écran, contraste, structure sémantique et automatisation axe.
6. Documenter les non-conformités, corrections et limites restantes.

Preuves attendues : matrice OWASP, rapport d'audit, tests de sécurité, grille RGAA, captures et résultats avant/après.

### Étape 5 - Versions et déploiement

Objectif : satisfaire C2.2.4 avec une version réellement accessible et traçable.

Actions :

1. Définir les environnements développement, test, préproduction et production.
2. Automatiser ou formaliser le déploiement après validation de la CI.
3. Documenter les migrations Drizzle, les variables d'environnement et la stratégie de retour arrière.
4. Créer un journal des versions et des balises Git.
5. Réaliser une vérification fonctionnelle et technique après déploiement.

Preuves attendues : URL de démonstration, historique des versions, journal de déploiement, contrôle de santé et procès-verbal de validation.

### Étape 6 - Recette et correction des bogues

Objectif : satisfaire C2.3.1 et C2.3.2 avec des résultats exécutés, pas seulement des scénarios théoriques.

Actions :

1. Construire la matrice de traçabilité exigences/tests.
2. Écrire les scénarios nominaux, alternatifs, d'erreur, de sécurité et d'accessibilité.
3. Exécuter les tests dans un environnement identifié et consigner les résultats.
4. Qualifier chaque anomalie par sévérité, priorité, reproductibilité et impact.
5. Documenter la cause, la correction, le commit associé et le résultat du retest.

Preuves attendues : cahier de recette daté, jeux de données, captures, registre des anomalies et plan de correction.

### Étape 7 - Documentation d'exploitation

Objectif : satisfaire C2.4.1 et permettre à une autre personne de reprendre Spity.

Actions :

1. Rédiger le manuel de déploiement de zéro jusqu'au contrôle post-déploiement.
2. Rédiger le manuel d'utilisation selon les rôles grimpeur et club.
3. Rédiger le manuel de mise à jour incluant code, dépendances, base, sauvegarde et retour arrière.
4. Faire relire les procédures par une personne n'ayant pas développé le projet.

Preuves attendues : trois manuels versionnés et compte rendu d'un test de procédure.

### Étape 8 - Assemblage du dossier final

Objectif : produire un document lisible par le jury et directement aligné sur la grille.

Structure cible :

1. page de garde et déclaration du périmètre ;
2. résumé du projet et guide de lecture ;
3. C2.1.1 - environnements et déploiement continu ;
4. C2.1.2 - intégration continue ;
5. C2.2.1 - architecture et prototype ;
6. C2.2.2 - harnais de tests unitaires ;
7. C2.2.3 - sécurité et accessibilité ;
8. C2.2.4 - versions et déploiement ;
9. C2.3.1 - cahier de recette ;
10. C2.3.2 - correction des bogues ;
11. C2.4.1 - documentation d'exploitation ;
12. conclusion, limites et perspectives ;
13. annexes et index des preuves.

Le document maître sera maintenu dans un format source versionné, puis exporté en PDF. Les rapports volumineux resteront en annexes afin de conserver un corps de dossier lisible.

## 7. Matrice des preuves à compléter

| ID | Compétence | Preuve cible | Emplacement prévu | État |
|---|---|---|---|---|
| P01 | C2.1.1 | Description des environnements | `docs/bc02/02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md` | Présent |
| P02 | C2.1.1 | Protocole de déploiement continu | `docs/bc02/02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md` | Présent |
| P03 | C2.1.1 | Critères qualité et performance | `docs/bc02/02_ENVIRONNEMENTS_QUALITE_DEPLOIEMENT.md` | Présent |
| P04 | C2.1.2 | Workflow d'intégration continue | `.github/workflows/ci.yml` | Présent |
| P05 | C2.1.2 | Protocole d'intégration | `docs/bc02/03_PROTOCOLE_INTEGRATION_CONTINUE.md` | Présent |
| P06 | C2.2.1 | Architecture structurée | `docs/bc02/05_ARCHITECTURE_PROTOTYPE_C221.md` | Présent |
| P07 | C2.2.1 | Présentation du prototype | Dossier d'architecture et parcours locaux vérifiés | Présent, captures finales à ajouter |
| P08 | C2.2.2 | Jeu de tests et couverture | `docs/bc02/04_HARNAIS_TESTS_UNITAIRES.md` et `06_TESTS_INTEGRATION_C222.md` | Présent, preuve CI à actualiser |
| P09 | C2.2.3 | Matrice OWASP Top 10 | `docs/rncp/bloc-02/securite-owasp.md` | À produire |
| P10 | C2.2.3 | Audit d'accessibilité RGAA | `docs/rncp/bloc-02/accessibilite-rgaa.md` | À produire |
| P11 | C2.2.4 | Historique des versions | `CHANGELOG.md` et historique Git | Partiel |
| P12 | C2.2.4 | Version déployée et vérifiée | Journal de déploiement | À produire |
| P13 | C2.3.1 | Cahier de recette exécuté | `docs/rncp/bloc-02/cahier-recette.md` | À produire |
| P14 | C2.3.2 | Plan de correction | `docs/rncp/bloc-02/plan-correction.md` | À produire |
| P15 | C2.4.1 | Manuel de déploiement | `docs/rncp/bloc-02/manuel-deploiement.md` | À produire |
| P16 | C2.4.1 | Manuel d'utilisation | `docs/rncp/bloc-02/manuel-utilisation.md` | À produire |
| P17 | C2.4.1 | Manuel de mise à jour | `docs/rncp/bloc-02/manuel-mise-a-jour.md` | À produire |

## 8. Définition de terminé du bloc 2

Le bloc 2 sera considéré prêt pour le rendu lorsque :

- les neuf compétences possèdent au moins une preuve vérifiable ;
- lint, typage, tests et build réussissent dans la CI ;
- les rapports de couverture, sécurité, accessibilité et recette sont datés et reproductibles ;
- une version stable de Spity est déployée et manipulable en autonomie ;
- les anomalies connues sont corrigées ou explicitement qualifiées comme risques résiduels ;
- les trois manuels ont été testés ;
- le dossier PDF contient un index reliant chaque critère de la grille à ses preuves ;
- les sources du dossier, les annexes et le code correspondent au même commit et à la même version.
