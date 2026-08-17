# Changelog

## Preuves visuelles Bloc 4

- ajout d'une procédure Playwright reproductible pour capturer les parcours réels de l'application ;
- ajout d'un index de captures, de manifestes datés et d'annexes visuelles intégrées directement à l'export PDF du dossier Bloc 4 ;
- ajout de captures techniques reproduisibles : état Git, historique GitHub, CI `main`, CI/staging `develop` et audit des sept compétences.

## Dossier Bloc 4 version 1.1

- développement détaillé de chaque compétence : attendu, processus, scénario, contrôles, preuves et limites ;
- ajout d'un guide de lecture homogène pour l'évaluation des sept compétences.

## Présentation jury du dépôt

- ajout d'un point d'entrée `JURY.md` à la racine avec parcours de consultation, compétences, preuves et contrôles ;
- clarification des README racine, documentation, application et exports ;
- ajout des repères de remise au manifeste d'intégrité du Bloc 4.

## Dossier de remise Bloc 4

- ajout d'un dossier jury structuré, d'une matrice de preuves, d'un glossaire et d'un guide de présentation ;
- intégration de ces documents dans le manifeste d'intégrité Bloc 4.

Les évolutions notables de Spity sont consignées dans ce fichier. Le projet suit [Semantic Versioning](https://semver.org/lang/fr/) et le format [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Unreleased]

### Added

- Chantier Bloc 4 couvrant C4.1.1 à C4.3.3, preuves figées, procédures de maintenance, observabilité et support.
- Journal des versions versionné : distinction entre release publiée, version observée en production et candidat CI, avec documentation obligatoire des correctifs.
- Registre de collaboration support/mainteneur : contexte anonymisé, transmissions réciproques, critères fonctionnels, expertise technique, validation et contrôle de confidentialité.
- Revue finale Bloc 4 automatisée : cohérence des sept compétences, sources opérationnelles, preuves, registres et manifeste SHA-256, avec une preuve de staging CI validé.
- C4.1.1 mise en œuvre avec une politique exécutable, des dérogations datées, un SBOM CycloneDX, un audit planifié, une revue des dépendances en pull request et un lot de mises à jour qualifié.
- Sonde de santé Node.js testable avec seuil de latence, reprises, rapport JSON et exercice d'alerte local sans impact production.
- Alerte GitHub automatique de supervision avec issue unique, artefact de contrôle et fermeture au retour à la normale.
- Formulaire de retour support et mise en situation fictive transparente fondée sur l'anomalie réelle d'accessibilité.
- Dossier de cadrage du bloc 4 avec matrice des sept compétences, état des preuves et plan d'action priorisé.
- Supervision planifiée de la route de santé de production et formulaire structuré de consignation des incidents.
- Modèle de pull request pour tracer la reproduction, la validation, le déploiement et le retour arrière des correctifs.
- Index documentaire à la racine du dépôt et centralisation des livrables RNCP sous `docs/`.
- Cahier de recettes Playwright couvrant les fonctions F01 à F10 avec rapports HTML, JSON et JUnit.
- Porte CI de recette navigateur bloquant le déploiement staging en cas d'échec.
- Registre d'anomalies et traçabilité des corrections avant/après.
- Manuels C2.4.1 séparés pour le déploiement, l'utilisation et la mise à jour de Spity.
- Dossier BC02 synthétique assemblé avec index des critères, annexes essentielles, captures, export PDF et manifeste d'intégrité.
- Audit officiel BC02 ajouté avec contrôle des 16 livrables, des 26 critères et des écarts de preuve.
- Couverture Jest étendue à tout `src/` avec 126 tests, 62,56 % des lignes et seuils globaux bloquants.
- Dossier BC02 réorganisé en 31 pages, rédigé à la première personne et renforcé sur les quatre compétences déterminantes.
- Rapports visuels de couverture Jest et de recette Playwright ajoutés aux annexes du dossier.

### Fixed

- Alertes hautes de l'outillage Lighthouse/Puppeteer supprimées par mise à jour contrôlée ; ESLint Next et types Node alignés avec les runtimes du projet.
- Workflow Release aligné avec la CI pour installer et utiliser le Chromium Playwright lors de l'audit authentifié.
- Contraste des états vides sur l'espace authentifié, avec un score Lighthouse accessibilité de 100 % sur les dix pages contrôlées.
- Recette BC02 adaptée aux noms accessibles des nouveaux liens de profils publics ; les six scénarios Playwright passent à nouveau.
- Audit Lighthouse rendu tolérant au verrouillage tardif du profil Chrome sous Windows lorsqu'un rapport valide a déjà été produit.
- Navigateur de l'audit authentifié épinglé sur le Chromium Playwright verrouillé par le projet au lieu de dépendre du Chrome préinstallé sur le runner CI.
- Mise à jour de Next.js, PostCSS et des dépendances transitives vulnérables sans changement cassant.
- Couverture globale remise au-dessus des seuils avec 152 tests ciblant notamment l'environnement, les journaux, les métadonnées de release et le routage.
- Structure sémantique des titres d'états vides pour la navigation assistée.
- Séparation des suites Jest, intégration et Playwright dans les harnais de test.
- Procédure de sauvegarde MariaDB et prérequis locaux de la documentation d'exploitation.
- Recette CI exécutée sur le build standalone livré dans l'image Docker.

## [0.1.0] - 2026-07-20

### Added

- Parcours d'inscription, connexion, profil et inventaire de matériel.
- Répertoire de lieux d'escalade et interface responsive.
- Matching de partenaires avec invitations et suivi des relations.
- Création d'événements, inscriptions et gestion de capacité.
- Environnements Docker séparés pour le développement, les tests et la production.
- CI avec contrôles ESLint, TypeScript, Jest, MariaDB, audit de dépendances, accessibilité et Lighthouse.
- Métadonnées de version et de révision exposées par la route de santé.

### Security

- Validation Zod des entrées, contrôle d'origine, cookies sécurisés et limitation de débit.
- En-têtes de sécurité, audit OWASP Top 10:2025 et contrôles de dépendances bloquants.
- Audit RGAA 4.1.2 sur les parcours publics et authentifiés du prototype.

### Changed

- Passage des actions GitHub officielles sur leur runtime Node.js 24 natif.
- Production d'images Docker immuables pour l'application et les migrations.

[Unreleased]: https://github.com/Dorianyloj/spity/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/Dorianyloj/spity/releases/tag/v0.1.0
