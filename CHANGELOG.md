# Changelog

Les évolutions notables de Spity sont consignées dans ce fichier. Le projet suit [Semantic Versioning](https://semver.org/lang/fr/) et le format [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/).

## [Unreleased]

### Added

- Cahier de recettes Playwright couvrant les fonctions F01 à F10 avec rapports HTML, JSON et JUnit.
- Porte CI de recette navigateur bloquant le déploiement staging en cas d'échec.
- Registre d'anomalies et traçabilité des corrections avant/après.

### Fixed

- Structure sémantique des titres d'états vides pour la navigation assistée.
- Séparation des suites Jest, intégration et Playwright dans les harnais de test.

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
