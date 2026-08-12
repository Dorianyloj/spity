# Changelog

Les évolutions notables de Spity sont consignées dans ce fichier. Le projet suit [Semantic Versioning](https://semver.org/lang/fr/) et le format [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Unreleased]

### Added

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
